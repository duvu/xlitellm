## 1. Fix UI Static Export (Split-Brain Layout)

- [ ] 1.1 In litellm-dashboard, run `rm -rf out/ .next/` then `npm run build` to produce clean static export
- [ ] 1.2 Verify all HTML files in `out/` reference the same `layout-*.js` file containing "Payment"

## 2. Restructure Docker Build for Source Integration

- [ ] 2.1 Create a build script (`build-docker.sh`) that copies litellm-payment source into Docker build context, validates presence, and triggers `docker build`
- [ ] 2.2 Update Dockerfile to `COPY litellm-payment/ ./litellm-payment/` and run `pip install ./litellm-payment` instead of wheel-based install
- [ ] 2.3 Add `RUN rm -rf out/ .next/ && npm run build` step (or ensure clean UI build) in Dockerfile UI build stage
- [ ] 2.4 Remove old wheel COPY and force-reinstall lines from Dockerfile

## 3. Build and Deploy

- [ ] 3.1 Build Docker image v15 with merged source approach
- [ ] 3.2 Push image to `docker.x51.vn` registry
- [ ] 3.3 Update `deployment/server2/docker-compose.yml` with new image tag
- [ ] 3.4 Deploy to server via SSH (git push + container recreate)

## 4. Verification

- [ ] 4.1 Verify Payment sidebar visible immediately on `/ui/virtual-keys` after login (check layout JS contains "Payment")
- [ ] 4.2 Verify `GET /payment/balance` returns 200 for authenticated user
- [ ] 4.3 Verify all payment endpoints listed in `/openapi.json`
- [ ] 4.4 Verify no split-brain: every HTML page references same layout JS hash
