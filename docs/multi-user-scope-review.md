# Multi-User Upgrade — Architecture & Security Review

**Reviewed:** `docs/multi-user-scope.md`
**Reviewer basis:** Full read of scope doc + `server/cms/migrations.ts`, `server/cms/auth.ts`, `server/cms/repositories.ts`, `server/cms/handlers.ts` (login/logout/setup/auth surface), `server/cms/types.ts`, `server/router.ts`, `server/config.ts`, `src/admin/AdminEntry.tsx`, `src/admin/AdminLayout.tsx`, `src/core/persistence/cmsAuth.ts`, `src/core/persistence/responseSchemas.ts`, `src/core/plugin-sdk/types.ts`, `src/core/plugins/manifest.ts`, and representative architecture gate tests (`phase-g-bridge-security.test.ts`, `no-anthropic-sdk.test.ts`, `no-router-in-editor.test.ts`).

---

## 1. Executive Summary

| # | Severity | Finding |
|---|----------|---------|
| 1 | **Critical** | Staff session cookie `Path=/admin` is incompatible with `/api/cms/*` routes — the browser never sends the cookie to the API layer |
| 2 | **Critical** | `roles.id text primary key` combined with "seeded per site at site creation" produces a PK collision on second site creation, breaking the locked-in multi-site-ready requirement |
| 3 | **Important** | `user_site_memberships.role_ids` as a JSONB array has no FK integrity, no cascade on role deletion, and poor query ergonomics — use a proper junction table |
| 4 | **Important** | Plugin route "default-deny-by-cap" implicit fallback (§9) is a security anti-pattern and makes the gate test unenforceable |
| 5 | **Important** | System role capability editing for non-owner system roles (§6.2) enables a privilege escalation path |
| 6 | **Important** | `mfa_recovery_hashes_json` as a JSONB array has a race condition on redemption and provides no per-code status — needs a proper table |
| 7 | **Important** | `email_outbox` is missing a `'sending'` intermediate state and `FOR UPDATE SKIP LOCKED` — creates phantom-sent rows or silent loss on worker restart |
| 8 | **Important** | Inline JS on public auth pages (§6.5) conflicts with `script-src 'self'` CSP; POST/redirect/GET solves this without JS |
| 9 | **Important** | `users.delete_owner` capability is referenced in the §2.1 admin role description but is absent from the §3 registry — either add it or remove the reference |
| 10 | **Nice-to-have** | TOTP replay prevention (last-used-counter) not mentioned in §8; easy omission that creates a reuse window |
| 11 | **Nice-to-have** | `audit_events.event_type` as a free string; apply the same closed-enum + per-type Zod schema pattern used for capabilities |
| 12 | **Nice-to-have** | Three missing indexes: `audit_events(target_type, target_id)`, `email_outbox(status, scheduled_for)`, `sessions(user_id)` |
| 13 | **Nice-to-have** | `USER_SECRET_KEY` auto-generation to a local file; require an explicit env var with fatal boot error instead |
| 14 | **Nice-to-have** | `users.deleted_at` + `status='deleted'` dual-tracks the same state; inconsistent with the soft-delete pattern already in the codebase |
| 15 | **Nice-to-have** | `sessions.mfa_passed_at` is overloaded for both initial MFA login and step-up re-auth; a dedicated `step_up_expires_at` field is cleaner |

---

## 2. Section-by-Section Review

### §8 — Staff cookie `Path=/admin` is incompatible with `/api/cms/*` routes (Critical)

The scope proposes:
> `Path=/admin` for staff, `Path=/` for members.

All CMS API endpoints are at `/api/cms/...` — this is established in `server/router.ts` line 45:
```typescript
if (url.pathname.startsWith('/api/cms/')) {
  return handleCmsRequest(req, runtime.db, { uploadsDir: runtime.uploadsDir })
}
```
and confirmed by all 40+ routes in §5.1 of the scope doc.

The browser only sends a cookie with `Path=/admin` when the request URL path starts with `/admin`. A `fetch('/api/cms/site', { credentials: 'include' })` from the React SPA at `/admin/` does **not** include the cookie — the request path `/api/cms/site` does not start with `/admin`. This is not a subtle edge case; it means every CMS API call from the admin app would arrive at the server as unauthenticated.

The current code in `handlers.ts` line 134 correctly uses `Path=/`. The separate cookie names (`pb_session_staff` vs `pb_session_member`) already achieve the main goal — distinct, non-cross-contaminating cookie namespaces. Dropping to `Path=/admin` provides marginal benefit (staff cookie not sent with public page requests) at the cost of a completely broken API.

**If routing isolation via path is truly desired**, the fix is to move CMS API routes from `/api/cms/` to `/admin/api/cms/` and update `server/router.ts` accordingly. That makes `Path=/admin` coherent. Otherwise: keep `Path=/` for both cookies.

---

### §2.1 `roles` table — PK collision on multi-site seeding (Critical)

The schema declares:
```sql
id      text primary key   -- e.g. 'owner', 'admin', 'editor', ...
site_id text references sites(id) on delete cascade
...
unique (site_id, id)
```

And §2.3 says: "Seeded system roles per site at site creation time (handled by `createSite()`)."

`id text primary key` means `id` is globally unique across all sites. The first `createSite()` call inserts a row with `id = 'editor', site_id = 'site_a'`. The second call tries to insert `id = 'editor', site_id = 'site_b'` — this violates the PK. The schema is broken for multi-site.

The `unique (site_id, id)` constraint is also redundant: if `id` is already the PK (globally unique), the composite adds nothing.

A secondary inconsistency: `roles.site_id` is nullable (comment: "null = system-global role") but `user_site_memberships.site_id` is `NOT NULL`. A role with `site_id = null` can't compose cleanly with per-site memberships without JOIN logic that the doc doesn't describe.

The schema must commit to one of these models:
- **Global system roles** — one `'owner'`, `'admin'`, etc. for the entire install (`site_id = null`, seeded once). Custom roles have generated IDs scoped to a site. Simple, and consistent with "Exactly one user per install holds [owner]".
- **Per-site system roles** — each site gets its own copy, but `id` must be a surrogate key, with a `slug` field (`'editor'`) carrying the human-readable identity. `unique (site_id, slug)` becomes the meaningful constraint.

For "multi-site-ready schema from day one", option 2 (surrogate PK + slug) is the correct design. See §3 for the concrete schema.

---

### §2.1 `user_site_memberships.role_ids` — JSONB array vs junction table (Important)

```sql
role_ids  jsonb not null default '[]'   -- multiple roles per (user,site)
```

Three problems:

1. **No FK integrity.** Role IDs in a JSON array are opaque to Postgres. If a custom role is deleted, stale IDs persist silently — there is no cascade. The schema claims §9 handles this ("treated as revoked at runtime, logged in audit"), which is exactly the kind of silent degradation the project's own rules prohibit.

2. **No index-friendly queries.** "All users with role X" requires `WHERE role_ids @> '["some-id"]'::jsonb`, which needs a GIN index and is non-obvious for contributors. A proper FK join is clearer and faster.

3. **Audit trail gap.** There's no `assigned_at` or `assigned_by_user_id` on individual assignments. The audit log would need to capture this on every write, but the role list itself loses that provenance.

See §3 for the replacement junction table.

---

### §9 — Plugin route "default-deny-by-cap" implicit fallback (Important)

> the server-side default for any handler that hasn't called `requireCapability` is to require the user to have **at least one capability defined by the plugin** (or be admin). This default-deny-by-cap is the safe choice.

This is not safe. Three distinct problems:

1. **Ambiguous for zero-capability plugins.** A plugin that contributes no RBAC claims but has server routes falls through to "must be admin" — which may be more or less permissive than intended, with no signal to the plugin author.

2. **Wrong granularity.** A plugin with `['acme.workflow.approve', 'acme.workflow.view']` would have all its routes accessible to anyone holding either capability — including approval-only routes being accessible to viewers.

3. **Gate test is unenforceable.** The planned `plugin-routes-require-capability.test.ts` (§11) is supposed to assert "every plugin route handler is wrapped." But if "not calling requireCapability" is also a valid code path (silent fallback), the test cannot distinguish "forgot to add the check" from "intentionally using the fallback." The existing gate tests in this repo (see `no-anthropic-sdk.test.ts`, `phase-g-bridge-security.test.ts`) all operate on binary yes/no AST scans with no silent valid middle state — this design breaks that pattern.

**Correct design**: Routes must either explicitly call `requireCapability(cap)` or be explicitly declared `public: true` at registration. Neither → build-time gate failure. No silent fallback. See §3 for the API shape.

---

### §6.2 — System role capability editing enables privilege escalation (Important)

> edit capabilities (system role caps editable for non-Owner roles, with a warning — Owner is read-only)

This allows an `admin`-role user to edit the built-in `admin` role to add `users.transfer_ownership`, then transfer ownership to themselves. The `is_system` flag exists for exactly this use: `is_system = true` should mean capabilities are read-only for all system roles, not just `owner`.

If operators need customization, the correct approach is: copy system role → create custom role starting from that snapshot → edit custom role → assign. This is a common pattern in RBAC systems and avoids modifying the global capability template that affects all existing holders of that role.

---

### §2.1 `mfa_recovery_hashes_json` — race condition on redemption (Important)

Storing 10 hashes in a JSONB array on the `users` row creates a read-modify-write race on redemption:

1. Two concurrent requests each read `mfa_recovery_hashes_json = [H1, H2, ..., H10]`
2. Both find `H1` matches (after Argon2 verify)
3. Both UPDATE the row to remove `H1`
4. Postgres last-write-wins — the same recovery code is consumed twice

The row-level locking that protects against this requires a separate table where each code is an independent row:

```sql
create table user_mfa_recovery_codes (
  id         text primary key,
  user_id    text not null references users(id) on delete cascade,
  code_hash  text not null,
  created_at timestamptz not null default now(),
  used_at    timestamptz
);
create index on user_mfa_recovery_codes (user_id) where used_at is null;
```

Atomic redemption then becomes:
```sql
UPDATE user_mfa_recovery_codes
  SET used_at = now()
  WHERE id = $code_id AND user_id = $user_id AND used_at IS NULL
RETURNING id
```
Zero rows returned = already used. One row returned = this request won the race.

This also enables useful UX: "You have 7 remaining codes" (count WHERE used_at IS NULL), which is impossible with a JSONB array without additional tracking.

---

### §7 — `email_outbox` missing `'sending'` state and `FOR UPDATE SKIP LOCKED` (Important)

The proposed status enum `('pending','sent','failed')` has no intermediate state. Without it, the worker must mark `'sent'` either before or after the SMTP call:
- Before: if the server crashes mid-send, the email is lost silently (row is `'sent'`, email never delivered)
- After: if the server crashes between send and update, the row stays `'pending'` and will be retried — this is acceptable, but two worker instances coexisting briefly (hot reload, graceful shutdown + new start) can both pick the same row

The fix is a `'sending'` state claimed atomically:

```sql
status text not null default 'pending'
  check (status in ('pending', 'sending', 'sent', 'failed')),
```

Worker claim query (prevents double-processing even under brief parallelism):
```sql
WITH claimed AS (
  SELECT id FROM email_outbox
  WHERE status = 'pending' AND scheduled_for <= now()
  ORDER BY scheduled_for
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
UPDATE email_outbox SET status = 'sending'
WHERE id IN (SELECT id FROM claimed)
RETURNING *
```

On restart: rows stuck in `'sending'` are reset to `'pending'` by a startup routine (or a short `SELECT ... WHERE status = 'sending' AND updated_at < now() - interval '5 minutes'`).

---

### §6.5 — Inline JS on public auth pages vs CSP (Important)

> server-rendered HTML + a tiny inline JS for form interactivity

Inline `<script>` blocks require `Content-Security-Policy: script-src 'unsafe-inline'`, which is the primary protection CSP is designed to provide. A public CMS product serving its own auth pages should have a tight CSP — this is especially important for login pages (phishing surface) and password-reset pages.

The fix is straightforward and consistent with the project's "clean HTML/CSS, no framework runtime" principle: use **plain `<form method="POST">` + 303 redirect** (POST/Redirect/GET pattern). No JavaScript is needed for:
- Login (POST → redirect to admin or MFA step)
- Register (POST → redirect to "verify your email" notice)
- Forgot-password (POST → redirect to "check your email" page)
- Reset-password (POST → redirect to login or error)
- Email verification (GET link → POST confirmation → redirect)

The only form feature that genuinely benefits from JS is TOTP input auto-advance (auto-submit when 6 digits are typed). This can be a small static file loaded via `<script src="/assets/auth-totp.js">` — an ordinary external script, which is CSP-safe with `script-src 'self'`.

---

### §3 — Missing capability `users.delete_owner` (Important)

Section §2.1 describes the admin role as:
> everything except `users.transfer_ownership` and `users.delete_owner`

`users.delete_owner` does not appear anywhere in the §3 capabilities registry. The registry lists `users.delete` but nothing about protecting the owner account from deletion.

Two clean options:
1. **Add `users.delete_owner` to §3** — only the owner holds this cap, preventing anyone else from deleting the owner account
2. **Remove it from §2.1 and handle it as a code-level invariant** — `requireOwnerOr` in `server/cms/authz.ts` rejects attempts to delete a user who holds the `owner` role, returning a typed error rather than checking a capability. This is cleaner: it's a business rule, not a permissions question.

Option 2 is preferred. It avoids a capability that only one user can ever hold (which is functionally equivalent to hardcoded logic, but with more indirection).

---

### §8 — TOTP replay prevention (Nice-to-have)

The doc specifies "30s window, ±1 step tolerance" but does not mention storing the last-used TOTP counter. Without it, a valid 6-digit code (usable for up to ~60 seconds with ±1 tolerance) can be submitted twice — the second submission is accepted even though the first already established the session.

Add `mfa_totp_last_counter bigint` to the `users` table. On verification:
1. Reject if `current_time_step ≤ last_counter`
2. Update `last_counter = current_time_step` on success

This is NIST SP 800-63B §5.1.4.2 compliance for TOTP replay prevention.

---

### §3 — `audit_events.event_type` as a free string (Nice-to-have)

The spec gives example values (`'auth.login.success'`, `'users.role.changed'`, `'pages.published'`) but leaves `event_type` as an unconstrained text column. The rendering UI for the audit log tab must handle an unknown set of event types and render `metadata_json` as opaque JSON dumps — which produces a poor admin experience.

The capabilities registry pattern (§3) already solves this. Apply the same design: a closed `AUDIT_EVENT_TYPES` enum in `src/core/auth/auditEventTypes.ts`, with per-type Zod schemas for the `metadata_json` shape. Plugin-contributed events are open-namespaced (e.g. `acme.workflow.entry.approved`), parallel to plugin capabilities. The audit log UI gets a discriminated union and can format each type with context-appropriate copy and structured metadata display, rather than a raw JSON blob.

---

### §2 — Three missing indexes (Nice-to-have)

**`audit_events`** — The doc specifies indexes on `(site_id, created_at desc)`, `(actor_user_id, created_at desc)`, `(event_type, created_at desc)`. Missing:
```sql
-- For "audit history for this page / plugin / user" in the audit log UI
create index on audit_events (target_type, target_id, created_at desc);
```

**`email_outbox`** — No indexes defined. Missing:
```sql
-- Worker query: WHERE status IN ('pending','sending') AND scheduled_for <= now()
create index on email_outbox (status, scheduled_for)
  where status in ('pending', 'sending');
```

**`sessions`** — Postgres does not auto-create indexes on FK source columns. Missing:
```sql
-- For "list all active sessions for user X" (device management UI)
create index on sessions (user_id, expires_at)
  where revoked_at is null;
```

---

### §7 — `USER_SECRET_KEY` auto-generation to a file (Nice-to-have)

> generated on first run if missing, persisted in a secret file

Auto-generating a cryptographic key to a local file is a footgun in containerized deployments: the file lives inside the container, is lost on rebuild, and can be silently baked into a Docker image if the image is committed mid-run. Secret leakage through Docker image history is a common real-world incident class.

The doc's §15 already says "failure to read the key on startup is a fatal boot error." Extend that to the missing-key case: if `USER_SECRET_KEY` is not set, fail at boot with:
```
Fatal: USER_SECRET_KEY is not set.
Generate a key with: bun run scripts/generate-secret-key.ts
See docs/deployment.md for instructions.
```

Ship `scripts/generate-secret-key.ts` in the repo. Remove the auto-generate-to-file fallback entirely.

---

### §2.1 `users.deleted_at` vs `status='deleted'` — dual-state (Nice-to-have)

The `users` table has both `status check(status in ('active','invited','suspended','deleted'))` and `deleted_at timestamptz`. Both encode "is this user deleted". These can drift: a row could have `status = 'active'` with `deleted_at` set, or `status = 'deleted'` with `deleted_at = null`.

The existing codebase uses `deleted_at` without a status column on `content_collections` and `content_entries` (migrations 003, 009). For consistency: remove `'deleted'` from the `status` enum. Derive deleted state from `deleted_at IS NOT NULL`. The status column becomes a clean three-state machine: `('active', 'invited', 'suspended')`. All queries already need `WHERE deleted_at IS NULL` to exclude soft-deleted users; this matches the existing pattern.

---

### §8 — `sessions.mfa_passed_at` overloaded for step-up auth (Nice-to-have)

The doc uses `mfa_passed_at` for both:
1. "MFA was completed at login" (session validity gate)
2. "Step-up re-auth was just completed" (elevated action window)

These are semantically different. A session where MFA was completed 25 days ago is valid for normal access but should NOT satisfy a step-up re-auth check for transferring ownership. With a single `mfa_passed_at` field, checking "was step-up done recently?" requires `mfa_passed_at > now() - interval '15 minutes'` — but that check would spuriously fail for users who authenticated normally without MFA (because `mfa_passed_at` is null) AND would be trivially satisfied by any user whose MFA login was within the last 15 minutes, even if that was a normal login, not a deliberate step-up prompt.

Add `step_up_expires_at timestamptz` to the `sessions` table. Set to `now() + interval '15 minutes'` on step-up confirmation. Check `step_up_expires_at > now()` for elevated actions. Null by default.

---

## 3. Concrete Schema/Code Suggestions

### Roles table — surrogate PK + slug

```sql
create table roles (
  id                text primary key,              -- surrogate nanoid/uuid, generated
  slug              text not null,                 -- 'owner', 'admin', 'editor', 'author', ...
  site_id           text references sites(id) on delete cascade,
                                                   -- null = install-global system role
  name              text not null,
  description       text not null default '',
  is_system         boolean not null default false,   -- true = capabilities read-only
  capabilities_json jsonb not null default '[]',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  unique (site_id, slug)    -- meaningful composite: one 'editor' per site (or install if null)
);
-- user_site_role_assignments references roles(id) (the surrogate)
```

With this design, `createSite()` generates a new nanoid for each seeded role row and `unique (site_id, slug)` enforces no duplicate slugs per site. The JSONB `role_ids` in memberships (or the junction table rows) reference the surrogate IDs.

### `user_site_memberships` → proper junction table

```sql
-- Drop user_site_memberships entirely (or keep as derived view)
-- Replace role_ids JSONB with:

create table user_site_role_assignments (
  user_id          text not null references users(id) on delete cascade,
  site_id          text not null references sites(id) on delete cascade,
  role_id          text not null references roles(id) on delete cascade,
  assigned_at      timestamptz not null default now(),
  assigned_by_id   text references users(id) on delete set null,
  primary key (user_id, site_id, role_id)
);
create index on user_site_role_assignments (role_id);     -- "all users with role X"
create index on user_site_role_assignments (site_id, user_id);  -- "all roles for user on site"
```

Membership is implied: a user is a member of a site if they have at least one `user_site_role_assignments` row for that site. A view can expose this if the old membership concept is useful:
```sql
create view user_site_memberships as
  select distinct user_id, site_id, min(assigned_at) as member_since
  from user_site_role_assignments
  group by user_id, site_id;
```

### MFA recovery codes table (replaces `mfa_recovery_hashes_json`)

```sql
-- Remove mfa_recovery_hashes_json from users table
create table user_mfa_recovery_codes (
  id         text primary key,
  user_id    text not null references users(id) on delete cascade,
  code_hash  text not null,                   -- argon2id hash of the plaintext code
  created_at timestamptz not null default now(),
  used_at    timestamptz                      -- null = available, non-null = consumed
);
create index on user_mfa_recovery_codes (user_id) where used_at is null;
```

Regenerating recovery codes: `DELETE FROM user_mfa_recovery_codes WHERE user_id = $uid`, then insert 10 new rows. Atomic single-use redemption:
```sql
UPDATE user_mfa_recovery_codes
  SET used_at = now()
  WHERE id = $code_id AND user_id = $user_id AND used_at IS NULL
RETURNING id
-- 0 rows = already consumed (race resolved, reject); 1 row = success
```

### Email outbox status + worker query

```sql
-- status column change:
status  text not null default 'pending'
  check (status in ('pending', 'sending', 'sent', 'failed')),

-- Add updated_at for orphan recovery:
updated_at  timestamptz not null default now(),
```

Worker claim (atomic, safe under parallelism):
```sql
WITH claimed AS (
  SELECT id FROM email_outbox
  WHERE status = 'pending'
    AND scheduled_for <= now()
  ORDER BY scheduled_for
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
UPDATE email_outbox
  SET status = 'sending', updated_at = now()
  WHERE id IN (SELECT id FROM claimed)
RETURNING *;
```

On server startup, reset orphaned `'sending'` rows:
```sql
UPDATE email_outbox
  SET status = 'pending', updated_at = now()
  WHERE status = 'sending'
    AND updated_at < now() - interval '10 minutes';
```

### Plugin route registration — explicit capability declaration

Replace the implicit fallback in `ServerPluginApi` with a required second argument:
```typescript
// server/cms/types.ts or src/core/plugin-sdk/types.ts
interface ServerPluginRoutes {
  /**
   * Register a capability-gated route.
   * Throws 403 if the authenticated user does not have `capability`.
   */
  get(path: string, capability: Capability, handler: ServerPluginRouteHandler): void
  post(path: string, capability: Capability, handler: ServerPluginRouteHandler): void
  patch(path: string, capability: Capability, handler: ServerPluginRouteHandler): void
  delete(path: string, capability: Capability, handler: ServerPluginRouteHandler): void

  /**
   * Register a public route that requires no capability.
   * Explicit opt-in — never a default.
   */
  getPublic(path: string, handler: ServerPluginRouteHandler): void
  postPublic(path: string, handler: ServerPluginRouteHandler): void
}
```

The gate test `plugin-routes-require-capability.test.ts` then scans plugin server entry points and asserts: every route registration call uses one of the above named methods. No third "unannotated" form. The test is unambiguous and matches the existing gate test style.

### Sessions table additions

```sql
-- Existing mfa_passed_at stays (session-level MFA validity gate)
-- Add dedicated step-up field:
step_up_expires_at  timestamptz,    -- null = no active step-up window

-- Add sessions index for device list query:
create index on sessions (user_id, expires_at) where revoked_at is null;
```

Step-up auth flow:
1. Re-prompt for password (+ TOTP if enrolled)
2. On success: `UPDATE sessions SET step_up_expires_at = now() + interval '15 minutes' WHERE id_hash = $hash`
3. Elevated action check: `WHERE id_hash = $hash AND step_up_expires_at > now()`
4. After sensitive action completes (optional): `UPDATE sessions SET step_up_expires_at = null WHERE id_hash = $hash`

### `users` table — remove `deleted_at` / `status` duplication

```sql
-- Remove 'deleted' from the status check constraint
status  text not null default 'active'
  check (status in ('active', 'invited', 'suspended')),

-- Keep deleted_at as the sole soft-delete marker (consistent with content_collections, content_entries)
deleted_at  timestamptz,
```

Add a partial index for active user lookups:
```sql
create unique index on users (email_normalized) where deleted_at is null;
-- (replaces the plain unique on email_normalized)
```

---

## 4. Considered and Rejected

**SHA1 in HMAC-SHA1 for TOTP** — Initially flagged as a potential weakness. On review, HMAC-SHA1 is not broken for keyed MAC operations; the HMAC construction hides SHA1's collision vulnerabilities. RFC 6238 baseline is SHA1, and Google/Authy compatibility requires it. Fine as-is.

**SHA256 for session token hashing vs Argon2id** — Considered recommending Argon2id. On reflection: session tokens are 32 random bytes (256 bits of entropy). An attacker with the `id_hash` column cannot reverse SHA256 of a 256-bit random input — the input space is 2^256. Argon2id is for low-entropy inputs (passwords, recovery codes). SHA256 for high-entropy tokens is correct and is consistent with how the current `auth.ts` does it.

**SameSite=Lax vs double-submit CSRF tokens** — For a JSON API consumed by a first-party React SPA, SameSite=Lax blocks all cross-site POST/PATCH/DELETE CSRF attacks. Double-submit tokens would add complexity for no material security gain given the deployment model. Lax is adequate.

**Three separate token tables vs one unified `tokens` table** — The `purpose` field on each table is redundant (you know the purpose from the table name), and I nearly flagged it as clutter. On second read, the three-table design provides cleaner indexes, clearer access patterns, and prevents accidentally querying an invitation token as a password-reset token. The redundant `purpose` field should simply be removed from each table — it adds nothing. The three-table structure itself is correct.

**`nanoid` vs `uuid` for primary keys** — `uuid` would give Postgres's native 16-byte binary representation and `gen_random_uuid()` default. However, the entire existing codebase (migrations, repositories, handlers) uses `nanoid()` for IDs consistently. Changing the ID strategy for new tables only would create an inconsistency more confusing than any benefit. The current pattern is fine.

**In-process email worker vs `LISTEN/NOTIFY`** — `LISTEN/NOTIFY` would eliminate the 5-second polling lag and is slightly cleaner architecturally. But it requires a persistent dedicated connection to the DB (separate from the pool) and adds setup complexity. For transactional CMS emails, a 5-second delay is acceptable. The schema is queue-shaped already (the doc notes this). The real issue with the email worker is the missing `'sending'` state and `FOR UPDATE SKIP LOCKED`, not the polling mechanism.

**`content.create` used for both collection CRUD and entry CRUD** — Creating a content collection is a structural admin action (defining the data model); creating entries is a content action. These probably warrant separate capabilities (`content.manage_collections` vs `content.create_entry`). I considered flagging this but it's a judgment call on capability granularity, not a security concern. Deferred collections capability is already called out in §14.

**Cookie `Secure` flag on HTTP dev** — The doc correctly conditions `Secure` on `APP_BASE_URL` being `https://`. The current code doesn't set `Secure`, matching expected dev behavior. No issue.

**Login CSRF via forced-login attack** — SameSite=Lax blocks cross-site POST to the login endpoint. A forced-login attack (making the victim log in as the attacker) is a lower-risk concern for a CMS admin panel with invitation-only staff accounts. Not worth the complexity of login CSRF tokens.

---

## 5. Open Questions

These are the minimum decisions needed to act on the recommendations above:

1. **Staff cookie path**: Keep `Path=/` for staff (simple, works today) or move CMS API routes from `/api/cms/` to `/admin/api/cms/` (enables `Path=/admin`)? This decision determines the `server/router.ts` structure.

2. **System roles — global vs per-site**: Are system roles global (`site_id = null`, seeded once, one `'owner'` for the whole install) or per-site (each site gets its own copy, requires surrogate PK + `slug`)? The answer determines the `roles` table schema.

3. **`user_site_memberships` shape**: Drop the memberships table and use `user_site_role_assignments` as the sole join record, or keep a memberships row for metadata (first-joined-at, invited-by, etc.) alongside the assignment table?

4. **System role capability immutability**: Should `is_system = true` mean all system role capabilities are read-only (owner AND admin AND editor), or only the owner role? This determines the privilege escalation exposure.

5. **Public auth page JS strategy**: Plain `<form>` POST + 303 (zero JS, tight CSP, preferred) or server-rendered with per-request nonce in CSP headers (more flexible, more complex)?
