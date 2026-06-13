## Context

The LiteLLM Next.js dashboard (`ui/litellm-dashboard/`) was rebuilt locally. The new build output at `ui/litellm-dashboard/out/` contains:
- `payment.html` / `payment.txt` — the payment page static export
- Updated `layout-2655ce84242e7470.js` — sidebar bundle that includes a "Payment" menu item (key `"27"`, `WalletOutlined` icon, navigates to `/payment`)

However, `litellm/proxy/_experimental/out/` (the directory baked into the LiteLLM Python package and served by the proxy) still has:
- No `payment/` directory
- Old `layout-712385e448b3854b.js` that has no Payment sidebar link
- Many other stale `_next/static/chunks/` files

The deployed Docker images v1–v7 all use the stale `_experimental/out/`.

## Goals / Non-Goals

**Goals:**
- "Payment" appears in the sidebar of the deployed LiteLLM UI
- Clicking it navigates to the Payment page (`/ui/payment`)
- The payment page loads correctly in the browser

**Non-Goals:**
- Rebuilding the Next.js app from source in CI
- Touching LiteLLM routing or auth code
- Changing the payment API (backend)

## Decisions

**Decision: Sync static files in Dockerfile, not via git commit**

The `litellm/proxy/_experimental/out/` is tracked in git (upstream LiteLLM). We don't want to commit a 100+ file update to a vendor directory. Instead, we:
1. Include the necessary files in the Docker build context
2. In the Dockerfile, `COPY` them into the image at `/usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/`

Files to sync:
- Replace `_next/static/chunks/app/(dashboard)/layout-*.js` with new bundle
- Add `_next/static/chunks/app/(dashboard)/payment/` directory (payment page JS chunks)
- Add all changed top-level `_next/static/chunks/*.js` files
- Add `payment/index.html` (pre-structured)
- Add `payment.txt`

**Decision: Extend payment-ui-v7 image**

Base: `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v7.20260523.2257`
Only static file changes needed — no new wheel required.

## Build Context Strategy

Build context dir: `/tmp/litellm-payment-v8/`

```
/tmp/litellm-payment-v8/
├── Dockerfile
└── static/
    ├── _next/
    │   └── static/
    │       ├── chunks/         (only changed files from new build)
    │       └── css/            (if changed)
    ├── payment/
    │   └── index.html
    └── payment.txt
```

Dockerfile step:
```dockerfile
COPY static/ /usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/
```

This overlay approach: only the copied files are updated; unchanged files remain. Safe and minimal.

## Risks / Trade-offs

- [Risk: Stale chunk references] → Next.js static export uses content-addressed hashes. Old HTML pages (login.html etc.) may reference old chunk hashes. But those pages already work in v7; we're only changing the dashboard layout bundle. The payment page's own chunks are new and will be properly referenced.
- [Risk: Future UI rebuilds] → Document in Dockerfile comments. Any new UI rebuild must re-sync static files.

## Migration Plan

1. Prepare build context: copy changed static files from `ui/litellm-dashboard/out/` into `/tmp/litellm-payment-v8/static/`
2. Write Dockerfile extending v7, COPY static/
3. Build image `payment-ui-v8.<TIMESTAMP>`
4. Push to `docker.x51.vn/dev/litellm`
5. Update `docker-compose.yml` → commit + push deployment repo
6. SSH recreate litellm service
7. Verify: load `/ui/` and confirm Payment is in sidebar, click → loads payment page
