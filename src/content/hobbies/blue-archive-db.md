---
title: Blue Archive DB（SCHALE.OS）
order: 1
anchor: blue-archive-db
category: personal database
tags: [Vue 3, Dexie.js, IndexedDB, Marked.js, Python, GitHub Pages]
site: https://termnix-it.github.io/
repo: https://github.com/Termnix-IT/Termnix-IT.github.io
notice: 非公式のファン制作物です。『ブルーアーカイブ』の知的財産権は Nexon Games / Yostar Games に帰属します。
---

ゲーム「ブルーアーカイブ」をプレイするための個人用データベースです。生徒ごとの育成記録（所持・絆Lv・星ランク・装備・スキル・固有武器など）、ガチャシミュレーター、チーム編成、Markdown で書ける攻略メモ、素材の在庫と生徒別の必要素材の過不足を、ひとつの画面で管理できる Vue 3 のシングルページアプリとして作りました。

ビルドツールやパッケージのインストールを使わず、ブラウザだけで動く構成にしています。育成データは localStorage、ガチャ履歴・メモ・編成・素材は IndexedDB（Dexie.js）に分けて保存し、データはサーバーへ送信しません。代わりに JSON の書き出しと取り込み（置き換えまたは統合）でバックアップできるようにしています。生徒のマスタデータは CSV を編集して Python スクリプトで JSON を生成する流れにし、エンジニアでない人にも使えるよう、各画面の使い方とバックアップの手順をまとめた「使い方」タブをアプリ内に用意しました。

見た目は、ゲーム内のタクティカル端末を思わせる独自テーマ「SCHALE.OS」で、シアンとピンクの差し色、角ばった括弧の装飾、方眼の背景で組んでいます。
