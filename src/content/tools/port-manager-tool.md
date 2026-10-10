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

Windows 向けのポート管理デスクトップアプリです。開発環境で起動したまま残っているサーバーや DB のポートを見つけ、確認・停止・登録・監視をひとつの画面で行えます。TCP / UDP の使用中ポートをプロセス名・PID・状態とともに一覧表示し、「すべて / 開発 / DB」の切替で Vite・Django・PostgreSQL などのポートだけに絞り込めます。

プロセス停止は誤操作を防ぐ設計を重視しました。通常停止 / 強制停止と子プロセスの一括停止を選べる一方、OS の重要プロセスやアプリ自身は停止不可とし、サービスや別ユーザーのプロセスは追加で確認します。停止直前にはプロセスとポートの状態を再確認し、表示が古ければ中止します。

あわせて、同じポートを別プロセスが待ち受ける競合や Hyper-V / WSL / Docker による予約ポート範囲の診断、ポートの使用開始・解放の履歴記録、お気に入りポートの監視とデスクトップ通知に対応しています。PowerShell 実行部分は依存注入で差し替え、Electron を起動せずにロジックをテストできる構成とし、CI で Lint とテスト、タグ push でビルドとリリースを自動化しています。v1.0.0 ではインストーラー版（自動アップデート対応）とポータブル版を配布しています。
