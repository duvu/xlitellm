# Deploy Report: payment-ui-v3 (fix /ui/payment 404)

**Date**: 2026-05-23  
**Server**: root@10.113.213.1  
**Service**: litellm  
**Deployed by**: Sisyphus (automated)  

## Summary

Fixed `/ui/payment` returning 404 by upgrading to image `payment-ui-v3.20260523.2148`.

## Root Cause

LiteLLM's UI startup checks `_is_ui_pre_restructured()` — if any `<route>/index.html` already exists
in the static out directory, it skips `_restructure_ui_html_files()`. The base image already has
`login/index.html`, so the runtime restructuring that would have moved `payment.html` → `payment/index.html`
was skipped. FastAPI's `StaticFiles(html=True)` requires `payment/index.html` to serve `/ui/payment`.

## Fix

Added a 2-line Dockerfile step to the image that extends `payment-ui-v2.20260523.2046`:

```dockerfile
RUN UI_OUT=/usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out && \
    mkdir -p $UI_OUT/payment && \
    cp $UI_OUT/payment.html $UI_OUT/payment/index.html && \
    echo "payment/index.html pre-structured OK"
```

## Artifact Versions

| Artifact | Value |
|---|---|
| Previous image | `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v2.20260523.2046` |
| New image | `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v3.20260523.2148` |
| Dockerfile location | `/tmp/litellm-payment-v3/Dockerfile` |
| Deployment repo commit | `1684a18` |

## Verification Results

| Check | Result |
|---|---|
| Container status | `running` |
| Restart count | `0` |
| `GET /ui/payment` | `307 → /ui/payment/ → 200` ✓ |
| Payment API routes (`/openapi.json`) | 7 routes registered ✓ |

## Future Image Builds

Any future Docker image that re-packages the LiteLLM UI must include the pre-structure step, otherwise `/ui/payment` will break again. The pattern to follow:

```dockerfile
RUN UI_OUT=<path to litellm/_experimental/out> && \
    mkdir -p $UI_OUT/payment && \
    cp $UI_OUT/payment.html $UI_OUT/payment/index.html
```
