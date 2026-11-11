# Portfolio_Web

Termnix-IT の個人ポートフォリオサイトです。実務での運用保守・ネットワーク対応の経験と、個人で進めている Linux / Network / Python の検証を、Qiita・GitHub での発信とあわせて公開しています。

https://www.termnix-it.jp/

公開リポジトリのため、機密情報や業務固有の情報は含めません。実務経歴は公開できる粒度に要約しています。

## Overview

- Astro で生成する静的サイトで、実行時のサーバーはありません。
- 掲載内容は Markdown / YAML に書き、ページの共通部分はコンポーネントにまとめています。
- 画像は build 時に WebP へ変換します。CSS・JS・画像はファイル名にハッシュを付けて長期キャッシュします。
- PC・タブレット・モバイルの画面幅と、`prefers-reduced-motion` に対応しています。
- GitHub Actions で AWS S3 + CloudFront へ自動デプロイします。

## Pages

| URL | 役割 |
|---|---|
| `index.html` | ホーム：現在の状況、今の強み、代表作、経歴、スキル、資格、発信 |
| `portfolio.html` | 個人プロジェクトの詳細（オンプレネットワーク構築、Zabbix 監視基盤など） |
| `toolbox.html` | 自作ツールの一覧と詳細 |
| `diagram.html` | システム構成図ギャラリー |
| `contact.html` | 連絡チャンネルと問い合わせフォーム |
| `news.html` | 今取り組んでいること（Now）と、サイト更新・リリース・活動の記録 |
| `hobby.html` | 趣味の制作（フッターからのみリンク） |

## Tech Stack

- Astro（静的出力、コンテンツコレクション、`astro:assets` による画像最適化）
- TypeScript（ブラウザで動く小さな処理のみ）
- Google Fonts（IBM Plex Sans JP / JetBrains Mono）

## Directory Structure

```text
Portfolio_Web/
├─ src/
│  ├─ pages/          # 7ページ（build で *.html になる）
│  ├─ layouts/        # <head> とヘッダー・フッターを入れる共通レイアウト
│  ├─ components/     # ヘッダー、見出し、カード、フォームなどの部品
│  ├─ content/        # tools / projects / diagrams / hobbies の Markdown
│  ├─ data/           # profile.yaml（経歴・スキル・資格）、site.ts（ナビとページ情報）
│  ├─ assets/         # 最適化して載せる画像
│  ├─ styles/         # 色・書体などのトークンと共通スタイル
│  └─ content.config.ts
├─ public/static/img/ # og:image など固定パスで配信するファイル
├─ .github/workflows/ # GitHub Actions による自動デプロイ
└─ astro.config.mjs
```

## Local Preview

Node.js 22.12 以上が必要です。

```powershell
npm ci
npm run dev
```

`http://localhost:4321` で確認できます。本番と同じ出力は `npm run build` で `dist/` に作られ、`npm run preview` で確認できます。

## Deployment

- 変更は `develop` ブランチにまとめ、公開するときに `main` へ反映します。
- `develop` への push では、GitHub Actions が検査（`npm run check`）とビルドだけを行います。本番には出ません。
- `main` への push では、検査とビルドが通った場合だけ `dist/` を AWS S3 へ同期し、CloudFront のキャッシュを無効化します。

## Contact Form

`contact.html` の問い合わせフォームは、AWS Lambda Function URL へ JSON を POST します。サイトを静的なまま運用するためです。

送信処理は `src/components/ContactForm.astro` にあり、`name`, `email`, `topic`, `message`, `_gotcha` を送ります。Lambda / SES 側の設定と運用方針は、このリポジトリの外でローカルに管理しています。
