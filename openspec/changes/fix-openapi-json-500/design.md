## Context

`router.py` declares `from __future__ import annotations` at the top. This PEP 563 directive makes Python treat ALL annotations as strings (ForwardRefs) evaluated lazily rather than at import time. When FastAPI's OpenAPI schema generator processes the route `POST /webhook/{provider}`, it encounters `request: Request` as a parameter. Because `Request` was not imported (only `APIRouter, Body, Depends, Header, HTTPException, Query` were imported), Python cannot resolve the ForwardRef to the real `starlette.requests.Request` type.

FastAPI normally excludes `starlette.requests.Request` from the OpenAPI schema (it knows it's a special injection). But when the type is an unresolvable `ForwardRef('Request')`, FastAPI can't identify it as special — it falls back to treating it as a required query parameter with `Query(PydanticUndefined)`. Pydantic v2's schema generator then tries to build a `TypeAdapter` for `Annotated[ForwardRef('Request'), Query(PydanticUndefined)]`, which fails with `PydanticUserError: TypeAdapter is not fully defined`.

## Goals / Non-Goals

**Goals:**
- `GET /openapi.json` returns 200 with valid JSON schema
- All 7 payment routes appear in the schema
- Swagger UI (`/docs`) loads correctly

**Non-Goals:**
- Changing `from __future__ import annotations` behavior
- Modifying the webhook route logic
- Any auth changes

## Decisions

**Decision: Add `Request` to the fastapi import line**

The fix is to add `Request` to the existing import:
```python
# Before
from fastapi import APIRouter, Body, Depends, Header, HTTPException, Query

# After
from fastapi import APIRouter, Body, Depends, Header, HTTPException, Query, Request
```

With `Request` now importable, `get_type_hints()` can resolve `ForwardRef('Request')` → `fastapi.Request` → `starlette.requests.Request`. FastAPI then correctly identifies it as a special injection type, excludes it from schema, and Pydantic v2 schema generation succeeds.

**Why not remove `from __future__ import annotations`?**: It's used for other type hints in the file (like `dict[str, Any]` which works in 3.9+ but only with the future import for older Python support). The minimal fix is the import addition.

## Verification

After the fix, `app.openapi()` on a FastAPI app with the payment router returns a valid schema with all 7 routes — confirmed by isolated testing in the container.
