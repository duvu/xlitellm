## ADDED Requirements

### Requirement: Docker build integrates litellm-payment source
The Docker build process SHALL copy litellm-payment source into the build context and install it as a Python package alongside litellm, without requiring a pre-built wheel file.

#### Scenario: Build succeeds with litellm-payment source present
- **WHEN** `docker build` is run with litellm-payment source at the expected path in build context
- **THEN** the resulting image SHALL have `litellm_payment` importable as a Python package
- **THEN** the payment API endpoints SHALL be registered at `/payment/*`

#### Scenario: Build uses pip install from source (not wheel)
- **WHEN** the Dockerfile is executed
- **THEN** it SHALL run `pip install ./litellm-payment` (or equivalent source install)
- **THEN** no `.whl` file SHALL be required in the build context

### Requirement: Clean UI static export in Docker build
The Docker build SHALL produce a clean Next.js static export where all HTML pages reference the same layout JS bundle.

#### Scenario: All pages share one layout bundle
- **WHEN** the Docker image is built with the UI source containing Payment sidebar
- **THEN** every `index.html` and `*.html` file in `out/` SHALL reference the same `layout-*.js` filename
- **THEN** that layout JS file SHALL contain the string "Payment"

#### Scenario: Old build artifacts are removed before rebuild
- **WHEN** the UI build step runs in the Dockerfile
- **THEN** it SHALL first remove any existing `out/` and `.next/` directories
- **THEN** `npm run build` SHALL produce a fresh export

### Requirement: Build script validates litellm-payment presence
The build process SHALL fail fast if litellm-payment source is not available.

#### Scenario: Missing litellm-payment source
- **WHEN** `docker build` is run without litellm-payment source at the expected path
- **THEN** the build SHALL fail with a clear error message indicating the missing source
