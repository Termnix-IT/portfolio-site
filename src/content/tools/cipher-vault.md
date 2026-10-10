---
title: CIPHER VAULT
order: 1
anchor: tool-1
category: password manager
summary: ローカル動作を前提にしたパスワード管理アプリです。データは自端末の SQLite に保存し、外部サーバーへ送信しない構成にしています。
tags: [Electron, React, Node.js, SQLite, TypeScript]
repo: https://github.com/Termnix-IT/CIPHER-VAULT
release: v0.2.2
featured: 2
---

ローカル動作を前提にしたパスワード管理アプリです。データは自端末の SQLite に保存し、外部サーバーへ送信しない構成で、保管庫のロック・解錠、エントリ管理、パスワード生成、クリップボードコピー、自動ロックに対応しています。

v0.2.2 では、専用パスフレーズで保護する暗号化バックアップ（.cvault 形式）と空の保管庫への復元、弱い・重複・古いパスワードを端末内で点検するセキュリティ監査と SECURITY SCORE を追加しました。監査は外部へのパスワード送信や漏えい情報の照会を行わず、復元は全件を検証してから一括保存し、誤パスフレーズや改ざん、書き込み失敗時にはデータを追加しない設計にしています。

Electron 版として Windows 向けの setup / portable 配布にも対応し、GitHub Releases から起動用ファイルを取得できるようにしています。setup 版はアプリ情報から手動更新できます。
