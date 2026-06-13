from pathlib import Path


def test_packaged_admin_ui_uses_runtime_asset_prefix_placeholder() -> None:
    index_html = (
        Path(__file__).resolve().parents[3]
        / "litellm"
        / "proxy"
        / "_experimental"
        / "out"
        / "index.html"
    )
    index_html_text = index_html.read_text(encoding="utf-8")

    assert "/my-custom-path/_next/" not in index_html_text
    assert "/litellm-asset-prefix/_next/" in index_html_text
