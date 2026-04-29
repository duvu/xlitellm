## 1. Kiểm tra UI hiện tại

- [x] 1.1 Grep `litellm/proxy/_experimental/out/` để kiểm tra Organizations route/chunk đã có chưa (`grep -r "organizations" litellm/proxy/_experimental/out/ --include="*.js" -l | head -5`)
- [x] 1.2 Nếu thiếu: chạy `docker/build_admin_ui.sh` để rebuild Next.js UI → cập nhật `out/` (không cần — đã có sẵn)
- [x] 1.3 Nếu rebuild: verify `out/` chứa organizations chunk sau khi build (organizations.html + 4 JS chunks ✓)

## 2. Build Docker Image

- [x] 2.1 Build image mới với tag `docker.x51.vn/dev/litellm:1.80.11-x51.orgs-ui.{TIMESTAMP}` (skip — image hiện tại đã có UI)
- [x] 2.2 Verify image size ≤2GB (1.72 GB ✓)
- [x] 2.3 Push image lên registry `docker.x51.vn` (skip — kông cần build mới)

## 3. Deploy lên server2

- [x] 3.1 Cập nhật image tag trong `/home/beou/deployment/server2/docker-compose.yml` (skip — image không thay đổi)
- [x] 3.2 SCP docker-compose.yml lên server2 (skip)
- [x] 3.3 Pull image mới và restart container litellm trên server2 (skip)
- [x] 3.4 Xóa image cũ để giải phóng disk (skip)

## 4. Verify Organizations Feature

- [x] 4.1 Kiểm tra container health: `docker compose ps litellm`
- [x] 4.2 Kiểm tra logs không có error: `docker compose logs --tail 30 litellm`
- [x] 4.3 Smoke test API: `GET /organization/list` trả về 200 ✓
- [x] 4.4 Smoke test API: `POST /organization/new` tạo org test thành công — id: 1da1d679 ✓
- [x] 4.5 Verify UI: tab Organizations hiển thị tại `https://lite.x51.vn/ui` (organizations.html ✔, /ui 307 OK)
