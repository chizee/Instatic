# Capability E2E Scenarios

These rows exercise capability behavior through the browser. They complement the Bun route/access tests by verifying that a real user sees the right navigation, disabled controls, step-up prompts, and recoverable error states.

Use disposable local data and create one custom role per scenario. Log out between personas, or use separate browser contexts, so cached admin state does not leak across checks.

## CAP-001: Workspace Isolation

| Field | Value |
|---|---|
| Priority | P0 |
| Persona | Limited operator |
| Setup | Owner creates a role with `site.read`, `site.content.edit`, `media.read`, then creates a user with that role. |
| Path | Log in as the limited user and inspect the admin shell. Try direct URLs for Users, Plugins, AI, and Account. |
| Expected | Site and Media are reachable, Account is reachable, disallowed workspaces are hidden or denied without exposing their data. Direct disallowed URLs must not render the protected workspace. |
| Watch For | Stale nav items, route flashes before redirect, protected data in loading states, unclear denial copy. |

## CAP-002: Site Edit Mode Boundaries

| Field | Value |
|---|---|
| Priority | P0 |
| Personas | Content editor, style editor, structure editor |
| Setup | Create three roles: `site.read + site.content.edit`; `site.read + site.style.edit`; `site.read + site.structure.edit + pages.edit`. Seed a page with text, a styled module, and at least two layers. |
| Path | For each user, open the editor and attempt the visible actions for copy editing, style editing, and layer/page structure changes. Save after an allowed edit, reload, then attempt one disallowed edit. |
| Expected | Each persona can complete only its own edit class. Disallowed controls are hidden, disabled, or produce a clear non-destructive error. Allowed saves persist after reload. |
| Watch For | Controls that look enabled but fail late, save buttons enabled for impossible changes, accidental page/layer changes by content-only users. |

## CAP-003: Step-Up On Sensitive Actions

| Field | Value |
|---|---|
| Priority | P0 |
| Personas | Publisher, plugin installer, user manager, destructive importer |
| Setup | Create roles for `pages.publish`, `plugins.install`, `users.manage`, and `data.import + content.manage`. |
| Path | For each user, trigger the sensitive action: publish, plugin install/uninstall, user create/delete, and replace import. Cancel the password prompt, retry with a wrong password, then retry with the correct password. |
| Expected | The first attempt opens step-up, cancel leaves state unchanged, wrong password shows a clear error, correct password completes or reaches the action's normal validation. |
| Watch For | Actions completing before step-up, stale step-up windows across users, generic auth errors, partial side effects after cancel or wrong password. |

## CAP-004: Data And Media Capability Splits

| Field | Value |
|---|---|
| Priority | P1 |
| Personas | Data reader, data manager, media reader, media writer, media replacer, media deleter |
| Setup | Seed a data table with rows and upload one media asset as Owner. Create one role for each listed persona. |
| Path | Exercise table browsing, table creation, row move/export/import affordances, media browse/upload/metadata/replace/delete affordances. |
| Expected | Read personas can browse but not mutate. Write/manage personas see only the operations their capability grants. Replace and delete are not implied by upload/write. |
| Watch For | Hidden operations still reachable by direct URL, destructive media actions exposed to writers, data import/export buttons shown to table readers. |

## CAP-005: Plugin And AI Capability Splits

| Field | Value |
|---|---|
| Priority | P1 |
| Personas | Plugin reader, plugin configurator, plugin lifecycle operator, AI chat user, AI provider manager, AI auditor |
| Setup | Install or seed a harmless test plugin if available. Configure an AI provider only when the run owns a disposable key or local provider. |
| Path | Check plugin list/settings/lifecycle actions per role. For AI, check provider settings, audit tab, conversation list, and chat-only tool behavior. |
| Expected | Plugin read/configure/lifecycle/install surfaces remain separate. AI chat users can open conversations but cannot access provider credentials or audit, and mutating tools are not presented. |
| Watch For | Masked settings leaking to read-only roles, lifecycle controls exposed to configurators, AI write actions available to chat-only users. |
