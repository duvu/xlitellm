## Context

LiteLLM proxy sử dụng một global variable `premium_user: bool` được set tại startup thông qua `_license_check.is_premium()` (trong `proxy_server.py`). Giá trị này được import và kiểm tra ở nhiều nơi để gate enterprise features. Patch hiện tại đơn giản là override `is_premium()` để luôn trả về `True`.

Repo hiện đang ở version **1.80.11**; latest stable PyPI là **1.85.1** (delta: 5 minor versions). Việc upgrade đòi hỏi:
1. Bump version pin trong `pyproject.toml`
2. Reconcile code changes upstream (diff 1.80.11 → 1.85.1) với local patches
3. Xác nhận không có enterprise check mới nào bị bỏ sót sau merge

## Goals / Non-Goals

**Goals:**
- Nâng `version` trong `pyproject.toml` lên `1.85.1`
- Giữ `is_premium()` trả về `True` sau khi code upstream được merge
- Phát hiện và patch bất kỳ enterprise guard mới nào xuất hiện trong 1.81–1.85
- Pass toàn bộ unit tests hiện có sau upgrade

**Non-Goals:**
- Không thêm feature mới ngoài scope upgrade
- Không đồng bộ `litellm-enterprise` hay `litellm-proxy-extras` nếu chúng không ảnh hưởng đến license path
- Không thay đổi test logic hoặc add integration tests với live providers

## Decisions

### D1: Patch strategy — override `is_premium()`, không xóa check sites

Giữ nguyên tất cả `if premium_user is not True:` guards trong codebase (không xóa chúng). Chỉ patch source-of-truth duy nhất: `LicenseCheck.is_premium()` → trả về `True`. Lý do: ít invasive hơn, dễ reconcile khi upstream thay đổi; nếu xóa từng guard thì mỗi lần upgrade lại phải re-hunt.

*Alternatives considered:* Set `premium_user = True` hardcoded tại module level trong `proxy_server.py` — cũng có thể hoạt động nhưng fragile hơn vì `_license_check.is_premium()` có thể được gọi lại nhiều lần khi reload config.

### D2: Version bump approach — update pyproject.toml trực tiếp, không dùng `poetry update`

Bump `version = "1.85.1"` và các dependency pins trực tiếp trong `pyproject.toml`, sau đó chạy `poetry lock --no-update` để regenerate lock file mà không kéo thêm transitive upgrades không cần thiết.

*Alternatives considered:* `poetry update litellm` — có thể kéo theo transitive dependency changes không kiểm soát được.

### D3: Upstream diff strategy — so sánh PyPI source, không git fetch upstream

Download `litellm==1.85.1` từ PyPI, diff với `litellm==1.80.11` để tìm:
- Các thay đổi trong `litellm/proxy/auth/litellm_license.py`
- Các `is_premium` check mới
- Các `premium_user` guard mới
Sau đó cherry-pick/reconcile thủ công.

## Risks / Trade-offs

- **[Risk] Upstream có thể thêm enterprise check theo cách khác** (vd: check qua HTTP API, không qua `is_premium()`) → Mitigation: grep toàn bộ diff cho patterns: `premium`, `enterprise`, `license`, `not_premium_user`, `LicenseCheck`
- **[Risk] Thay đổi API public giữa 1.80.11 và 1.85.1** có thể break existing tests → Mitigation: chạy `make test-unit` sau upgrade, fix failures
- **[Risk] `litellm-proxy-extras` hoặc `litellm-enterprise` optional deps có version conflict** → Mitigation: chỉ bump nếu cần thiết để pass deps resolution; giữ nguyên nếu không cần
- **[Risk] poetry.lock conflict** sau khi bump → Mitigation: dùng `poetry lock --no-update` để chỉ regenerate lock cho package được bump

## Migration Plan

1. Backup: tạo git branch mới trước khi thay đổi
2. Bump version trong `pyproject.toml`
3. Download và diff upstream source (1.80.11 vs 1.85.1) — tập trung vào `proxy/auth/` và `proxy/proxy_server.py`
4. Reconcile `litellm_license.py`: apply upstream changes nhưng giữ `is_premium() → True`
5. Scan diff output cho enterprise/premium patterns mới → patch nếu có
6. `poetry lock --no-update` để update lock file
7. `make install-dev` để verify deps install sạch
8. `make test-unit` + `poetry run pytest tests/proxy_unit_tests/ -v`
9. Nếu có failure: fix và re-run trước khi commit

**Rollback:** `git revert` về commit trước upgrade hoặc checkout branch cũ.

## Open Questions

- Có cần cập nhật `litellm-proxy-extras` và `litellm-enterprise` phiên bản không? → Xác định sau khi xem deps của 1.85.1
- Có test nào trong `tests/proxy_unit_tests/` mock `LicenseCheck.is_premium()` và cần update không? → Kiểm tra khi chạy test suite
