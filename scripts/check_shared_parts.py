"""5ページに複製している共通部分が一致しているか、各ページの <head> のメタ情報が正しいかを調べる。

テンプレートの仕組みを使わず、ナビ・サイドパネル・フッターを各 HTML に直接書いているため、
1ページだけ更新して他が古いまま残る事故を防ぐ。不一致があれば終了コード 1 で終わる。

使い方: python scripts/check_shared_parts.py
"""

import difflib
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ["index.html", "portfolio.html", "toolbox.html", "diagram.html", "contact.html"]
REFERENCE = PAGES[0]
BASE_URL = "https://www.termnix-it.jp/"

# 全ページで同一でなければならない部分
SHARED_PARTS = {
    "ナビゲーション": r'<nav class="navbar[^"]*".*?</nav>',
    "サイドパネルのプロフィールと Current Status": (
        r'<div class="cdoc-card cdoc-profile">.*?<p class="cdoc-card-label">Current Status</p>.*?</ul>\s*</div>'
    ),
    "フッター": r'<footer class="site-footer">.*?</footer>',
}
# ナビで現在ページを示す印。ページごとに付く位置が違うので、共通部分の比較からは外し、別途検査する
CURRENT_PAGE_MARK = re.compile(r'(?<=class="nav-link) active(?=")| aria-current="page"')
# <head> のうち、ページごとに値が変わるタグ（共通部分の比較から外し、別途検査する）
PAGE_SPECIFIC_HEAD = re.compile(
    r'<title>|name="description"|rel="canonical"|property="og:(title|description|url)"'
)


def normalize(fragment: str) -> list[str]:
    """タグの間の改行・インデントの違いは無視し、タグ単位の並びとして比べる。"""
    flat = re.sub(r"\s+", " ", re.sub(r">\s+<", "><", fragment.strip()))
    return flat.replace("><", ">\n<").splitlines()


def head_common(text: str) -> str:
    head = re.search(r"<head>(.*?)</head>", text, re.S)
    if not head:
        return ""
    lines = [line for line in head.group(1).splitlines() if not PAGE_SPECIFIC_HEAD.search(line)]
    return "\n".join(lines)


def body_scripts(text: str) -> str:
    body = re.search(r"<body.*?</body>", text, re.S)
    return "\n".join(re.findall(r"<script\b[^>]*>.*?</script>", body.group(0), re.S)) if body else ""


def extract_shared(text: str) -> dict[str, str | None]:
    parts = {}
    for name, pattern in SHARED_PARTS.items():
        match = re.search(pattern, text, re.S)
        parts[name] = CURRENT_PAGE_MARK.sub("", match.group(0)) if match else None
    parts["<head> の共通部分（読み込むCSS・フォント・アイコンなど）"] = head_common(text)
    parts["ページ末尾のスクリプト"] = body_scripts(text)
    return parts


def meta(text: str, attr: str, name: str) -> str | None:
    match = re.search(rf'<meta {attr}="{re.escape(name)}" content="([^"]*)"', text)
    return html.unescape(match.group(1)) if match else None


def check_current_page_mark(page: str, text: str) -> list[str]:
    """ナビで自分自身へのリンクだけに class="nav-link active" と aria-current="page" が付いているか。"""
    nav = re.search(SHARED_PARTS["ナビゲーション"], text, re.S)
    if not nav:
        return []
    marked = re.findall(r'<a class="nav-link active" href="([^"]*)" aria-current="page">', nav.group(0))
    stray = len(re.findall(r'aria-current="page"|class="nav-link active"', nav.group(0))) - 2 * len(marked)
    if marked != [page] or stray:
        return [f'{page}: ナビの現在ページの印が {marked or "なし"} に付いています'
                f'（{page} へのリンクだけに class="nav-link active" と aria-current="page" を付けてください）']
    return []


def check_pathbar(page: str, text: str) -> list[str]:
    """パス表示のタイプ入力が文字数を data-chars から読むので、実際の文字数と一致しているか。"""
    match = re.search(r'<div class="cdoc-pathbar-inner" data-chars="(\d+)"><span class="cdoc-pathbar-text">([^<]*)</span></div>', text)
    if not match:
        return [f'{page}: パス表示（cdoc-pathbar-inner と data-chars、cdoc-pathbar-text）が見つかりません']
    chars, label = int(match.group(1)), html.unescape(match.group(2))
    if chars != len(label):
        return [f'{page}: パス表示の data-chars が {chars} になっています（「{label}」は {len(label)} 文字）']
    return []


def check_page_meta(page: str, text: str) -> list[str]:
    errors = []
    expected_url = BASE_URL if page == "index.html" else BASE_URL + page
    title = re.search(r"<title>(.*?)</title>", text, re.S)
    title = html.unescape(title.group(1).strip()) if title else None
    canonical = re.search(r'<link rel="canonical" href="([^"]*)"', text)
    canonical = canonical.group(1) if canonical else None
    description = meta(text, "name", "description")

    checks = [
        ("canonical", canonical, expected_url),
        ("og:url", meta(text, "property", "og:url"), expected_url),
        ("og:title", meta(text, "property", "og:title"), title),
        ("og:description", meta(text, "property", "og:description"), description),
    ]
    for label, actual, expected in checks:
        if actual != expected:
            errors.append(f"{page}: {label} が {actual!r} になっています（期待値: {expected!r}）")
    if not description:
        errors.append(f"{page}: meta description がありません")
    return errors


def main() -> int:
    texts = {page: (ROOT / page).read_text(encoding="utf-8") for page in PAGES}
    reference = extract_shared(texts[REFERENCE])
    errors = []

    for name, ref_fragment in reference.items():
        if not ref_fragment:
            errors.append(f"{REFERENCE}: 「{name}」が見つかりません")
            continue
        for page in PAGES[1:]:
            fragment = extract_shared(texts[page])[name]
            if fragment is None:
                errors.append(f"{page}: 「{name}」が見つかりません")
                continue
            if normalize(fragment) != normalize(ref_fragment):
                diff = "\n".join(
                    difflib.unified_diff(
                        normalize(ref_fragment), normalize(fragment), REFERENCE, page, lineterm="", n=1
                    )
                )
                errors.append(f"{page}: 「{name}」が {REFERENCE} と一致しません\n{diff}")

    for page in PAGES:
        errors.extend(check_current_page_mark(page, texts[page]))
        errors.extend(check_pathbar(page, texts[page]))
        errors.extend(check_page_meta(page, texts[page]))

    if errors:
        print("共通部分の検査で問題が見つかりました。\n")
        print("\n\n".join(errors))
        return 1
    print(f"共通部分の検査に合格しました（{len(PAGES)}ページ）。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
