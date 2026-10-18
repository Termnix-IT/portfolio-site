---
title: Pirafu2411 Playground
order: 1
anchor: playground
category: game & tool portal
tags: [React 19, TypeScript, Vite, JSON Schema, Vitest, Playwright, Cloudflare Pages]
site: https://pirafu2411.pages.dev/
repo: https://github.com/Termnix-IT/pirafu-playground
notice: 掲載作品の Blue Archive DB は非公式のファン制作物です。『ブルーアーカイブ』の知的財産権は Nexon Games / Yostar Games に帰属します。
---

趣味で作ったミニゲーム、Web アプリ、ツールをまとめて紹介するための置き場です。作品をカテゴリーやタグ、開発状況で絞り込んで探せるようにし、ブラウザで動く作品は「あそぶ」「つかう」ボタンからそのまま開けます。これまで作品ごとにばらばらだった公開先を、今後はこのサイトに集めていく方針にしました。

サイト（Portal）には作品のタイトル・説明・画像・公開先 URL といった掲載情報だけを持たせ、作品本体はそれぞれ別のリポジトリで開発して作品ごとの Cloudflare Pages で公開しています。掲載情報は作品側に置いた設定ファイル（`pirafu.yaml`）を原本とし、自作の [pirafu CLI](https://github.com/Termnix-IT/pirafu-cli) が JSON Schema で検証してから Portal へ登録用の PR を作ります。作品を更新しても、PR を取り込むまで Portal の掲載内容は変わらないので、意図しない情報が公開されにくい構成です。Content Security Policy で同じオリジンのファイルだけを読み込むよう制限し、フォントも外部配信を使わず同梱しています。

現在は、60秒でどこまで開けるかを競うマインスイーパー「DOPASWEEPER」と、ゲーム「ブルーアーカイブ」の育成状況・ガチャのシミュレーション・攻略メモ・編成・素材の所持数をブラウザだけで管理できる個人用データベース「Blue Archive DB」（開発中）を掲載しています。Blue Archive DB は以前このページで単独で紹介していたもので、データはブラウザ内に保存し、サーバーへは送信しません。
