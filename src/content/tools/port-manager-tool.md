---
title: Port Manager Tool
order: 3
anchor: tool-3
category: port management
summary: 開発環境で起動したまま残っているサーバーや DB のポートを見つけ、確認・停止・登録・監視をひとつの画面で行える Windows 向けアプリです。
tags: [Electron, JavaScript, PowerShell, electron-builder, GitHub Actions]
repo: https://github.com/Termnix-IT/PortManagerTool
release: v1.0.0
---

開発中に起動したまま残っているサーバーや DB のポートを見つけ、確認・停止・監視をひとつの画面で行える Windows 向けアプリです。

TCP / UDP の使用中ポートをプロセス名・PID とともに一覧表示し、開発サーバーや DB のポートだけに絞り込めます。ポートを使っているプロセスの停止、同じポートの競合や Hyper-V / WSL / Docker による予約範囲の診断、ポートの使用開始・解放の履歴、お気に入りポートの監視とデスクトップ通知に対応しています。停止では OS の重要なプロセスを止められないようにし、停止の直前にもう一度状態を確かめて、表示が古ければ中止します。

インストーラー版（自動アップデート対応）とポータブル版を GitHub Releases で配布しています。配布中の v1.0.0 は Electron 製で、リポジトリでは Rust（Tauri v2）版への作り直しを進めています。
