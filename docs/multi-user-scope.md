# Multi-User Upgrade — Scope & Plan (v2)

Status: **Plan / scope only.** No code in this document; this is what we'll build and in what order.

> **v2 changelog (applied from `docs/multi-user-scope-review.md`):**
> - **Cookie path fixed**: CMS API moves from `/api/cms/*` to `/admin/api/cms/*`; staff cookie now correctly scoped `Path=/admin`.
> - **Roles** use surrogate PK + `slug`; system roles are **install-global** (`site_id = null`, seeded once); `is_system = true` makes capabilities **fully read-only** for all system roles (Owner, Admin, Editor, Author, Contributor, Subscriber). Customisation = "duplicate to custom role".
> - **`user_site_role_assignments`** junction table replaces `role_ids` JSONB. `user_site_memberships` is **kept** (slim) for join metadata only (`joined_at`, `invited_by_user_id`).
> - **`user_mfa_recovery_codes`** table replaces JSONB array — atomic single-use redemption, no race condition, supports "N codes remaining" UX.
> - **`email_outbox`** gains a `'sending'` state, `updated_at`, and the worker uses `FOR UPDATE SKIP LOCKED`. Orphan recovery on startup.
> - **TOTP replay prevention**: `mfa_totp_last_counter` on users; rejects re-use of an in-window code.
> - **Sessions** gain a dedicated `step_up_expires_at` (separate from `mfa_passed_at`) for sensitive-action re-auth windows.
> - **`users.deleted_at`** is the sole soft-delete signal; `'deleted'` is removed from the `status` enum.
> - **Plugin routes**: explicit `routes.get(path, capability, handler)` / `routes.getPublic(path, handler)` — no implicit "default-deny" fallback. The gate test becomes binary.
> - **`audit_events.event_type`** is a closed enum (`AUDIT_EVENT_TYPES`), each type carries a Zod schema for its `metadata_json`. Plugin-contributed events are namespaced.
> - **Public auth pages**: zero-JS `<form>` POST + 303 redirect; one optional external `auth-totp.js` for TOTP auto-advance only. Tight CSP `script-src 'self'`.
> - **`USER_SECRET_KEY`**: required env var; missing key = fatal boot error. Ship `scripts/generate-secret-key.ts`. No auto-generate-to-file.
> - **`users.delete_owner`** capability removed; "you can't delete the owner" becomes a code-level invariant in `authz.ts`.
> - **Token tables** drop the redundant `purpose` column.
> - **Three missing indexes** added on `audit_events`, `email_outbox`, `sessions`.

---

## Goal

Replace the current single-`admin_users` model with a proper multi-user identity, RBAC and security stack, supporting both **back-office staff** (who log into `/admin`) and **frontend members** (people who sign up on the public site). Schema is multi-site-ready from day one but ships single-site.

Per `CLAUDE.md`: pre-release, no backward compatibility, no shims, no "old + new side-by-side". The old `admin_users` / `sessions` tables and the entire current auth code path are deleted in this work — not migrated.

---

## 1. Decisions (locked in)

| Decision                | Choice                                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User population         | **Staff + frontend members**, with a `kind` discriminator (`'staff'` \| `'member'`) on `users` from day one. Single users table; the kind controls which UI they can reach. |
| Authorization model     | **RBAC + capabilities + per-resource ownership.** Capabilities like `pages.publish_own` are first-class; roles bundle them; pages/content carry `author_user_id`; "own" vs "any" is a real distinction. |
| Site scoping            | **Single-site UX, multi-site-ready schema.** Drop the singleton check. Every domain row gets `site_id`. `user_site_memberships` (slim) + `user_site_role_assignments` (junction). One site is created on setup. |
| MFA                     | **TOTP** (RFC 6238) with recovery codes. Optional per user; enforceable per role. Last-used counter prevents in-window replay. |
| Invitations + reset     | **Email-based.** SMTP via `nodemailer`. Templates live in `server/cms/email/`. `email_outbox` queue with `'sending'` state and `FOR UPDATE SKIP LOCKED` claim. |
| Audit log               | **Append-only** `audit_events` table; `event_type` is a closed enum with per-type Zod schemas; UI under "Users → Audit log". |
| Login rate limiting     | **Per-IP and per-account.** Token-bucket in-DB (no Redis). Lockout escalates per consecutive failure window. Always logged to audit. |
| Password policy         | Argon2id (already used). Min 12 chars. **HIBP k-anonymity check** on signup / password change / reset (opt-out via env for air-gapped). |
| Sessions                | Rotating refresh-style: opaque cookie tokens, sliding inactivity timeout (30 days idle / 90 days absolute), per-device sessions, "sign out other devices", dedicated step-up window. |
| Plugin SDK              | Plugins receive `currentUser` (id, kind, capabilities) on every request. Plugin admin pages and routes are **explicitly** capability-gated — no implicit fallback. |
| Cookie / API path       | CMS API moves from `/api/cms/*` to `/admin/api/cms/*`. Staff cookie `Path=/admin`. Member cookie `Path=/`. |

---

## 2. Database schema

### 2.1 New tables

#### `sites`
```
id                text primary key
slug              text not null unique
name              text not null
settings_json     jsonb not null default '{}'
created_at        timestamptz not null default now()
updated_at        timestamptz not null default now()
```
The current singleton `site` table is **dropped**. Setup seeds one row in `sites` with `id = 'default'`; the `check (id = 'default')` constraint is gone. All domain tables (`pages`, `content_collections`, `content_entries`, `media_assets`, `installed_plugins`, `published_runtime_assets`, etc.) gain `site_id text not null references sites(id) on delete cascade`. Indexes that include `slug` become composite `(site_id, slug)` uniques.

#### `users`
```
id                       text primary key
kind                     text not null check (kind in ('staff','member'))
email                    text not null
email_normalized         text not null   -- lowercased + trimmed
email_verified_at        timestamptz
display_name             text not null default ''
avatar_media_id          text references media_assets(id) on delete set null
password_hash            text             -- nullable: invited-but-not-yet-set users have null
password_updated_at      timestamptz
status                   text not null default 'active'
                           check (status in ('active','invited','suspended'))
locked_until             timestamptz       -- set by lockout, cleared on successful login or admin unlock
failed_login_count       integer not null default 0
mfa_enrolled             boolean not null default false
mfa_secret_encrypted     text             -- libsodium crypto_secretbox with USER_SECRET_KEY
mfa_totp_last_counter    bigint           -- last TOTP time-step accepted; replay guard
last_login_at            timestamptz
created_at               timestamptz not null default now()
updated_at               timestamptz not null default now()
deleted_at               timestamptz       -- sole soft-delete signal

create unique index users_email_normalized_active_idx
  on users (email_normalized) where deleted_at is null;
```

Notes:
- `email_normalized` decoupled from `email` so display casing is preserved; uniqueness uses the normalized form, scoped to non-deleted rows so re-creating an account after deletion is possible.
- Recovery codes are **not** here — they live in `user_mfa_recovery_codes` (atomic single-use, see below).
- Soft-delete uses `deleted_at` only. The `status` enum stays a clean three-state machine (`active` / `invited` / `suspended`), matching existing patterns on `content_collections` and `content_entries`.

#### `roles`
```
id                text primary key                -- surrogate nanoid
slug              text not null                   -- 'owner', 'admin', 'editor', 'author', 'contributor', 'subscriber', 'custom_xxx'
site_id           text references sites(id) on delete cascade
                                                  -- null = install-global system role; non-null = site-scoped custom role
name              text not null
description       text not null default ''
is_system         boolean not null default false  -- true = capabilities are READ-ONLY (all system roles)
capabilities_json jsonb not null default '[]'     -- array of capability ids, validated against the registry
created_at        timestamptz not null default now()
updated_at        timestamptz not null default now()

unique (site_id, slug)         -- one 'editor' per site (or one install-global if site_id is null)
```

**System roles are install-global** (one set, `site_id = null`, seeded once at install time, not per-site). They are:

- `owner`     — every capability, including `users.transfer_ownership`. Exactly one user per install holds this.
- `admin`     — everything except `users.transfer_ownership`. Cannot delete the Owner (code-level invariant in `authz.ts`).
- `editor`    — `pages.*` and `content.*` for any record; `media.*`; cannot install plugins or manage users.
- `author`    — `pages.create`, `pages.edit_own`, `pages.delete_own`, `pages.publish_own`; same for `content.*`; `media.upload`.
- `contributor` — same as author minus `*.publish_own`. Submits drafts only.
- `subscriber` — frontend member default. `members.read` only.

`is_system = true` means **all** capabilities on that role are read-only. Operators who want a tweaked role do **"duplicate to custom role"** in the UI: copy the system role's caps into a new `is_system = false` row scoped to the site they care about, then edit. This is the standard pattern in serious RBAC systems and it closes the "admin promotes themselves to owner by editing the admin role" privilege escalation path.

#### `user_site_memberships` (slim)
```
user_id              text not null references users(id) on delete cascade
site_id              text not null references sites(id) on delete cascade
joined_at            timestamptz not null default now()
invited_by_user_id   text references users(id) on delete set null
primary key (user_id, site_id)
```
This row exists if and only if the user is a member of the site. It carries **only** join metadata (when, by whom). Roles live in the next table.

#### `user_site_role_assignments`
```
user_id          text not null references users(id) on delete cascade
site_id          text not null references sites(id) on delete cascade
role_id          text not null references roles(id) on delete cascade
assigned_at      timestamptz not null default now()
assigned_by_id   text references users(id) on delete set null
primary key (user_id, site_id, role_id)

create index on user_site_role_assignments (role_id);
create index on user_site_role_assignments (site_id, user_id);
```
A user has zero or more roles per site; the union of their capabilities is computed on session hydration. FK cascades make role deletion safe; no stale ID strings to defend against.

#### `sessions` (replaces current `sessions`)
```
id_hash             text primary key                 -- sha256 of the cookie token
user_id             text not null references users(id) on delete cascade
site_id             text references sites(id) on delete set null
device_label        text not null default ''         -- "Chrome on macOS — Prague" derived from UA + IP geo at issue time
ip_address          inet
user_agent          text
created_at          timestamptz not null default now()
last_seen_at        timestamptz not null default now()
expires_at          timestamptz not null             -- absolute cap (90 days)
revoked_at          timestamptz                      -- non-null = invalidated
mfa_passed_at       timestamptz                      -- when this session satisfied MFA at login (session-level gate)
step_up_expires_at  timestamptz                      -- when an elevated re-auth window expires (null = no active step-up)

create index sessions_user_active_idx
  on sessions (user_id, expires_at) where revoked_at is null;
```

Sliding window: `last_seen_at + 30 days` is checked on every request; if exceeded, treat as expired. `expires_at` is the absolute 90-day cap. `last_seen_at` is debounced to one update per 5 min per session to avoid write amplification.

`mfa_passed_at` and `step_up_expires_at` are deliberately separate:
- `mfa_passed_at` answers "was MFA satisfied for this session at all?" (session-level gate; can be 25 days old and still valid for normal access).
- `step_up_expires_at` answers "is the user inside a fresh re-auth window for sensitive actions (transfer ownership, disable MFA, revoke another device, change password)?" — typically `now() + 15 min`, set on step-up confirmation.

#### `user_mfa_recovery_codes`
```
id          text primary key
user_id     text not null references users(id) on delete cascade
code_hash   text not null                  -- argon2id hash of the plaintext recovery code
created_at  timestamptz not null default now()
used_at     timestamptz                    -- null = available; set = consumed
batch_id    text not null                  -- groups codes generated together; for "regenerate" UX

create index user_mfa_recovery_codes_active_idx
  on user_mfa_recovery_codes (user_id) where used_at is null;
```

Atomic single-use redemption (no JSONB read-modify-write race):
```sql
UPDATE user_mfa_recovery_codes
   SET used_at = now()
 WHERE id = $1 AND user_id = $2 AND used_at IS NULL
RETURNING id
-- 0 rows = already consumed (race lost or already used); 1 row = success
```

Regenerate = delete all rows for `user_id`, insert ten new ones (one batch). UI shows "N of 10 codes remaining" via `count where used_at is null`.

#### `email_verification_tokens`, `password_reset_tokens`, `invitation_tokens`
Three single-use token tables, identical shape (no redundant `purpose` column — table identity is the purpose):
```
id_hash         text primary key       -- sha256 of the token
user_id         text not null references users(id) on delete cascade
issued_at       timestamptz not null default now()
expires_at      timestamptz not null
consumed_at     timestamptz
metadata_json   jsonb not null default '{}'   -- e.g. invitation: { siteId, roleIds[], invitedBy }
```
Three-table design (vs one unified) gives cleaner indexes, clearer access patterns, and prevents accidentally querying an invitation token as a password-reset token.

#### `mfa_pending_challenges`
Short-lived (5 min) record between password-OK and MFA-OK during login. Avoids stuffing an unverified-MFA session into `sessions`.
```
id_hash       text primary key
user_id       text not null references users(id) on delete cascade
issued_at     timestamptz not null default now()
expires_at    timestamptz not null
ip_address    inet
user_agent    text
```

#### `login_attempts`
Per-IP and per-account rate limiting. Append-only, GC'd on a timer.
```
id              bigserial primary key
attempted_at    timestamptz not null default now()
email_norm      text                  -- nullable: pre-form-submit IP-only attempts log too
ip_address      inet not null
result          text not null check (result in ('success','bad_password','no_user','locked','mfa_failed','rate_limited'))

create index on login_attempts (ip_address, attempted_at desc);
create index on login_attempts (email_norm, attempted_at desc) where email_norm is not null;
```

Rate-limit logic:
- Per IP: max 30 attempts / 10 min, then 401 + `Retry-After`.
- Per account: 5 consecutive failures → `users.locked_until = now() + 15min`, doubling per repeated lockout up to 24 h.
- Successful login resets `failed_login_count` and clears `locked_until`.

#### `audit_events`
```
id              text primary key
site_id         text references sites(id) on delete set null
actor_user_id   text references users(id) on delete set null   -- null = system or anonymous
actor_kind      text not null check (actor_kind in ('user','system','anonymous','plugin'))
event_type      text not null               -- validated against the closed AUDIT_EVENT_TYPES enum
target_type     text                        -- 'user','page','content_entry','plugin','site',...
target_id       text
ip_address      inet
user_agent      text
metadata_json   jsonb not null default '{}' -- shape validated by the per-event-type Zod schema
created_at      timestamptz not null default now()

create index on audit_events (site_id, created_at desc);
create index on audit_events (actor_user_id, created_at desc);
create index on audit_events (event_type, created_at desc);
create index on audit_events (target_type, target_id, created_at desc);  -- "history for this resource"
```

`event_type` is **not** free text. It's validated on insert against a closed `AUDIT_EVENT_TYPES` enum in `src/core/auth/auditEventTypes.ts`, and each type has a Zod schema for `metadata_json`. Plugin-contributed event types are namespaced (`acme.workflow.entry.approved`) parallel to plugin capabilities. This makes the audit-log UI a typed discriminated union — context-rich rendering per event type, no "opaque JSON dump" rows.

Append-only by convention; no UPDATE/DELETE in app code. We'll consider a Postgres role restriction later if needed.

#### `email_outbox`
```
id            text primary key
to_address    text not null
subject       text not null
body_text     text not null
body_html     text
status        text not null default 'pending'
                check (status in ('pending','sending','sent','failed'))
attempts      integer not null default 0
last_error    text
scheduled_for timestamptz not null default now()
sent_at       timestamptz
created_at    timestamptz not null default now()
updated_at    timestamptz not null default now()

create index email_outbox_pending_idx
  on email_outbox (status, scheduled_for) where status in ('pending','sending');
```

Worker claim is atomic and parallelism-safe:
```sql
WITH claimed AS (
  SELECT id FROM email_outbox
   WHERE status = 'pending' AND scheduled_for <= now()
   ORDER BY scheduled_for
   LIMIT 10
   FOR UPDATE SKIP LOCKED
)
UPDATE email_outbox
   SET status = 'sending', updated_at = now()
 WHERE id IN (SELECT id FROM claimed)
RETURNING *;
```

On startup (and every 10 min), reset orphaned `'sending'` rows whose worker died:
```sql
UPDATE email_outbox
   SET status = 'pending', updated_at = now()
 WHERE status = 'sending' AND updated_at < now() - interval '10 minutes';
```

This eliminates the lost-email-on-crash and double-send-on-hot-reload classes that the v1 doc had.

### 2.2 Domain table changes

- **`pages`**: add `site_id`, `author_user_id`, `last_modified_by_user_id`. `unique (slug)` becomes `unique (site_id, slug)`. Existing `published_by` column renames to `last_published_by_user_id` (FK to `users`).
- **`page_versions`**: `published_by` FK target moves from `admin_users(id)` to `users(id)`.
- **`content_entries`**: add `site_id`, `author_user_id`, `last_modified_by_user_id`. `published_by_user_id` recorded on `content_entry_versions`.
- **`content_collections`**: add `site_id`. `content_collections_slug_active_idx` becomes `(site_id, slug) where deleted_at is null`.
- **`media_assets`**: add `site_id`, `uploaded_by_user_id`. `public_path` unique becomes `(site_id, public_path)`.
- **`installed_plugins`**: add `site_id`. Plugin enable/disable is per-site.
- **`published_runtime_assets`**, **`content_entry_redirects`**, **`plugin_records`**: add `site_id` (cascades from parents already, just denormalised for indexing).

### 2.3 Migration

One migration: `012_multi_user`. Pre-release, no production data:

1. Drop `admin_users`, `sessions`, the old `site` singleton.
2. Create `sites`, `users`, `roles`, `user_site_memberships`, `user_site_role_assignments`, the new `sessions`, `user_mfa_recovery_codes`, the three token tables, `mfa_pending_challenges`, `login_attempts`, `audit_events`, `email_outbox`.
3. Add `site_id` + `author_user_id` columns and rebuild composite uniques on every domain table.
4. Seed install-global system roles (in the migration: one row per system role, `site_id = null`, `is_system = true`, surrogate IDs).

Local dev DBs are wiped and re-migrated. Per `CLAUDE.md` §"Database, schema, and stored data" this is fine.

---

## 3. Capabilities registry

Capabilities are a closed enum **in code**, not user-editable strings. Live in `src/core/auth/capabilities.ts` and validated by Zod on read/write of any role row.

```
// pages
pages.create
pages.edit_own
pages.edit_any
pages.delete_own
pages.delete_any
pages.publish_own
pages.publish_any

// content (per-collection scoping is a follow-up; today wildcard)
content.create
content.edit_own
content.edit_any
content.delete_own
content.delete_any
content.publish_own
content.publish_any
content.manage_collections   // create/edit/delete the collection definitions themselves (separate from entry CRUD)

// media
media.upload
media.delete_own
media.delete_any

// site config
site.edit_settings
site.edit_navigation         // future, when nav lives outside pages
site.manage_runtime          // dependency lock / package.json edits

// users + roles
users.invite
users.list
users.edit_profile_any       // edit display name / email / avatar of others; you can always edit yourself
users.suspend
users.delete                 // "can't delete the owner" enforced as a code-level invariant in authz.ts
users.transfer_ownership     // owner only
users.assign_roles
roles.manage                 // create/edit/delete custom roles

// plugins
plugins.list
plugins.install
plugins.configure
plugins.uninstall

// audit
audit.read

// frontend members
members.read                 // can read members-only published content
members.comment              // future hook
```

Plugin manifests can declare `capabilities: [{ id: 'acme.workflow.approve', label, description }, ...]` — these register into a per-install runtime registry on install and are removed on uninstall, so the role editor UI can show them. They are namespaced by plugin id.

When a plugin is uninstalled, role rows that reference its capabilities keep the orphaned IDs but the IDs are treated as inactive at runtime. An audit event `roles.capability.orphaned` is emitted on next role load. A future cleanup tool can prune them.

---

## 4. Authorization plumbing

### 4.1 Server-side

A new `server/cms/authz.ts` exports:

```
type AuthContext = {
  user: UserRow
  site: SiteRow
  membership: UserSiteMembershipRow
  capabilities: ReadonlySet<Capability>     // union of caps from all roles assigned for (user, site)
  session: SessionRow
}

requireUser(req, db): Promise<AuthContext>            // throws 401
requireCapability(ctx, cap): void                     // throws 403
requireOwnerOr(ctx, cap, ownerUserId): void           // grants if ctx.user.id === ownerUserId, else requireCapability
requireKind(ctx, 'staff' | 'member'): void
requireStepUp(ctx): void                              // throws 401 with code 'step_up_required' if no fresh window
isInstallOwner(ctx): boolean                          // helper for the "can't delete owner" invariant
```

Every handler in `server/cms/handlers.ts` is rewritten to use this. The current "any logged-in admin can do anything" check is **deleted**, not parallel-tracked.

### 4.2 Frontend gating

`src/core/auth/clientAuthContext.ts` — a Zustand store hydrated from `GET /admin/api/cms/me` on app boot:

```
type ClientAuthState =
  | { state: 'unauthenticated' }
  | { state: 'mfa_pending', userEmail }
  | { state: 'authenticated',
      user, site, capabilities: Set<Capability>,
      can(cap): boolean,
      canOwn(cap, ownerId): boolean,
      stepUpFresh: boolean }
```

Components import `useCan('pages.publish_any')` instead of checking strings. The toolbar Publish button, the "delete page" menu, the plugin install button etc. all gate on this. Routes that the user can't reach 404 in the React layer (we don't show a Forbidden screen for nav items the user shouldn't even see).

### 4.3 Plugin SDK additions

`PluginAdminAppApi`, `EditorPluginApi`, `ServerPluginApi` all gain:

```ts
auth: {
  currentUser(): { id, kind, displayName, capabilities: Capability[] }
  can(cap: string): boolean
  requireCapability(cap: string): void   // throws on server, throws + redirects on client
}
```

`PluginAdminPage` gains `requiredCapabilities?: Capability[]` — pages without satisfied caps don't render in nav, and the route 404s in the router.

`PluginManifest` gains:
```ts
capabilities?: Array<{ id: string, label: string, description?: string }>   // contributed caps
defaultRoleAssignments?: Record<RoleSlug, string[]>                          // 'admin' role gets these by default at install time
```

**Server route registration is explicit, no implicit fallback** (this is the v1→v2 fix):

```ts
interface ServerPluginRoutes {
  /** Capability-gated route. The runtime calls requireCapability(capability) before invoking handler. */
  get(path: string, capability: Capability, handler: ServerPluginRouteHandler): void
  post(path: string, capability: Capability, handler: ServerPluginRouteHandler): void
  patch(path: string, capability: Capability, handler: ServerPluginRouteHandler): void
  delete(path: string, capability: Capability, handler: ServerPluginRouteHandler): void

  /** Public route, requires no capability. Explicit opt-in — never a default. */
  getPublic(path: string, handler: ServerPluginRouteHandler): void
  postPublic(path: string, handler: ServerPluginRouteHandler): void
}
```

There is no third "unannotated" form. The gate test (`plugin-routes-require-capability.test.ts`) becomes a binary AST scan: every plugin route registration must use one of the named methods above. No silent fallback ever applies.

---

## 5. API surface

All CMS API routes move under `/admin/api/cms/*`. This makes `Path=/admin` on the staff cookie coherent — staff cookie is sent for both the React shell and every API call, but never leaks to the public site at `/`.

### 5.1 Routes added

```
POST   /admin/api/cms/setup                        (install owner — first user, kind=staff, role=owner)
GET    /admin/api/cms/setup/status

POST   /admin/api/cms/auth/login                   (email + password → either { ok } or { mfaRequired: true })
POST   /admin/api/cms/auth/login/mfa               (consumes mfa challenge with TOTP or recovery code)
POST   /admin/api/cms/auth/logout
POST   /admin/api/cms/auth/logout-all              (revokes all sessions for current user)
GET    /admin/api/cms/auth/sessions                (current user's device list)
DELETE /admin/api/cms/auth/sessions/:id            (revoke a device)
POST   /admin/api/cms/auth/step-up                 (re-auth: password [+ TOTP if enrolled] → opens 15-min step-up window)

POST   /admin/api/cms/auth/password/forgot         (issue reset token + queue email; always returns 200)
POST   /admin/api/cms/auth/password/reset          (consume token + new password + HIBP check)
POST   /admin/api/cms/auth/password/change         (current user; requires step-up)

POST   /admin/api/cms/auth/email/verify/request    (resend verification email)
POST   /admin/api/cms/auth/email/verify            (consume verification token)

GET    /admin/api/cms/auth/mfa                     (current user's mfa status)
POST   /admin/api/cms/auth/mfa/enroll/start        (returns secret + otpauth URL — never persists secret yet)
POST   /admin/api/cms/auth/mfa/enroll/confirm      (TOTP code → persist mfa_secret_encrypted, return recovery codes)
POST   /admin/api/cms/auth/mfa/disable             (requires step-up)
POST   /admin/api/cms/auth/mfa/recovery/regenerate (requires step-up)

GET    /admin/api/cms/me                           (auth context: user, site, capabilities, session metadata, stepUpFresh)
PATCH  /admin/api/cms/me                           (display name, avatar; email change requires step-up + re-verifies)

GET    /admin/api/cms/users                        (staff list; cap: users.list)
POST   /admin/api/cms/users/invite                 (cap: users.invite)
POST   /admin/api/cms/users/invite/accept          (consumes invitation token; sets password; offers MFA enroll)
GET    /admin/api/cms/users/:id
PATCH  /admin/api/cms/users/:id                    (cap: users.edit_profile_any; or self)
PATCH  /admin/api/cms/users/:id/status             (suspend/reactivate; cap: users.suspend)
DELETE /admin/api/cms/users/:id                    (cap: users.delete; rejected if target is install owner)
PATCH  /admin/api/cms/users/:id/roles              (cap: users.assign_roles)
POST   /admin/api/cms/users/:id/transfer-ownership (cap: users.transfer_ownership; owner only; requires step-up)

GET    /admin/api/cms/members                      (frontend members list; same surface, kind=member)

GET    /admin/api/cms/roles
POST   /admin/api/cms/roles                        (custom; cap: roles.manage)
POST   /admin/api/cms/roles/:id/duplicate          (copy a system role into a new custom one; cap: roles.manage)
PATCH  /admin/api/cms/roles/:id                    (rejected if is_system = true)
DELETE /admin/api/cms/roles/:id                    (rejected if is_system = true)

GET    /admin/api/cms/audit                        (paginated; cap: audit.read; filters by event_type, actor, target, date range)

GET    /admin/api/cms/auth/capabilities            (full registry, including plugin-contributed caps)

POST   /api/public/auth/register                   (frontend member signup; gated by site.settings.allowMemberSignup)
POST   /api/public/auth/login                      (frontend member login; sets pb_session_member, Path=/)
POST   /api/public/auth/logout
GET    /api/public/auth/me                         (limited: { id, displayName, avatar, isMember: true })
```

### 5.2 Existing routes — capability mapping

Every existing handler swaps `getAuthenticatedAdmin` → `requireUser + requireCapability(...)`:

| Endpoint                                              | Required capability                                     |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `GET /admin/api/cms/site`                             | (any authenticated staff)                               |
| `PUT /admin/api/cms/site`                             | `site.edit_settings`                                    |
| `POST /admin/api/cms/runtime/dependencies/resolve`    | `site.manage_runtime`                                   |
| `POST /admin/api/cms/runtime/preview`                 | (any staff with `pages.edit_*`)                         |
| `POST /admin/api/cms/media`                           | `media.upload`                                          |
| `DELETE /admin/api/cms/media/:id`                     | `media.delete_own` if uploader, else `media.delete_any` |
| `POST /admin/api/cms/plugins/package`                 | `plugins.install`                                       |
| `PATCH /admin/api/cms/plugins/:id`                    | `plugins.configure`                                     |
| `DELETE /admin/api/cms/plugins/:id`                   | `plugins.uninstall`                                     |
| `POST /admin/api/cms/content/collections`             | `content.manage_collections`                            |
| `POST /admin/api/cms/content/collections/:id/entries` | `content.create`                                        |
| `PUT  /admin/api/cms/content/entries/:id`             | `content.edit_own` if author, else `content.edit_any`   |
| `POST /admin/api/cms/content/entries/:id/publish`     | `content.publish_own` / `_any`                          |
| `DELETE /admin/api/cms/content/entries/:id`           | `content.delete_own` / `_any`                           |
| `POST /admin/api/cms/publish`                         | `pages.publish_any`                                     |

Per-page CRUD endpoints (currently bundled inside `PUT /admin/api/cms/site`) are split out as part of this work because per-page authz needs per-page granularity.

### 5.3 Public site gating

`server/router.ts` gains a per-page `visibility` field with values `public` / `members_only`. `members_only` requires a member session cookie + `members.read`. Pages and content collections both grow this field. Renders a 401 page (configurable per site) when blocked. Member-gated responses always set `Cache-Control: private, no-store` so they cannot be cached at any CDN.

`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` are first-class server-rendered routes (see §6.5).

---

## 6. UI surface

### 6.1 Existing admin shell

`AdminLayout.tsx` adds a "Users" workspace alongside Site / Content / Plugins. The `AdminWorkspace` union becomes `'site' | 'content' | 'plugins' | 'pluginPage' | 'users'`. Every `AdminSectionNavigation` link is wrapped with `useCan(...)`; links the user can't access aren't rendered (no greyed-out bait).

The toolbar gets:
- A **user menu** (avatar, name, role badge, "Account settings", "Sign out", "Sign out all devices").
- A **site picker** placeholder (single site for now, but the slot exists so multi-site is a UI-only change later).

### 6.2 New `/admin/users` workspace

Tabs:
- **Staff** — list, invite, edit, suspend, role assign.
- **Members** — list, search, suspend, delete; signup-source filter.
- **Roles** — list system + custom; **system role caps are read-only across the board, with a "Duplicate to custom role" button**; create / edit / delete custom roles.
- **Audit log** — searchable, filterable, paginated; renders typed event metadata (not raw JSON) thanks to the per-event Zod schema.
- **Account** (your own profile) — display name, avatar, email change (requires step-up + re-verifies), password change (requires step-up), MFA enroll/disable, recovery codes, active sessions list, "Sign out other devices".
- **Site security** (cap: `site.edit_settings`) — toggle member signup, configure password-reset email branding, toggle "require MFA for staff", lockout thresholds preview.

UI primitives: reuse `Button`, `Input`, `Switch`, `Select`, `SearchBar`, `FilterBar`, `ContextMenu`, `Tree*`. Likely new shared primitives: `RoleBadge`, `CapabilityChecklist`, `DeviceListRow`, `AuditEventRow`. Drop them in `src/ui/components/` if reused, otherwise local under `src/admin/users/components/`.

### 6.3 Setup flow change

The setup screen creates the **owner** (kind=staff, role=owner). Same form fields. Copy clarifies this is the install's owner.

### 6.4 Login flow change

- Login page asks email + password.
- If `mfaRequired`, show TOTP entry (with "use a recovery code" link).
- After login, redirect to last-visited admin path or `/admin/site`.
- Locked accounts show a clear message with retry-after time.
- Sensitive actions (transfer ownership, revoke other devices, change password, disable MFA, delete account) trigger an inline step-up modal that calls `POST /admin/api/cms/auth/step-up` first.

### 6.5 Public auth pages

Routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`. Server-rendered HTML, **zero inline JavaScript**, plain `<form method="POST">` + 303 redirect (POST/Redirect/GET). This means:

- Login → POST credentials → 303 to `/admin` or to `/login?mfa=...`
- Register → POST → 303 to `/register/check-email`
- Forgot-password → POST → 303 to `/forgot-password/check-email` (always; doesn't leak whether the email exists)
- Reset-password → POST → 303 to `/login?reset=ok` or back to the form with an error
- Email verify → GET link lands on a confirmation page → POST confirm → 303

CSP can be tight: `default-src 'self'; script-src 'self'; style-src 'self'; form-action 'self'; frame-ancestors 'none';`. No `unsafe-inline`.

The **only** UI feature that benefits from JS is TOTP auto-submit when the 6th digit is entered. That ships as a single small external file, `/assets/auth-totp.js`, loaded with `<script src="/assets/auth-totp.js" defer>`. This is CSP-compatible with `script-src 'self'`. If JS is blocked, the user just clicks Submit — graceful degradation.

Templates live in `server/cms/publicAuth/templates/`. Same theming hooks as the existing public renderer (`src/styles/globals.css` tokens are inlined into the head from site settings). No React bundle on these pages — consistent with the project's "clean HTML/CSS, no framework runtime in published output" rule.

---

## 7. Email

`server/cms/email/`:
- `index.ts` — `enqueueEmail(to, template, vars)` writes to `email_outbox`.
- `worker.ts` — in-process, polls every 5 s, claims with `FOR UPDATE SKIP LOCKED`, sends via `nodemailer`, marks `sent` / `failed` with backoff. Resets orphaned `'sending'` rows on startup.
- `templates/` — `invitation.ts`, `passwordReset.ts`, `emailVerify.ts`, `mfaEnabled.ts`, `accountSuspended.ts`, `loginNewDevice.ts`. Each exports `subject(vars)` + `text(vars)` + `html(vars)`. Plain HTML, no MJML / framework.

Env (no auto-generation; missing required keys = fatal boot):
```
SMTP_URL=smtp://user:pass@host:587                   (optional at install; queued mail waits for it)
SMTP_FROM="Page Builder <noreply@example.com>"       (required when SMTP_URL is set)
SMTP_REPLY_TO=                                       (optional)
USER_SECRET_KEY=<base64-32-bytes>                    (required; missing = fatal boot error)
APP_BASE_URL=https://example.com                     (required for absolute links in emails)
HIBP_ENABLED=true                                    (opt-out for air-gapped installs)
```

Ship `scripts/generate-secret-key.ts` so first-time operators can do `bun run scripts/generate-secret-key.ts` to get a key suitable for `USER_SECRET_KEY`. Document in the deployment guide. Auto-generation to a file is **not** implemented — that pattern silently bakes secrets into Docker image history.

`readServerConfig` is rewritten to validate all of the above with Zod and fail at boot with a clear message if anything required is missing.

Status endpoint (never reveals SMTP_URL itself): `GET /admin/api/cms/system/email/status` returns `{ smtpConfigured: boolean, queueDepth: number, lastSendAt }`.

---

## 8. Sessions, cookies, MFA details

- Cookie names: staff = `pb_session_staff`, member = `pb_session_member`. Both `HttpOnly`, `Secure` (when `APP_BASE_URL` is `https://`), `SameSite=Lax`. **Staff cookie `Path=/admin`** (works because the API moved under `/admin/api/cms/*`). Member cookie `Path=/`.
- Token = 32 random bytes base64url. Stored in DB as sha256.
- Sliding expiry: every authenticated request updates `last_seen_at` (debounced once / 5 min per session).
- **Step-up auth** (transfer ownership, revoke another device, change password, disable MFA, regenerate recovery codes, delete user): user re-enters password (+ TOTP if enrolled) on a modal that calls `POST /admin/api/cms/auth/step-up`. On success, `sessions.step_up_expires_at = now() + 15 min`. Sensitive endpoints call `requireStepUp(ctx)`.
- **Session rotation on privilege change**: when a user's roles change, when their password changes, or when MFA is enabled/disabled, all of *their* other sessions are revoked. Their current session keeps a fresh token.
- TOTP: `otplib` (MIT). Secret 20 bytes. SHA1 (RFC 6238 + Authy/Google compat). 30 s window, ±1 step tolerance. **Replay guard**: reject if `current_step ≤ users.mfa_totp_last_counter`; on success update `last_counter`. NIST SP 800-63B §5.1.4.2 compliant.
- Recovery codes: 10 codes, 10 chars each (Crockford base32 — no I/O/0/1 ambiguity). Argon2id-hashed. Atomic redemption via `user_mfa_recovery_codes` (no JSONB race).
- MFA secret encryption: libsodium `crypto_secretbox` with `USER_SECRET_KEY`. Missing or unreadable key = fatal boot error.

**CSRF posture**: `SameSite=Lax` blocks cross-site POST/PATCH/DELETE for the API. The React shell calls the API same-origin under `/admin/api/cms/*`. Public auth pages use `<form action="/login" method="POST">` which Lax allows because it's a same-site top-level form submission (and a 303 redirect is a same-site navigation). No double-submit token needed.

---

## 9. Plugin system implications

- `plugins.install` cap-gates plugin install.
- Each installed plugin's `capabilities` register into the live registry; uninstall removes them. Roles that referenced now-uninstalled caps keep the orphaned IDs but they're inactive at runtime; an audit event `roles.capability.orphaned` is emitted.
- `PluginAdminPage.requiredCapabilities` filters nav and gates the route.
- The plugin SDK runtime always passes `currentUser` into route handlers and editor/admin app contexts.
- **Plugin route registration is explicit**: every route is either `routes.get(path, capability, handler)` (gated) or `routes.getPublic(path, handler)` (explicitly public). There is no implicit fallback. The runtime calls `requireCapability(capability)` automatically before invoking the handler — plugin authors don't need to remember to call it.
- `phase-g-bridge-security.test.ts` is updated; new `plugin-routes-require-capability.test.ts` does an AST scan asserting every plugin route registration uses one of the named methods. Binary pass/fail, no ambiguity.

---

## 10. Validation, Zod schemas, types

Per project rules, schemas are the source of truth. New schema modules:

- `src/core/auth/capabilities.ts` — `CAPABILITIES` array constant + `CapabilitySchema = z.enum(CAPABILITIES)`.
- `src/core/auth/auditEventTypes.ts` — `AUDIT_EVENT_TYPES` constant + per-type metadata schemas + `AuditEventSchema` discriminated union.
- `src/core/auth/schemas.ts` — `UserSchema`, `RoleSchema`, `MembershipSchema`, `RoleAssignmentSchema`, `SessionSchema`, `MfaEnrollResponseSchema`, etc.
- Extend `src/core/persistence/responseSchemas.ts` with new envelopes (`MeResponseSchema`, `LoginResponseSchema`, `UsersListResponseSchema`, `AuditEventsResponseSchema`, …).
- All new request bodies validated with Zod before reaching the repository layer.

Domain types come from `z.infer<typeof Schema>`; no parallel TS interfaces.

---

## 11. Architectural tests added / updated

- **New** `auth-required-on-cms-handlers.test.ts` — every `/admin/api/cms/*` handler must call `requireUser` (and not bypass), enforced by AST scan.
- **New** `capabilities-registry-closed.test.ts` — every capability string used in source must exist in the registry constant.
- **New** `audit-event-types-closed.test.ts` — every event_type string passed to `auditEvent(...)` must exist in `AUDIT_EVENT_TYPES`.
- **New** `no-direct-cookie-access.test.ts` — only `server/cms/sessionCookie.ts` may set/read auth cookies.
- **New** `plugin-routes-require-capability.test.ts` — plugin-handled routes must use one of `routes.get/post/patch/delete` (with `capability`) or `routes.getPublic/postPublic`. No third form.
- **New** `no-inline-script-in-public-auth.test.ts` — public auth templates must not contain `<script>...</script>` blocks. Only `<script src="..." />` allowed.
- **Update** existing tests that reference `admin_users` / `getAuthenticatedAdmin` to point at the new symbols (or be deleted if the symbol no longer exists).

---

## 12. Test coverage we'll write

- **Unit**: capability set evaluation; role merging (multi-role union); Argon2 + HIBP guard; TOTP verify with clock skew; **TOTP replay rejection** (same valid code rejected on second submit); recovery-code single-use under concurrency (parallel SELECT FOR UPDATE test); lockout escalation; sliding session expiry; step-up window expiry; system-role-immutability rejection.
- **Repository**: every new repository function with happy-path + edge cases (deleted user, suspended user, invitation-already-consumed, orphan recovery-code-batch, etc).
- **HTTP**: every new endpoint exercises 200 + 400 + 401 + 403 + 409 paths. Login flow integration test covers password→mfa→session.
- **Audit log**: every security-relevant action writes the expected typed event with the expected metadata schema satisfied.
- **Email worker**: kill-mid-send test (claimed row stays `'sending'`, orphan recovery returns it to `'pending'`); two-worker race test (no double send); send failure / backoff.
- **Plugin SDK**: a fake plugin registers a capability; install makes it appear in the registry; uninstall removes it; orphaned cap on a role logs the audit event. Plugin route gating: `routes.get(path, cap, handler)` returns 403 to a user lacking `cap`; `routes.getPublic` does not.
- **Public auth pages**: forms work without JS (Bun-side fetch with no JS execution); CSP header asserts `script-src 'self'` and no `unsafe-inline`.

Aim: ≥90 % branch coverage on `server/cms/auth*`, `server/cms/authz.ts`, `server/cms/email/`, `src/core/auth/`. Existing `bun test` gate must stay green.

---

## 13. Phasing — how this lands in the repo

Per pre-release rules: no half-finished, no compatibility shims. We ship **one feature-complete change** organized internally as the following stages, but merged together. (If you'd prefer staged PRs, each one must leave the project compilable and gate-green; that splits merges, not features.)

**Stage A — Foundation (schema + identity + sessions + RBAC core + path move)**
1. Migration 012: drop old tables, create new ones, seed install-global system roles.
2. `server/cms/authz.ts`, capabilities registry, audit event types registry.
3. **Move all CMS routes to `/admin/api/cms/*`**; rewrite client persistence layer to match.
4. New session middleware + step-up plumbing, replacing `getAuthenticatedAdmin` everywhere.
5. `/admin/api/cms/me`, login, logout, setup-owner.
6. Frontend client auth context + `useCan`. Login page rewritten.

After Stage A internally: site is single-user-still-works; setup creates an Owner; everything is capability-checked but only one user exists. Tests still green.

**Stage B — Multi-user staff: invite, manage, roles UI, audit log**
7. Invitation flow + `email_outbox` worker + nodemailer + templates + `generate-secret-key` script.
8. `/admin/users` workspace: Staff tab, Roles tab (with system-role-read-only + Duplicate-to-custom), Account tab (no MFA yet).
9. Audit log writes + `/admin/users` Audit tab with typed metadata rendering.
10. Password reset, password change, email verify.

**Stage C — MFA + device sessions + lockout**
11. TOTP enroll/verify/recovery + secret encryption + replay counter + `user_mfa_recovery_codes`.
12. Active sessions list, sign-out-other-devices, step-up auth.
13. Login rate limiting + lockout + audit entries.

**Stage D — Frontend members + plugin SDK + public gating**
14. Member kind, public auth routes (zero-JS server-rendered), `pb_session_member` cookie, `auth-totp.js`.
15. Page/collection `visibility = members_only` + public renderer gating + `Cache-Control: private, no-store`.
16. Plugin SDK `auth.*` surface, plugin manifest `capabilities` field, explicit route registration API, gate test.
17. Members tab UI.

---

## 14. Out of scope for this work (explicit "later")

- **Multi-site UI.** Schema is ready; site picker shows just the one site. Switching/managing multiple sites is a separate feature.
- **OAuth / SSO / SAML / OIDC.** Email + password + TOTP only. The session abstraction is provider-agnostic so OAuth slots in cleanly later.
- **Per-collection capabilities** (`content.publish_own:posts` vs `:case_studies`). Wildcard cap covers it for now; per-collection scoping is a follow-up.
- **WebAuthn / passkeys.** TOTP first; passkeys are a v2 added alongside TOTP.
- **Email signup confirmation double-opt-in for members.** Members get email-verify on signup but aren't gated until verified — toggleable later.
- **Comments / member content.** `members.comment` cap is reserved but no UI ships.
- **Public registration anti-abuse** (CAPTCHA, etc). Login rate limiting covers brute-force; signup spam is a separate concern.
- **Workflows / approvals** (Contributor → Editor publish queue). Today: contributors save drafts, editors publish them. No queue UI yet.
- **Audit log retention / external SIEM forwarder.** Append-only with no rotation; partition + retention land if/when volume requires.
- **`USER_SECRET_KEY` rotation tooling.** Manual procedure documented; automated rotation script is a follow-up.

---

## 15. Risk register

- **Email outbox = single-process worker.** Fine for a Bun single-server setup; if managed-host scales horizontally we'd add leader election or a real queue. Schema is queue-shaped already.
- **MFA secret key handling.** `USER_SECRET_KEY` rotation requires re-encrypting all stored secrets. Documented procedure (manual script) for v1.
- **Audit log volume.** Append-only with no rotation; partition + retention land if needed. Schema is partition-friendly.
- **Owner deletion / lockout.** If the only Owner is locked out (lost MFA + recovery codes + email broken), the only recovery is a CLI script (`bun run scripts/owner-recovery.ts <email>`) that writes a one-time, IP-restricted, 10-min-valid recovery token to stdout. Shipped with the migration.
- **Public renderer + member sessions.** Member-gated pages are rendered server-side per request and must not be cached at any CDN. `Cache-Control: private, no-store` on every response, documented in the deployment guide.
- **CSP + page-builder output.** Tight CSP on public auth pages. The published-site renderer (`src/core/publisher`) is unchanged in scope, but if site authors want member-only pages with custom JS, they'll opt out of `script-src 'self'` per page — captured as a published-site setting.

---

## 16. Estimated size

Rough swag in distinct change-sets (each is a coherent reviewable chunk inside the larger PR):

| Stage | Change-sets | Notes                                                                                            |
| ----- | ----------- | ------------------------------------------------------------------------------------------------ |
| A     | ~9          | Schema, authz, capabilities, audit types, /admin/api/cms move, login rewrite, /me, FE context    |
| B     | ~7          | Invites, email worker (with `'sending'` + skip-locked), users workspace, audit, reset/change     |
| C     | ~5          | TOTP (with replay counter), `user_mfa_recovery_codes`, sessions UI + step-up, lockout            |
| D     | ~6          | Members, public auth routes (zero-JS), plugin SDK explicit route API, gating, members UI         |

Total: ~27 change-sets, around **6–8k lines of net change** (additions; deletions ~700 lines of single-user auth + handler boilerplate). Architectural test additions: 6. New shared primitives: ~4. Migrations: 1.

---

## 17. What I need from you to start building

Stage A is the first coherent unit (schema + authz + identity + sessions + path move + login + FE context + first cut of `/admin/users` Staff tab as a sanity check). I'll keep `bun test`, `bun run build`, `bun run lint` green at the end of Stage A, and we'll review before moving to B/C/D.

If anything below should still change, tell me before we start coding:

- The list of seeded system roles (Owner / Admin / Editor / Author / Contributor / Subscriber).
- The capability list in §3.
- Whether SMTP is mandatory at install (recommended: warn-but-allow; admin can configure later, invitations queue and don't send until SMTP exists).
- Whether the `/admin/api/cms/*` path move should also rename the `/api/agent` route (currently independent — recommended to leave alone; it's not auth-gated by user).
