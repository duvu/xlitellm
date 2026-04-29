## Context

LiteLLM có đầy đủ backend Organizations API (`/organization/*` endpoints), Prisma schema (`LiteLLM_OrganizationTable`, `LiteLLM_OrganizationMembership`), và React components (`organizations.tsx`, `organization_view.tsx`). Tab Organizations đã có trong leftnav với `roles: all_admin_roles`.

**Vấn đề**: Deployed image dùng pre-built Next.js `out/` artifacts từ repo. Nếu `out/` chưa được rebuild từ source hiện tại, tab Organizations có thể không hiển thị hoặc render sai. Ngoài ra, chưa có org nào được tạo trên deployment.

**Không có premium gate** trên organization endpoints — hoàn toàn accessible với `is_premium() = True`.

## Goals / Non-Goals

**Goals:**
- Rebuild Next.js UI để `out/` chứa Organizations tab đúng version
- Build và deploy Docker image mới với UI đã rebuild
- Verify UI hoạt động: admin có thể tạo, list, update, delete org qua dashboard
- Verify API endpoints hoạt động qua curl test

**Non-Goals:**
- Thay đổi backend Organization endpoints (đã hoàn chỉnh)
- Thay đổi DB schema
- Implement org-based SSO (separate feature)
- Migrate existing Teams vào Organizations (thủ công, ngoài scope)

## Decisions

### Decision 1: Rebuild UI locally thay vì dùng pre-built out/

**Chosen**: Rebuild Next.js từ `ui/litellm-dashboard/` → update `litellm/proxy/_experimental/out/`

**Why**: Dockerfile hiện tại chỉ `COPY litellm/proxy/_experimental/out/` (selective copy). Nếu `out/` đã đúng version thì có thể skip. Nhưng để chắc chắn Organizations tab hoạt động, cần verify `out/` có page "organizations".

**Alternative**: Trust existing `out/` nếu grep thấy organizations chunk — saves ~15 min build time.

**Decision**: Grep `out/` trước; nếu thiếu thì rebuild, nếu có thì skip UI rebuild.

### Decision 2: Không thay đổi litellm_config.yaml

**Chosen**: Organizations không cần config flag — tự động available khi `prisma_client` connected.

**Why**: `/organization/new` chỉ check `user_role == PROXY_ADMIN` và `prisma_client is not None` — không cần thêm general_settings.

### Decision 3: Image tag suffix `.orgs-ui`

New image tag: `docker.x51.vn/dev/litellm:1.80.11-x51.orgs-ui.{TIMESTAMP}`

## Risks / Trade-offs

- **UI rebuild time ~15 min** → Mitigate: check `out/` trước, rebuild chỉ khi cần
- **Next.js build environment** → Mitigate: dùng Node.js trong Docker builder stage (đã có `build_admin_ui.sh`)
- **Disk trên build machine** → OK, đã có đủ space

## Migration Plan

1. Grep `litellm/proxy/_experimental/out/` cho "organizations" keyword
2. Nếu thiếu: chạy `docker/build_admin_ui.sh` để rebuild Next.js
3. Build Docker image mới (tag `.orgs-ui.TIMESTAMP`)
4. Push lên `docker.x51.vn`
5. Update `deployment/server2/docker-compose.yml`
6. SCP + deploy trên server2
7. Smoke test: đăng nhập UI, verify tab Organizations visible, tạo 1 org test

**Rollback**: revert docker-compose.yml về image cũ (`enterprise.20260429.2356`)
