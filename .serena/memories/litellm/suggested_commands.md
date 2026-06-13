# Suggested Commands

## Core setup
- `make install-dev`
- `make install-proxy-dev`
- `make install-test-deps`

## Quality checks
- `make format`
- `make format-check`
- `make lint`
- `make lint-ruff`
- `make lint-mypy`

## Tests
- `make test-unit`
- `make test-integration`
- `make test-llm-translation-single FILE=test_openai.py`
- `poetry run pytest tests/test_litellm/path/to/test.py -v`
- `poetry run pytest tests/test_litellm/path/to/test.py::test_name -v`

## Frontend / docs
- `cd ui/litellm-dashboard && npm run dev|build|lint|test`
- `cd docs/my-website && npm run start|build`

## Notes
- Run repo-root Make targets from the repo root; the Makefile handles `cd litellm/` internally.
- `tests/test_litellm/` is mock-only.
- `make lint` also checks circular imports and import safety.