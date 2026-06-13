# Completion Checklist

When a code change is done, default handoff validation is:
- `make lint`
- `make test-unit`

Add a focused suite when the change touches it:
- `tests/test_litellm/` changes: run the specific mocked test(s)
- provider coverage: run the relevant `tests/llm_translation/` file when feasible
- proxy changes: run the relevant proxy unit tests
- docs/UI changes: run the matching package-local build/lint/test command

PRs need at least one new test under `tests/test_litellm/`.