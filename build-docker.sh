#!/bin/bash
set -euo pipefail

# Build script for x51 custom LiteLLM image with litellm-payment integration
# This script:
# 1. Validates litellm-payment source is available
# 2. Copies it into Docker build context
# 3. Ensures clean UI static export
# 4. Builds the Docker image

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PAYMENT_SRC="${LITELLM_PAYMENT_SRC:-/home/beou/IdeaProjects/litellm-payment}"
IMAGE_TAG="${IMAGE_TAG:-docker.x51.vn/dev/litellm:latest}"

echo "=== x51 LiteLLM Docker Build ==="
echo "Payment source: $PAYMENT_SRC"
echo "Image tag: $IMAGE_TAG"
echo ""

# 1. Validate litellm-payment source
if [ ! -f "$PAYMENT_SRC/pyproject.toml" ]; then
    echo "ERROR: litellm-payment source not found at $PAYMENT_SRC"
    echo "Set LITELLM_PAYMENT_SRC to the correct path"
    exit 1
fi

echo "✓ litellm-payment source validated"

# 2. Copy litellm-payment into build context
rm -rf "$SCRIPT_DIR/litellm-payment-src"
cp -r "$PAYMENT_SRC" "$SCRIPT_DIR/litellm-payment-src"
# Remove unnecessary files from build context
rm -rf "$SCRIPT_DIR/litellm-payment-src/.git" \
       "$SCRIPT_DIR/litellm-payment-src/.venv" \
       "$SCRIPT_DIR/litellm-payment-src/__pycache__" \
       "$SCRIPT_DIR/litellm-payment-src/.pytest_cache"

echo "✓ litellm-payment copied to build context"

# 3. Ensure clean UI build (out/ should already be built by npm run build)
if [ ! -d "$SCRIPT_DIR/ui/litellm-dashboard/out" ]; then
    echo "WARNING: ui/litellm-dashboard/out/ not found. Building UI..."
    cd "$SCRIPT_DIR/ui/litellm-dashboard"
    rm -rf out/ .next/
    npm run build
    cd "$SCRIPT_DIR"
fi

# Verify single layout JS with Payment
LAYOUT_COUNT=$(find "$SCRIPT_DIR/ui/litellm-dashboard/out" -name "*.html" -exec grep -oh 'layout-[a-f0-9]*\.js' {} \; | sort -u | wc -l)
if [ "$LAYOUT_COUNT" -ne 1 ]; then
    echo "ERROR: Split-brain detected - $LAYOUT_COUNT different layout JS files in out/"
    exit 1
fi

LAYOUT_FILE=$(find "$SCRIPT_DIR/ui/litellm-dashboard/out" -name "layout-*.js" -path "*/(dashboard)/*" | head -1)
if ! grep -q "Payment" "$LAYOUT_FILE"; then
    echo "ERROR: Layout JS does not contain Payment sidebar entry"
    exit 1
fi

echo "✓ UI build verified (single layout, Payment present)"

# 4. Copy UI out/ into build context (bypasses .dockerignore exclusion of ui/litellm-dashboard/out/)
rm -rf "$SCRIPT_DIR/x51-ui-out"
cp -r "$SCRIPT_DIR/ui/litellm-dashboard/out" "$SCRIPT_DIR/x51-ui-out"
echo "✓ UI out/ copied to x51-ui-out/ (build context)"

# 5. Build Docker image
echo ""
echo "Building Docker image: $IMAGE_TAG"
docker build -f "$SCRIPT_DIR/Dockerfile.x51" -t "$IMAGE_TAG" "$SCRIPT_DIR"

echo ""
echo "✓ Build complete: $IMAGE_TAG"

rm -rf "$SCRIPT_DIR/litellm-payment-src" "$SCRIPT_DIR/x51-ui-out"
echo "✓ Cleaned up build context"
