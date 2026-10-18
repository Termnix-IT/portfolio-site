---
title: Pirafu2411 Playground
order: 1
anchor: playground
category: game & tool portal
tags: [React 19, TypeScript, Vite, JSON Schema, Vitest, Playwright, Cloudflare Pages]
site: https://pirafu2411.pages.dev/
repo: https://github.com/Termnix-IT/pirafu-playground
---

趣味で作ったミニゲーム、Web アプリ、ツールをまとめて紹介するための置き場です。作品をカテゴリーやタグ、開発状況で絞り込んで探せるようにし、ブラウザで動く作品は「あそぶ」「つかう」ボタンからそのまま開けます。これまで作品ごとにばらばらだった公開先を、今後はこのサイトに集めていく方針にしました。

サイト（Portal）には作品のタイトル・説明・画像・公開先 URL といった掲載情報だけを持たせ、作品本体はそれぞれ別のリポジトリで開発して作品ごとの Cloudflare Pages で公開しています。掲載情報は作品側に置いた設定ファイル（`pirafu.yaml`）を原本とし、自作の [pirafu CLI](https://github.com/Termnix-IT/pirafu-cli) が JSON Schema で検証してから Portal へ登録用の PR を作ります。作品を更新しても、PR を取り込むまで Portal の掲載内容は変わらないので、意図しない情報が公開されにくい構成です。Content Security Policy で同じオリジンのファイルだけを読み込むよう制限し、フォントも外部配信を使わず同梱しています。

現在は、60秒でどこまで開けるかを競うマインスイーパー「DOPASWEEPER」を掲載しています。これまでこのページで紹介していた Blue Archive DB も、今後 Playground へ移して掲載する予定です。
