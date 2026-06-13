## Context

The litellm-payment plugin is a separate FastAPI app (`/home/beou/IdeaProjects/litellm-payment/`) currently deployed by:
1. Building a wheel (`litellm_payment-0.1.0-py3-none-any.whl`)
2. COPYing the wheel into the LiteLLM Docker image
3. Running `pip install --force-reinstall` in the Dockerfile

The UI (`/home/beou/IdeaProjects/litellm/ui/litellm-dashboard/`) is a Next.js static export. The Payment sidebar was added to `Sidebar2.tsx`, but the Docker build overlaid new assets on old assets, creating split-brain layout JS references. Pages built before Payment was added still reference old layout bundles.

**Current deployed state** (v14):
- 3 layout JS files exist in container: `layout-21ba4a4a865d8333.js`, `layout-712385e448b3854b.js`, `layout-2655ce84242e7470.js`
- Only `layout-2655ce84242e7470.js` contains "Payment"
- `virtual-keys/index.html` (default after login) references `layout-712385e448b3854b` → **no Payment visible**
- `payment.html` references `layout-2655ce84242e7470` → Payment visible only if navigated directly

## Goals / Non-Goals

**Goals:**
- Payment sidebar link visible on ALL pages immediately after login
- Single Docker build process that includes litellm-payment without separate wheel step
- Clean UI static export with consistent layout bundle across all pages
- Reproducible builds — same source always produces same output

**Non-Goals:**
- Changing litellm-payment's Python package structure or API endpoints
- Making litellm-payment a true submodule/subtree in git (too much coupling for a private repo)
- Changing the runtime plugin registration mechanism (callback handler stays the same)

## Decisions

### 1. Clean UI Build in Dockerfile

**Decision**: Delete `out/` directory before `npm run build` during Docker image construction.

**Rationale**: Next.js static export is deterministic — all HTML pages in a single build reference the same layout chunk. The split-brain issue exists ONLY because old files weren't removed. A clean build is the simplest fix.

**Alternative considered**: Selective replacement of old layout files → fragile, doesn't prevent future recurrence.

### 2. Merge litellm-payment via COPY + pip install -e during Docker build

**Decision**: In the Dockerfile, `COPY` the litellm-payment source directory into the image and `pip install -e ./litellm-payment` (editable install from source). This replaces the wheel-based approach.

**Rationale**: 
- Source-level integration means no separate wheel build step
- Editable install allows the existing `litellm_payment` package to be importable at the same paths
- Docker build context can use `--build-context payment=../litellm-payment` or the source can be placed adjacent in the build context

**Alternative considered**: 
- Git submodule → adds git complexity, private repo auth issues in CI
- Vendoring (copy source into litellm tree) → couples repos permanently, merge conflicts
- Multi-stage build with wheel → current approach, already proved fragile

### 3. Build context strategy

**Decision**: Use a custom Dockerfile that expects litellm-payment source at a known relative path (e.g., `./litellm-payment/` in the Docker build context). The build script copies it before running `docker build`.

**Rationale**: Keeps repos separate in git while unifying at build time. A simple `cp -r` or Docker build context mount is sufficient.

## Risks / Trade-offs

- **[Risk] Build requires litellm-payment source available** → Mitigation: Build script validates presence before proceeding; CI can clone the private repo as a step
- **[Risk] editable install in Docker adds .egg-link** → Mitigation: Non-editable `pip install ./litellm-payment` is equally fine and avoids .egg-link; prefer this for production
- **[Risk] Next.js cache can cause stale builds** → Mitigation: `rm -rf out/ .next/` before build; add to Dockerfile explicitly
