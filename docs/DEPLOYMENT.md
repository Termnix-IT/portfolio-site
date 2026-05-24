# Deployment

このリポジトリは GitHub Actions により、`master` ブランチへの `push` を契機に AWS S3 + CloudFront へ自動デプロイできます。

- AWS S3 + CloudFront

対象ワークフローは `.github/workflows/deploy.yml` です。

## 前提

- サイトはビルド不要の静的ファイル構成です
- 配布対象はリポジトリ直下の `*.html` と `static/` 配下です
- `docs/`, `.github/`, `.gitignore`, `README.md` などの公開不要ファイルは bundle に含めません

## AWS 設定

### GitHub Secrets

リポジトリの `Settings > Secrets and variables > Actions` に以下を登録してください。

- `AWS_REGION`
  - 例: `ap-northeast-1`
- `AWS_ROLE_TO_ASSUME`
  - GitHub Actions から AssumeRole する IAM Role ARN
  - 例: `arn:aws:iam::123456789012:role/github-actions-portfolio-deploy`
- `S3_BUCKET_NAME`
  - 配布先 S3 バケット名
- `CLOUDFRONT_DISTRIBUTION_ID`
  - キャッシュ削除対象の Distribution ID

### 推奨 IAM 構成

GitHub Secrets にアクセスキーを保存するより、GitHub OIDC で IAM Role を引き受ける構成を推奨します。

IAM Role には少なくとも以下が必要です。

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`
- `cloudfront:CreateInvalidation`

OIDC の信頼ポリシーでは、このリポジトリの `master` ブランチからの実行だけを許可してください。

`repo:Termnix-IT/portfolio-web:ref:refs/heads/master`

## デプロイ内容

ワークフローは最初に `_site/` を作成し、公開対象ファイルだけをまとめます。その後、同じアーティファクトを使って以下を実行します。

- S3 へ同期
- CloudFront の全体 invalidation

## 注意点

- CloudFront の invalidation は毎回 `/*` を削除するため、更新頻度が高い場合は運用コストを見直してください
- `master` 以外のブランチでも試したい場合は、`workflow_dispatch` で手動実行できます
