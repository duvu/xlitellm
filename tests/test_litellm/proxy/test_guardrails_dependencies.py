from pathlib import Path

import tomllib


REPO_ROOT = Path(__file__).resolve().parents[3]


def test_guardrails_runtime_dependencies_are_packaged() -> None:
    requirements = (REPO_ROOT / "requirements.txt").read_text()
    assert "RestrictedPython==" in requirements

    pyproject = tomllib.loads((REPO_ROOT / "pyproject.toml").read_text())
    poetry_config = pyproject["tool"]["poetry"]
    assert "RestrictedPython" in poetry_config["dependencies"]
    assert "RestrictedPython" in poetry_config["extras"]["proxy"]


if __name__ == "__main__":
    test_guardrails_runtime_dependencies_are_packaged()
