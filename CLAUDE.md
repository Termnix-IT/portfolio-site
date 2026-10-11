# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリの性質

Termnix-IT の自己紹介ポートフォリオサイトで、Astro で静的 HTML を生成しています。作成ツールの追加、資格や経歴の更新など、本人のプロフィールの変化に合わせて掲載内容を継続的に書き足していくことが主な作業になります。

公開リポジトリであり、`main` への push がそのまま本番サイトに反映されます。普段の変更は `develop` にまとめ、ユーザーの指示があったときだけ `main` へ反映します（「公開までの流れ」を参照）。社名・顧客名・案件固有の情報は掲載せず、実務経歴は公開できる粒度に要約して書きます。プロフィール更新の元になる情報（取得した資格、担当業務の変化など）はユーザーがその都度チャットで伝えるので、推測で経歴やスキルを書き足さないでください。

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

ページは `src/pages/` の7ファイル（ほかに 404 ページと sitemap）で、`astro.config.mjs` の `build.format: 'file'` により `index.html`・`portfolio.html`・`toolbox.html`・`diagram.html`・`news.html`・`contact.html`・`hobby.html` として出力されます。外部から張られているリンクを壊さないよう、この URL とページ内アンカー（`#tool-1`、`#project-1` など。各コンテンツの `anchor` で指定）は変えないでください。`hobby.html`（趣味の制作）は仕事の実績と分けるため、ヘッダーのナビには載せず、フッターからだけリンクしています。

共通部分はコンポーネントにまとめてあり、`src/layouts/BaseLayout.astro` が `<head>`（title・description・canonical・OGP）、`SiteHeader.astro`（ナビゲーション）、`SiteFooter.astro` をすべてのページに入れます。ナビの項目と各ページの title・description は `src/data/site.ts` に1か所で書き、description は各ページのヒーローの説明文（`PageHero` の `lead`）と揃えます。canonical と og:url は `astro.config.mjs` の `site` から自動で作られます。フッターの著作権表記の年（`© 2025–2026`）は `SiteFooter.astro` に書いてあるので、年が変わったら更新します。

掲載内容はテンプレートから分け、次のファイルに置いています。

- `src/data/profile.yaml`：現職・領域（ホームのヒーローの状態表示。変わりにくいものだけ）、今の強み、経歴、スキル、資格。配列の順がそのまま表示順です。
- `src/content/tools/*.md`：作成ツール。frontmatter に名前・分類・一覧用の短い説明・タグ・リポジトリ・リリースのタグを書き、本文に説明の段落を書きます。`order` で並び順、`anchor` でページ内アンカーを決めます。
- `src/content/projects/*.md`：構築プロジェクト（`portfolio.html`）。関連する記事やリポジトリの公開状況は `publications`、構成図は `diagram` に書きます。
- `src/content/diagrams/*.md`：構成図ギャラリー（`diagram.html`）。
- `src/content/hobbies/*.md`：趣味の制作（`hobby.html`）。サイトとリポジトリのリンク、題材の権利表記（`notice`）を frontmatter に書きます。ゲームなど他者の作品を題材にしたものは、キャラクター画像やロゴが写るスクリーンショットを載せず、非公式のファン制作物であることと権利の帰属を `notice` に明記します。

- `src/data/updates.yaml`：News の記録。`type` でサイト更新（`site`）・作成ツールのリリース（`release`）・活動（`activity`）・学習（`learning`）を分け、News ページ（`news.html`）の「更新と活動の記録」に月ごとに並びます。いちばん上の1件はホームの冒頭にお知らせの札（`NewsPill.astro`）として出て、全ページのフッターの最終更新日にもなります。日付は日本時間で、リリースは GitHub のリリース日を日本時間に直して書きます。
- `src/data/now.yaml`：News ページの「Now（今取り組んでいること）」と、その内容がいつ時点のものか（`asOf`）。制作中や学習中など変わりやすい活動はここに書き、終わったもの（公開した、資格を取ったなど）は消して `updates.yaml` に記録として残します。中身は本人から聞いた内容だけにし、推測で足しません。

ホームの「代表作」には、プロジェクトとツールのうち frontmatter に `featured`（並び順の番号）を持つものが並びます。

見た目は「案B」のデザインで、サイト全体の色・書体・余白のトークン（`--accent`、`--ink`、`--font-sans` など）とボタン・カードなどの共通クラスは `src/styles/global.css` に、部品ごとのスタイルは各 `.astro` ファイルの `<style>`（Astro がそのファイル内だけに効くよう自動で範囲を絞る）に書きます。書体は IBM Plex Sans JP と JetBrains Mono の2種類で、アクセント色は1色だけにしています。`!important` やインライン style は使わず、詳細度か記述位置で解決してください。アイコンは `src/components/Icon.astro` の線画 SVG を使い、装飾目的のものは `aria-hidden` にし、アイコンだけのボタンやリンクには `aria-label` で名前を付けます。動きは控えめにそろえ、すべて `prefers-reduced-motion` で動きを減らす設定の閲覧者には出さず、最初から完成した状態で表示します。主な動きと置き場所は次のとおりです。

- ホーム冒頭：小見出し `$ whoami -> infra engineer` を1文字ずつ打ち、見出しの「土台」（`<mark>`）に蛍光ペンを引く。ページを開くたびに再生する（`PageHero.astro` の `intro`。打つ演出は文字数を `ch` で数えるため、英数字だけの小見出しで使う）。
- ホームの経歴：左の線が上から伸び、点が弾み、項目が順に浮かぶ。画面に初めて入ったときだけ再生する（`index.astro` の `data-reveal-once` と IntersectionObserver。JS が動かない環境で隠れたままにならないよう、隠す指定は `BaseLayout.astro` が `<html>` に付ける `js` クラスがあるときだけ効かせている）。
- 代表作とツール一覧のカード：乗せる・フォーカスすると、枠がアクセント色になって少し浮き、題名に下線が走り、矢印が進む。
- 隠しコマンド：ホームでヘッダーのロゴを2秒以内の間隔で5回続けてクリックすると、右下に端末風の表示で `ping` の応答と一言が出る（`SiteHeader.astro`）。ホームでのロゴのクリックはページを読み直さず先頭へ戻すだけにしている。
- そのほか、ページ遷移のフェード、状態表示の波紋、構成図の拡大表示がある。

ブラウザで動く処理は、それぞれ使うコンポーネントの `<script>` に書いています。狭い画面のメニュー開閉は `SiteHeader.astro`、構成図の拡大表示はブラウザ標準の `<dialog>` を使う `ZoomableImage.astro`、ホームの Qiita 最新記事の取得（閲覧時に Qiita API を呼ぶ）は `QiitaList.astro`、問い合わせフォームの送信は `ContactForm.astro` です。問い合わせフォームは `data-endpoint` の AWS Lambda Function URL へ JSON を POST する前提で、Lambda / SES 側はこのリポジトリの外で管理しています。フォームの動作をローカルで確かめるときは、本番の Lambda に送信しないよう `fetch` を差し替えてから試してください。

各ページの `<head>` には、Astro の `security.csp`（`astro.config.mjs`）が Content-Security-Policy の meta を出し、読み込める先をこのサイト自身、Google Fonts、Qiita API、問い合わせの Lambda Function URL に絞っています。ページ内の `<script>` と `<style>` は build 時にハッシュで許可されるので普段は意識しなくてよいですが、外部の画像・スクリプト・API を新しく使う場合や Lambda の URL を変えた場合は `astro.config.mjs` の許可先も直さないと、ブラウザに遮断されます。変更後はブラウザのコンソールに CSP 違反が出ていないかを確認してください。CSP 以外のセキュリティヘッダー（`Strict-Transport-Security`、`X-Content-Type-Options: nosniff`、`X-Frame-Options`、`Referrer-Policy` など）は、CloudFront のデフォルトのビヘイビアに付けたマネージドのレスポンスヘッダーポリシー `SecurityHeadersPolicy` が付けています（リポジトリ外の設定）。`nosniff` があるため、新しい種類のファイルを配信するときは S3 上の Content-Type が正しいことを確認してください。Markdown のコードの色付けはインライン style を使うため無効にしています。

存在しない URL に対しては `src/pages/404.astro`（端末で存在しない場所へ `cd` した画面に見立て、`ls` の結果として各ページへのリンクを並べる）を返します。S3 は存在しないキーに 403 を返すため、CloudFront のカスタムエラーレスポンスで 403 と 404 を `/404.html`（ステータス 404）に置き換える設定にしています（リポジトリ外の設定）。検索エンジン向けには、`src/data/site.ts` のページ一覧から `noindex` 以外を並べた `sitemap.xml`（`src/pages/sitemap.xml.ts`）と、`public/robots.txt` を出しています。ページを増やしたら `site.ts` に足せば sitemap にも載ります。

## よくある更新作業

閲覧者から見える変更（ツールやプロジェクトの追加・更新、ページの追加、プロフィールの更新、デザインの大きな変更）をしたら、同じ commit で `src/data/updates.yaml` の `items` のいちばん上に、日付・種類（`type`）・何を変えたかの1文・関連ページへのリンク（任意）を1件足します。文言の手直しや、閲覧者から見えない内部の変更（ビルド設定、ドキュメント）は載せません。作成ツールの新しいリリースを紹介に反映したときは、`release` の記録（リリース日、GitHub のリリースページへのリンク）も足します。

`src/data/now.yaml` の `asOf` が1か月以上前になっていたら、作業のついでにユーザーへ Now の見直しを提案してください。古い「制作中」が出たままだと、かえって活動が止まって見えるためです。

### 作成ツールを追加する（`toolbox.html`）

1. 掲載するツールの GitHub リポジトリの README と最新リリースノートを `gh` で読み、機能・技術スタック・配布形態・最新のタグを確認する。
2. `src/content/tools/` に既存のファイルを複製して新しいファイルを作り、frontmatter の `title`・`order`・`anchor`（`tool-N`）・`category`・`summary`・`tags`・`repo`・`release` を書き換える。一覧のカード、ページ内の番号、「Releaseを見る」のリンクは自動で作られ、「今後の展開」は常に最後に表示される。
3. 本文は3段落程度で、何をするツールか、なぜ作ったか・どこを工夫したか、配布形態と最新バージョンの順に書く。機能の羅列だけで終わらせず、安全面や設計上の判断を読み手に伝える。リリースノートに「動作確認は Windows のみ」などの断り書きがあれば本文にも残す。
4. リリースがなく仕様書などを見せたい場合は、`release` の代わりに `secondaryLink` を書く（HashChecker と同じ形）。ホームの「代表作」にも載せる場合は `featured` を付ける。
5. 画面のスクリーンショットがあれば `src/assets/` に `<ツール名>-<画面>.png` の名前で置き、`screenshots` に画像・`alt`・`caption` を並べる（LimitView と同じ形）。詳細の説明文の上に元の大きさ以下で横に並び、1枚目はホームの「代表作」の画像にも使われる。

既に掲載しているツールの新バージョンが出たときは、`release` のタグと、本文のバージョンに言及した段落を新しい内容に書き換えます。

### プロフィールを更新する

資格の取得や担当業務の変化は `src/data/profile.yaml` を直せば全ページに反映されます。資格は `state: acquired`（取得済）か `learning`（学習中）で表します。学習対象が変わったり資格を取得したりしたら、`src/data/now.yaml` の学習中の項目と `asOf` も直し、取得は `updates.yaml` に `learning` の記録として残します。経歴やスキルの変化に合わせて、ホームのヒーローの文言（`src/pages/index.astro`）と、`src/data/site.ts` のホームの description も揃えます。

### 画像を追加する

ページに載せる画像は `src/assets/` に内容が分かる英語のファイル名で置き、コンテンツの frontmatter から相対パスで指定します（例: `image: ../../assets/xxx.png`）。build 時に WebP へ変換され、幅違いの複数サイズが作られます。`alt` には内容が分かる日本語を書きます。構成図としてクリック拡大させたい画像は `ZoomableImage` コンポーネントで表示します。「このサイトの構成図」（`src/assets/site-architecture.svg`）のように手で描いた図は SVG のまま置けます（変換されずにそのまま配信され、拡大しても文字がにじまない）。`<img>` として読み込まれるためページの Web フォントは効かず、文字は閲覧者の端末の日本語フォントで表示されます。サイトの構成（配信・問い合わせ・デプロイの流れ）を変えたら、この図と `src/content/diagrams/site-architecture.md` の説明も直してください。

プロフィールのアイコンは、画面表示とファビコンに `src/assets/main-icon-192.png` を使い、元の1024px の `public/static/img/main-icon.png` は `og:image` 専用です。og:image は SNS などから長く参照されるため、ファイル名にハッシュが付かない `public/static/img/` に置いています。

## git 管理とデプロイ

`.gitignore` は「すべて無視したうえで必要なものだけ `!` で許可する」方式です。現在許可しているのは `src/` と `public/` の全体、`package.json`・`package-lock.json`・`astro.config.mjs`・`tsconfig.json`・`.nvmrc`、`README.md`、`CLAUDE.md`、デプロイ用ワークフローだけで、直下に新しい設定ファイルなどを足す場合は `.gitignore` に許可行を追加しないと commit されません。`dist/`・`node_modules/`・`.astro/` は追跡しません。`docs/` には運用メモなどを置いていますが、意図的に追跡対象から外しているローカル専用の置き場です。

### 公開までの流れ（develop にまとめてから main へ）

細かい修正を1つずつ本番に出さず、まとめて公開するため、ブランチを2段にしています。グローバル指示の「個人リポジトリでは作業用ブランチをデフォルトブランチへ自動で merge・push する」は、このリポジトリでは次のように読み替えます。

1. 作業は `claude/` で始まる作業用ブランチで行い、`npm run check` と `npm run build` を通し、変更したページを `npm run preview`（`preview_start` の `portfolio-build`）で確認してから commit する。
2. 作業用ブランチを `develop` へ fast-forward で取り込み、`develop` を push する。ここまでは確認なしで自動で進めてよい。`develop` への push では GitHub Actions が検査とビルドだけを行い、本番には出ない。
3. `main` への反映（本番公開）は、ユーザーがチャットで公開を指示したときだけ行う。`develop` の最新を取り込んだ状態で検査とビルドが通ることを確かめ、`git push origin develop:main` で `main` を fast-forward する。push 後はデプロイの成否と本番の表示を確認する。
4. 公開の指示がないまま作業を終えるときは、`develop` に未公開の変更が何件あるか（`git log --oneline origin/main..origin/develop`）を完了報告に書く。

News の記録（`src/data/updates.yaml`）のうちサイト更新（`type: site`）の日付は、作業した日ではなく公開した日にそろえるため、公開のときに未公開分の日付を公開日に直す。リリースや活動・学習の記録は、それが起きた日のままにする。

### デプロイの仕組み

`main` への push で `.github/workflows/deploy.yml` が起動し、`npm ci`・`npm run check`・`npm run build` が通った場合だけ、`dist/` を S3 へ同期して CloudFront を `/*` で invalidation します。`develop` への push でも同じワークフローが動きますが、検査とビルドまでで止まります。S3 には、ファイル名に内容のハッシュが入る `_astro/` を1年の `immutable`、og:image などの `static/` を1日キャッシュ、`sitemap.xml`・`robots.txt` を1時間キャッシュ、HTML を `Cache-Control: no-cache` で置きます。古い `_astro/` のファイルは、CloudFront に古い HTML が残っている間も参照先を返せるよう削除しません。`README.md` や `CLAUDE.md` は配信されません。push 後の結果は次のコマンドで確認できます。

```powershell
gh run list -R Termnix-IT/portfolio-site --limit 1
```

commit メッセージは英語の命令形の件名に、変更点を箇条書きした本文を付ける形式で揃えています。
