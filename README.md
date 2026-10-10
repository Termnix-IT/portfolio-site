# Portfolio_Web

Termnix-IT の個人ポートフォリオサイトです。Linux・Network・Python を軸にした実務経験と個人プロジェクトを、
大きな見出しと1列のレイアウトで読みやすく整理して公開しています。

https://www.termnix-it.jp/

## Overview

- Astro で生成する静的サイト（実行時のサーバーなし）
- 掲載内容は Markdown / YAML で管理し、ページの共通部分はコンポーネントで1か所にまとめている
- 画像は build 時に WebP へ変換し、CSS・JS・画像はファイル名にハッシュを付けて長期キャッシュ
- レスポンシブ対応（PC / タブレット / モバイル）、`prefers-reduced-motion` に対応
- AWS S3 + CloudFront へ GitHub Actions で自動デプロイ

## Pages

| URL | 役割 |
|---|---|
| `index.html` | ホーム：現在の状況、今の強み、代表作、経歴、スキル、資格、発信 |
| `portfolio.html` | 個人プロジェクトの詳細（オンプレネットワーク構築、Zabbix 監視基盤など） |
| `toolbox.html` | 自作ツールの一覧と詳細 |
| `diagram.html` | システム構成図ギャラリー |
| `contact.html` | 連絡チャンネルと問い合わせフォーム |
| `hobby.html` | 趣味の制作（フッターからのみリンク） |

## Tech Stack

- Astro（静的出力、コンテンツコレクション、`astro:assets` による画像最適化）
- TypeScript（ブラウザで動く小さな処理のみ）
- Google Fonts（IBM Plex Sans JP / JetBrains Mono）

## Directory Structure

```text
Portfolio_Web/
├─ src/
│  ├─ pages/          # 6ページ（build で *.html になる）
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

起動後、ブラウザで `http://localhost:4321` を開いて確認してください。本番と同じ出力は `npm run build` で `dist/` に作られ、`npm run preview` で確認できます。

## Deployment

- `main` ブランチへの push を契機に GitHub Actions が起動
- `npm run check` と `npm run build` が通った場合だけ、`dist/` を AWS S3 へ同期し、CloudFront のキャッシュを無効化

## Contact Form

`contact.html` の問い合わせフォームは、静的サイト運用を維持するため AWS Lambda Function URL への JSON POST を前提にしています。
送信処理は `src/components/ContactForm.astro` で行い、`name`, `email`, `topic`, `message`, `_gotcha` を JSON として送信します。

Lambda / SES 側の設定と運用方針は、このリポジトリ外でローカルに管理しています。

## Purpose

このリポジトリは、以下を一つの公開成果物として整理することを目的にしています。

- 実務での運用保守・ネットワーク対応経験
- 個人での Linux / Network / Python 検証
- Qiita / GitHub と連動した継続的なアウトプット

## Notes

- 公開用リポジトリのため、機密情報・業務固有情報は含めない方針
- 実務経歴は公開可能な粒度に要約
- デザイン・掲載内容は継続的に更新
