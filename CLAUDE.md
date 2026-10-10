# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリの性質

Termnix-IT の自己紹介ポートフォリオサイトで、Astro で静的 HTML を生成しています。作成ツールの追加、資格や経歴の更新など、本人のプロフィールの変化に合わせて掲載内容を継続的に書き足していくことが主な作業になります。

公開リポジトリであり、`main` への push がそのまま本番サイトに反映されます。社名・顧客名・案件固有の情報は掲載せず、実務経歴は公開できる粒度に要約して書きます。プロフィール更新の元になる情報（取得した資格、担当業務の変化など）はユーザーがその都度チャットで伝えるので、推測で経歴やスキルを書き足さないでください。

## プレビューと検証

Node.js 22.12 以上（`.nvmrc` は 24）が必要です。初回は `npm ci` で依存関係を入れます。

```powershell
npm run dev      # 開発サーバー（http://localhost:4321）
npm run check    # 型とテンプレートの検査
npm run build    # dist/ に本番と同じ静的ファイルを出力
npm run preview  # dist/ を http://localhost:4322 などで配信（--port で指定）
```

`.claude/launch.json` に、開発サーバーの `portfolio`（4321）と、ビルド結果を配信する `portfolio-build`（4322、先に `npm run build` が必要）があり、Claude Code からは `preview_start` で起動できます。確認では、変更したページのリンクが正しい場所へ飛ぶこと、コンソールエラーがないこと、モバイル幅（375px）で横スクロールが出ないことを見ます。commit 前には `npm run check` と `npm run build` が通ることを確かめます。コンテンツの項目漏れや型の誤りは、`src/content.config.ts` の zod スキーマによって build 時にエラーになります。

## ページ構成で知っておくべきこと

ページは `src/pages/` の5ファイルで、`astro.config.mjs` の `build.format: 'file'` により `index.html`・`portfolio.html`・`toolbox.html`・`diagram.html`・`contact.html` として出力されます。外部から張られているリンクを壊さないよう、この URL とページ内アンカー（`#tool-1`、`#project-1` など。各コンテンツの `anchor` で指定）は変えないでください。

共通部分はコンポーネントにまとめてあり、`src/layouts/BaseLayout.astro` が `<head>`（title・description・canonical・OGP）、`SiteHeader.astro`（ナビゲーション）、`SiteFooter.astro` をすべてのページに入れます。ナビの項目と各ページの title・description は `src/data/site.ts` に1か所で書き、description は各ページのヒーローの説明文（`PageHero` の `lead`）と揃えます。canonical と og:url は `astro.config.mjs` の `site` から自動で作られます。フッターの著作権表記の年（`© 2025–2026`）は `SiteFooter.astro` に書いてあるので、年が変わったら更新します。

掲載内容はテンプレートから分け、次のファイルに置いています。

- `src/data/profile.yaml`：現職・領域・学習中（ホームのヒーローの状態表示）、今の強み、経歴、スキル、資格。配列の順がそのまま表示順です。
- `src/content/tools/*.md`：作成ツール。frontmatter に名前・分類・一覧用の短い説明・タグ・リポジトリ・リリースのタグを書き、本文に説明の段落を書きます。`order` で並び順、`anchor` でページ内アンカーを決めます。
- `src/content/projects/*.md`：構築プロジェクト（`portfolio.html`）。関連する記事やリポジトリの公開状況は `publications`、構成図は `diagram` に書きます。
- `src/content/diagrams/*.md`：構成図ギャラリー（`diagram.html`）。

ホームの「代表作」には、プロジェクトとツールのうち frontmatter に `featured`（並び順の番号）を持つものが並びます。

見た目は「案B」のデザインで、サイト全体の色・書体・余白のトークン（`--accent`、`--ink`、`--font-sans` など）とボタン・カードなどの共通クラスは `src/styles/global.css` に、部品ごとのスタイルは各 `.astro` ファイルの `<style>`（Astro がそのファイル内だけに効くよう自動で範囲を絞る）に書きます。書体は IBM Plex Sans JP と JetBrains Mono の2種類で、アクセント色は1色だけにしています。`!important` やインライン style は使わず、詳細度か記述位置で解決してください。アイコンは `src/components/Icon.astro` の線画 SVG を使い、装飾目的のものは `aria-hidden` にし、アイコンだけのボタンやリンクには `aria-label` で名前を付けます。動き（ページ遷移のフェード、カードのホバー、状態表示の波紋、拡大表示）はすべて `prefers-reduced-motion` で動きを減らす設定の閲覧者には出ません。

ブラウザで動く処理は、それぞれ使うコンポーネントの `<script>` に書いています。狭い画面のメニュー開閉は `SiteHeader.astro`、構成図の拡大表示はブラウザ標準の `<dialog>` を使う `ZoomableImage.astro`、ホームの Qiita 最新記事の取得（閲覧時に Qiita API を呼ぶ）は `QiitaList.astro`、問い合わせフォームの送信は `ContactForm.astro` です。問い合わせフォームは `data-endpoint` の AWS Lambda Function URL へ JSON を POST する前提で、Lambda / SES 側はこのリポジトリの外で管理しています。フォームの動作をローカルで確かめるときは、本番の Lambda に送信しないよう `fetch` を差し替えてから試してください。

## よくある更新作業

### 作成ツールを追加する（`toolbox.html`）

1. 掲載するツールの GitHub リポジトリの README と最新リリースノートを `gh` で読み、機能・技術スタック・配布形態・最新のタグを確認する。
2. `src/content/tools/` に既存のファイルを複製して新しいファイルを作り、frontmatter の `title`・`order`・`anchor`（`tool-N`）・`category`・`summary`・`tags`・`repo`・`release` を書き換える。一覧のカード、ページ内の番号、「Releaseを見る」のリンクは自動で作られ、「今後の展開」は常に最後に表示される。
3. 本文は3段落程度で、何をするツールか、なぜ作ったか・どこを工夫したか、配布形態と最新バージョンの順に書く。機能の羅列だけで終わらせず、安全面や設計上の判断を読み手に伝える。リリースノートに「動作確認は Windows のみ」などの断り書きがあれば本文にも残す。
4. リリースがなく仕様書などを見せたい場合は、`release` の代わりに `secondaryLink` を書く（HashChecker と同じ形）。ホームの「代表作」にも載せる場合は `featured` を付ける。

既に掲載しているツールの新バージョンが出たときは、`release` のタグと、本文のバージョンに言及した段落を新しい内容に書き換えます。

### プロフィールを更新する

資格の取得、学習対象や担当業務の変化は `src/data/profile.yaml` を直せば全ページに反映されます。資格は `state: acquired`（取得済）か `learning`（学習中）で表し、学習対象が変わったら `status` の「学習中」の行も直します。経歴やスキルの変化に合わせて、ホームのヒーローの文言（`src/pages/index.astro`）と、`src/data/site.ts` のホームの description も揃えます。

### 画像を追加する

ページに載せる画像は `src/assets/` に内容が分かる英語のファイル名で置き、コンテンツの frontmatter から相対パスで指定します（例: `image: ../../assets/xxx.png`）。build 時に WebP へ変換され、幅違いの複数サイズが作られます。`alt` には内容が分かる日本語を書きます。構成図としてクリック拡大させたい画像は `ZoomableImage` コンポーネントで表示します。

プロフィールのアイコンは、画面表示とファビコンに `src/assets/main-icon-192.png` を使い、元の1024px の `public/static/img/main-icon.png` は `og:image` 専用です。og:image は SNS などから長く参照されるため、ファイル名にハッシュが付かない `public/static/img/` に置いています。

## git 管理とデプロイ

`.gitignore` は「すべて無視したうえで必要なものだけ `!` で許可する」方式です。現在許可しているのは `src/` と `public/` の全体、`package.json`・`package-lock.json`・`astro.config.mjs`・`tsconfig.json`・`.nvmrc`、`README.md`、`CLAUDE.md`、デプロイ用ワークフローだけで、直下に新しい設定ファイルなどを足す場合は `.gitignore` に許可行を追加しないと commit されません。`dist/`・`node_modules/`・`.astro/` は追跡しません。`docs/` には運用メモなどを置いていますが、意図的に追跡対象から外しているローカル専用の置き場です。

`main` への push で `.github/workflows/deploy.yml` が起動し、`npm ci`・`npm run check`・`npm run build` が通った場合だけ、`dist/` を S3 へ同期して CloudFront を `/*` で invalidation します。S3 には、ファイル名に内容のハッシュが入る `_astro/` を1年の `immutable`、og:image などの `static/` を1日キャッシュ、HTML を `Cache-Control: no-cache` で置きます。古い `_astro/` のファイルは、CloudFront に古い HTML が残っている間も参照先を返せるよう削除しません。`README.md` や `CLAUDE.md` は配信されません。push 後の結果は次のコマンドで確認できます。

```powershell
gh run list -R Termnix-IT/portfolio-site --limit 1
```

commit メッセージは英語の命令形の件名に、変更点を箇条書きした本文を付ける形式で揃えています。
