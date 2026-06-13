## Why

The Next.js dashboard for LiteLLM was rebuilt locally with a Payment page and a Payment link in `Sidebar2.tsx`, but the built static export (`ui/litellm-dashboard/out/`) was never synced to `litellm/proxy/_experimental/out/` (the directory used to build Docker images). All deployed images (v1–v7) serve the old JS bundle (no Payment in sidebar) and have no `payment/` route in the static export.

## What Changes

- Copy `payment.html` + `payment.txt` from `ui/litellm-dashboard/out/` into `litellm/proxy/_experimental/out/`
- Create `litellm/proxy/_experimental/out/payment/index.html` (pre-structured for extensionless routing)
- Replace old JS bundle `layout-21ba4a4a865d8333.js` with new `layout-2655ce84242e7470.js` (includes Payment sidebar link) in `litellm/proxy/_experimental/out/_next/static/chunks/app/(dashboard)/`
- Sync any other changed `_next/static/` chunks from the new build
- Rebuild Docker image v8 with the updated `_experimental/out/`
- Deploy v8 and verify `/ui/payment` loads with Payment visible in sidebar

## Capabilities

- **New Capabilities**: payment-in-sidebar (navigating to `/ui/payment` via sidebar link)

## Out of Scope

- Rebuilding the UI from source in CI
- Changes to LiteLLM's routing logic
- Any payment API changes
