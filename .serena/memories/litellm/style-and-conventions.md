# Style and Conventions

- Python target is `>=3.9,<4.0`.
- Use type hints on public APIs.
- Black and Ruff are the primary formatting/linting tools; Ruff line length is 120.
- MyPy is part of the standard validation flow.
- `tests/test_litellm/` mirrors `litellm/` and should use mocks only.
- Do not add live provider calls to `tests/test_litellm/`.
- `pyright` and `isort` are enforced via pre-commit.
- Pydantic v2 is the baseline for models and config.
- Proxy schema and migrations are Prisma-based.