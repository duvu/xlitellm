## 1. Chuẩn bị và nghiên cứu upstream

- [x] 1.1 Tạo git branch mới: `upgrade/litellm-1.85.1-enterprise-patch`
- [x] 1.2 Download source litellm 1.80.11 và 1.85.1 từ PyPI vào `/tmp` để diff
- [x] 1.3 Diff `litellm/proxy/auth/litellm_license.py` giữa 1.80.11 và 1.85.1 — note mọi thay đổi cấu trúc
- [x] 1.4 Grep toàn bộ diff cho patterns: `premium_user`, `is_premium`, `not_premium_user`, `enterprise`, `LicenseCheck` — liệt kê các guard mới
- [x] 1.5 Diff `litellm/proxy/proxy_server.py` để xác định thay đổi trong cách `premium_user` được set

## 2. Bump version và cập nhật dependencies

- [x] 2.1 Cập nhật `version = "1.85.1"` trong `pyproject.toml`
- [x] 2.2 Kiểm tra xem `litellm-proxy-extras` và `litellm-enterprise` có cần bump version tương thích không — cập nhật nếu cần
- [x] 2.3 Chạy `poetry lock --no-update` để regenerate `poetry.lock`
- [x] 2.4 Chạy `make install-dev` để xác nhận dependencies install sạch

## 3. Reconcile enterprise patch với upstream code

- [x] 3.1 Merge các thay đổi upstream vào `litellm/proxy/auth/litellm_license.py` — giữ `is_premium()` trả về `True`
- [x] 3.2 Với mỗi enterprise guard mới tìm được ở task 1.4: xác nhận nó được gated qua `premium_user` variable (không phải check riêng)
- [x] 3.3 Nếu có guard mới không đi qua `premium_user`: patch trực tiếp tại site đó để bypass
- [x] 3.4 Kiểm tra `litellm/proxy/proxy_server.py`: đảm bảo mọi `premium_user = _license_check.is_premium()` call vẫn còn và được gọi tại startup
- [x] 3.5 Verify patch cho các guards hiện có: `route_checks.py`, `auth_utils.py`, `oauth2_check.py`, `user_api_key_auth.py` — vẫn hoạt động đúng với upstream code mới

## 4. Verification và testing

- [ ] 4.1 Chạy `make lint` — fix mọi lỗi ruff/mypy liên quan đến code được thay đổi
- [ ] 4.2 Chạy `make test-unit` — xác nhận không có regression
- [ ] 4.3 Chạy `poetry run pytest tests/proxy_unit_tests/ -v -k "license or premium or enterprise"` — xác nhận enterprise tests pass
- [ ] 4.4 Chạy `poetry run pytest tests/test_litellm/ -v` — xác nhận unit tests pass
- [ ] 4.5 Kiểm tra thủ công: import `litellm` và verify version `litellm.__version__ == "1.85.1"`
- [ ] 4.6 Kiểm tra thủ công: `from litellm.proxy.auth.litellm_license import LicenseCheck; assert LicenseCheck().is_premium() == True`

## 5. Cleanup và commit

- [ ] 5.1 Review `git diff` — xác nhận chỉ có thay đổi đúng scope
- [ ] 5.2 Commit với message: `chore: upgrade litellm to 1.85.1, maintain enterprise unlock patch`
- [ ] 5.3 Push branch và tạo PR nếu cần review
