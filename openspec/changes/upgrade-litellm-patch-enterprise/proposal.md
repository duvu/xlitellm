## Why

Phiên bản LiteLLM hiện tại (1.80.11) đã lỗi thời so với latest stable (1.85.1), bỏ lỡ các bug fix, cải tiến hiệu năng, và provider integrations mới. Đồng thời, cần đảm bảo các enterprise patches hiện có (bypass license check) vẫn hoạt động đúng sau khi upgrade, và mở rộng coverage để không bỏ sót bất kỳ check nào được thêm vào trong các phiên bản mới.

## What Changes

- **Upgrade** `litellm` từ `1.80.11` lên `1.85.1` (cập nhật `pyproject.toml` và lock files)
- **Merge patches** từ upstream vào codebase: reconcile `litellm/proxy/auth/litellm_license.py` và tất cả các file có enterprise/license check
- **Verify & extend** enterprise unlock patch: đảm bảo `is_premium()` và mọi guard liên quan vẫn trả về `True` sau khi merge code upstream
- **Update** dependency versions: `litellm-proxy-extras`, `litellm-enterprise` nếu có phiên bản mới tương thích
- **Re-run** existing unit tests để xác nhận không có regression

## Capabilities

### New Capabilities

_(không có capability mới - đây là upgrade + patch maintenance)_

### Modified Capabilities

- `enterprise-unlocked`: Sau khi merge upstream 1.85.1, kiểm tra và re-apply patch đảm bảo mọi enterprise check vẫn bị bypass. Các scenario trong spec hiện tại vẫn giữ nguyên yêu cầu; chỉ có implementation cần được reconcile với code mới.

## Impact

- **`pyproject.toml`**: bump `version` và dependency pins
- **`litellm/proxy/auth/litellm_license.py`**: reconcile với upstream, giữ `is_premium() → True`
- **Các file có enterprise guard** (proxy_server.py, route_checks.py, management_endpoints, v.v.): scan và patch bất kỳ check mới nào được upstream thêm vào giữa 1.80.11 và 1.85.1
- **Tests** (`tests/test_litellm/`, `tests/proxy_unit_tests/`): chạy lại để xác nhận không có regression
- **Không breaking change** cho API surface; chỉ là internal upgrade và patch
