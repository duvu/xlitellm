## Why

The Payment sidebar link doesn't appear after login because the Docker image has **split-brain static assets** — older HTML pages (e.g., `virtual-keys/index.html`) reference a stale layout JS bundle that predates the Payment sidebar addition, while `payment.html` references the newer bundle. This is caused by the current build process overlaying new `out/` on top of old `out/` rather than doing a clean build.

Additionally, the current deployment model builds litellm-payment as a separate wheel and force-installs it into the container at image build time. This is fragile and creates version coupling issues. The user wants to merge litellm-payment code directly into the litellm main source tree before compilation, so a single clean Docker build produces everything.

## What Changes

- **Fix stale UI assets**: Ensure Docker build uses a clean (rm -rf old `out/`) UI build so all HTML pages reference the same layout JS bundle containing the Payment sidebar
- **Merge litellm-payment into litellm source**: Copy litellm-payment source files into litellm's tree during Docker build (or as a git submodule/subtree merge) so that `pip install` of the main package includes payment functionality
- **Remove separate wheel install step**: No more `COPY litellm_payment*.whl` + `pip install --force-reinstall` in Dockerfile

## Capabilities

### New Capabilities
- `merged-payment-build`: Docker build process that integrates litellm-payment source into litellm main before compilation, producing a single installable package with payment support built-in

### Modified Capabilities
- `payment-in-sidebar`: Fix the split-brain layout JS issue so Payment link is visible on ALL pages immediately after login (not just when navigating directly to `/payment`)

## Impact

- **Docker build**: Dockerfile changes to merge source trees and do clean UI build
- **litellm-payment repo**: May become a source directory copied/mounted during build rather than a separate installable package
- **Deployment compose**: Image tag update, potentially simpler (no wheel copy step)
- **UI static assets**: Full rebuild required — all pages will get new layout hashes
- **No API changes**: Payment endpoints remain the same
