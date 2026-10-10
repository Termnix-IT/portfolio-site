---
title: このサイトの構成図
order: 2
anchor: diagram-2
category: aws / ci-cd
status: 完成
date: 2026年10月
tags: [CloudFront, S3, Lambda, SES, GitHub Actions, OIDC, Astro]
image: ../../assets/site-architecture.svg
alt: このサイトの構成図。閲覧者のブラウザは CloudFront 経由で S3 の静的ファイルを受け取り、問い合わせは Lambda から SES でメールを送る。GitHub の main への push で GitHub Actions が検査とビルドを行い、成功したときだけ S3 へ同期して CloudFront のキャッシュを無効化する
---

いま見ているこのサイトの構成です。Astro で生成した静的ファイルを S3 に置き、CloudFront から HTTPS で配信しています。問い合わせフォームは Lambda Function URL で受け付けて SES でメールを送り、サーバーを常時動かさない構成にしています。

更新は main への push だけで完結します。GitHub Actions が型の検査とビルドを通した場合にだけ、OIDC で発行される一時的な認証情報で S3 へ同期し、CloudFront のキャッシュを無効化します。長期のアクセスキーをリポジトリに置かずに済み、HTML は毎回更新を確認させ、ファイル名に内容のハッシュが入る CSS・JS・画像は1年間キャッシュすることで、更新の速さと表示の速さを両立しています。
