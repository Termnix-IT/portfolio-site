---
title: CIPHER VAULT
order: 1
anchor: tool-1
category: password manager
summary: ローカル動作を前提にしたパスワード管理アプリです。Rust（Tauri）で作り、データは自端末の SQLite に保存して外部サーバーへ送信しない構成にしています。
tags: [Tauri v2, Rust, React, TypeScript, SQLite]
repo: https://github.com/Termnix-IT/CIPHER-VAULT
release: v1.0.1
featured: 3
---

自端末だけで動くパスワード管理アプリです。ログイン情報、API キー、クレジットカード、銀行・証券の取引用パスワードなど、種類の違う秘密情報をまとめて保管できます。

検索とグループ表示、パスワード生成、クリップボードへのコピー、一定時間での自動ロックに対応し、専用パスフレーズで保護する暗号化バックアップと復元、弱いパスワードや使い回しを調べる点検機能も備えています。Rust（Tauri）と React で作り、データは自端末の SQLite に暗号化して保存します。秘密情報を外部のサーバーへ送らないことを前提にしており、ほかのアプリから保管庫へつなぐ機能も持たせていません。

Windows 向けの setup 版と portable 版を GitHub Releases で配布しており、setup 版はアプリ内から更新用の署名を確かめたうえで更新できます。配布物はコード署名されていないため、初回の起動で SmartScreen の警告が出る場合があります。
