## Why

The payment module (litellm-payment) is installed and its API routes are registered (`/payment/*`), but the UI page at `/ui/payment` returns 404. Users cannot navigate to the payment page even though the sidebar shows the "Payment" menu item.

Root cause: LiteLLM's UI serving logic (`_restructure_ui_html_files`) converts `payment.html` → `payment/index.html` at startup to support extensionless routes. However, it **skips restructuring** if any existing route is already pre-structured (e.g., `login/index.html` from the base image). Since our custom payment UI was layered on top of a pre-structured base image, `payment.html` is present but `payment/index.html` is never created, causing 404 on `/ui/payment`.

## What Changes

- Pre-structure the `payment` route in the Dockerfile: create `payment/index.html` alongside `payment.html` during image build so LiteLLM's runtime restructuring skip is harmless.
- Rebuild and push a new Docker image.
- Update deployment repo to use the new tag.
- Redeploy and verify `/ui/payment` returns 200.

## Capabilities

### New Capabilities

- `payment-page-routing`: Pre-restructured Next.js route for `/ui/payment` so FastAPI StaticFiles can serve it at the extensionless path.

### Modified Capabilities

## Impact

- Dockerfile build context: `/tmp/litellm-payment-v2/` or new context
- Deployment repo: `/home/beou/deployment/server2/docker-compose.yml` image tag
- Server: `root@10.113.213.1` litellm service recreate
- No code changes to Python or TypeScript
