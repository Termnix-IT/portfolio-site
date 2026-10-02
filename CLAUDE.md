# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリの性質

Termnix-IT の自己紹介ポートフォリオサイトで、ビルド工程のない静的サイト（HTML / CSS / バニラ JS）です。作成ツールの追加、資格や経歴の更新など、本人のプロフィールの変化に合わせて掲載内容を継続的に書き足していくことが主な作業になります。

公開リポジトリであり、`main` への push がそのまま本番サイトに反映されます。社名・顧客名・案件固有の情報は掲載せず、実務経歴は公開できる粒度に要約して書きます。プロフィール更新の元になる情報（取得した資格、担当業務の変化など）はユーザーがその都度チャットで伝えるので、推測で経歴やスキルを書き足さないでください。

## プレビューと検証

build・lint・テストのコマンドはありません。変更の確認はローカルサーバーでページを開いて行います。

```powershell
python -m http.server 8000
```

`.claude/launch.json` に同じ内容の `portfolio` 構成があるため、Claude Code からは `preview_start` の `portfolio` で起動できます。確認では、変更したページのサイドパネル目次のリンクが該当セクションへ飛ぶこと、コンソールエラーがないこと、モバイル幅（375px）で横スクロールが出ないことを見ます。

## ページ構成で知っておくべきこと

`index.html`・`portfolio.html`・`toolbox.html`・`diagram.html`・`contact.html` の5ページは、テンプレートやインクルードの仕組みを使わず、ヘッダーのナビゲーション、左のサイドパネル、フッターをそれぞれのファイルに複製して持っています。そのため共通部分を変えるときは5ファイルすべてを同じように直す必要があります。特にサイドパネルの「Current Status」カード（現職・領域・学習中）は全ページで同一の内容でなければならず、過去に `index.html` だけ更新されて他ページが古いまま残ったことがあります。一方で「Links」カードと「Sections」カード（ページ内目次）はページごとに中身が異なります。

各ページの `<head>` には、検索結果と SNS 共有用の `meta description`・`canonical`・OGP（`og:*`）があり、説明文はそのページのヒーローの説明文（`cdoc-hero-lead`）から作っています。ヒーローの文言やページの目的を変えたら説明文も直し、ページを増やしたときは同じ一式を、本番 URL `https://www.termnix-it.jp/` を基点にした絶対 URL で入れてください。フッターの著作権表記の年（`© 2025–2026`）は5ページに直書きしているので、年が変わったら揃えて更新します。

各ページの本文は `.cdoc-section` を並べた構成で、セクション見出しの `cdoc-section-badge` に A, B, C… の連番を振り、サイドパネル目次の `cdoc-toc-mark` と `href="#id"` をそれに一致させています。途中にセクションを挿入したら、後ろのセクションのバッジと目次の文字も繰り下げてください。

スタイルは `static/style.css` 末尾の「Career Document Layout」ブロックにある `.cdoc-*` クラスで組まれ、色や余白は CSS カスタムプロパティ（`--accent`、`--cdoc-green` など）で管理しています。新しいセクションは既存セクションの HTML を複製して中身を差し替える形で作り、インライン style は増やしません。Bootstrap は読み込んでおらず、以前使っていた Reboot・ナビバー・フッターのグリッド・ユーティリティ（`mb-0`、`text-md-end` など）は、同ファイル先頭の「Base」ブロックに必要な分だけ移植してあります。ここにないユーティリティクラスは効かないので、使う前に「Base」に足すか、`.cdoc-*` 側で書いてください。ページ遷移・セクションの表示・状態表示の波紋・見出しマーカーの動きは、同ファイル末尾の「Motion」ブロックに CSS だけでまとめてあり、`prefers-reduced-motion` で動きを減らす設定の閲覧者や未対応ブラウザでは静止表示になります。Current Status カードの波紋は「現職」行の `cdoc-status-live` と「学習中」行の `cdoc-status-progress` に付くので、行を書き換えるときもこのクラスを残してください。`static/main.js` はナビのアクティブ表示と狭い画面でのメニュー開閉（`initNavToggle`）、キーボードでも開ける構成図のライトボックス（`.diagram-zoomable`）、`index.html` の Qiita 最新記事取得、`contact.html` のフォーム送信を扱い、どの処理も対象要素が存在するページでだけ動く作りです。装飾目的のアイコン（`<i class="fas …">`）には `aria-hidden="true"` を付け、アイコンだけのリンクには `aria-label` で名前を付けます。問い合わせフォームは `data-endpoint` の AWS Lambda Function URL へ JSON を POST する前提で、Lambda / SES 側はこのリポジトリの外で管理しています。

## よくある更新作業

### 作成ツールを追加する（`toolbox.html`）

1. 掲載するツールの GitHub リポジトリの README と最新リリースノートを `gh` で読み、機能・技術スタック・配布形態・最新のタグを確認する。
2. 直前のツールの `<section id="tool-N">` を複製し、`id="tool-(N+1)"`、kicker の `tool-0N / 分類`、バッジの文字、タイトル、本文、タグ、ボタンを差し替える。「今後の展開」（`id="roadmap"`）は常に最後に置き、バッジを1文字繰り下げる。
3. サイドパネルの Sections 目次に項目を追加する。
4. 本文は3段落程度で、何をするツールか、なぜ作ったか・どこを工夫したか、配布形態と最新バージョンの順に書く。機能の羅列だけで終わらせず、安全面や設計上の判断を読み手に伝える。リリースノートに「動作確認は Windows のみ」などの断り書きがあれば本文にも残す。
5. ボタンは「GitHubを見る」（リポジトリ）と「Releaseを見る」（`/releases/tag/<最新タグ>`）の2つにする。リリースがなく仕様書などを見せたい場合は HashChecker の節のように別のリンクにする。

既に掲載しているツールの新バージョンが出たときは、バージョンに言及した段落を新しい内容に書き換え、「Releaseを見る」のリンク先のタグを更新します。

### プロフィールを更新する

資格の取得、学習対象や担当業務の変化は、複数の箇所に同じ情報が散らばっているため、関連する箇所をまとめて更新します。

- `index.html` の Certifications：取得済みは `fa-check-circle` と「取得済」、学習中は `cdoc-cert--progress` クラスと `fa-spinner fa-spin`、「学習中」で表す。
- 5ページすべての Current Status カード：資格を取得して学習対象が変わったら「学習中」の行も直す。
- `index.html` のヒーロー、Overview、Career Timeline、Skills：経歴やスキルの変化に合わせて文言を揃える。

### 画像を追加する

`static/img/` に内容が分かる英語のファイル名で置き、HTML から相対パスで参照して、`alt` には内容が分かる日本語を書きます。構成図としてクリック拡大させたい画像には `diagram-zoomable` クラスを付けます。

プロフィールのアイコンは、画面表示とファビコンには192px に縮小した `main-icon-192.png` を使い、元の1024px の `main-icon.png` は `og:image` 専用に残しています。元画像は約770KB あり、小さな表示に使うとページが重くなるため、アイコンを差し替えるときは縮小版も作り直してください。

## git 管理とデプロイ

`.gitignore` は「すべて無視したうえで必要なものだけ `!` で許可する」方式です。現在許可しているのは直下の `*.html`、`static/` 直下の CSS / JS、`static/img/` の画像、`README.md`、`CLAUDE.md`、デプロイ用ワークフローだけで、それ以外の新しいファイル（新しいディレクトリ、別の拡張子のファイルなど）は `.gitignore` に許可行を追加しないと commit されません。`docs/` には運用メモなどを置いていますが、意図的に追跡対象から外しているローカル専用の置き場です。

`main` への push で `.github/workflows/deploy.yml` が起動し、直下の `*.html` と `static/` だけを束ねて S3 へ `sync --delete` し、CloudFront を `/*` で invalidation します。`README.md` や `CLAUDE.md` は配信されません。push 後の結果は次のコマンドで確認できます。

```powershell
gh run list -R Termnix-IT/portfolio-site --limit 1
```

commit メッセージは英語の命令形の件名に、変更点を箇条書きした本文を付ける形式で揃えています。
