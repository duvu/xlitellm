## 1. Patch License Check

- [x] 1.1 Trong `litellm/proxy/auth/litellm_license.py`, thay body hàm `is_premium()` để luôn trả về `True`

## 2. Build Docker Image

- [x] 2.1 Build image mới với tag `docker.x51.vn/dev/litellm:1.80.11-x51.enterprise.20260429.2356`
- [x] 2.2 Verify image size hợp lý (≤2GB) — 1.72 GB ✓
- [x] 2.3 Push image lên registry `docker.x51.vn`

## 3. Deploy lên server2

- [x] 3.1 Cập nhật image tag trong `/home/beou/deployment/server2/docker-compose.yml`
- [x] 3.2 SCP docker-compose.yml lên server2 (`root@10.113.213.1:/root/deployment/server2/`)
- [x] 3.3 Pull image mới và restart container litellm trên server2
- [x] 3.4 Xóa image cũ để giải phóng disk

## 4. Verify

- [x] 4.1 Kiểm tra container health: `docker compose ps litellm`
- [x] 4.2 Kiểm tra logs không có enterprise error: `docker compose logs --tail 30 litellm`
- [x] 4.3 Smoke test endpoints: `GET /health` → 401 ✓, `GET /ui` → 307 ✓
- [x] 4.4 Verify SSO không bị block (nếu đã config GOOGLE_CLIENT_ID / MICROSOFT_CLIENT_ID)
