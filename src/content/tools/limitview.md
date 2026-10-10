---
title: LimitView
order: 4
anchor: tool-4
category: ai usage monitor
summary: Codex と Claude Code のサブスクリプション利用枠を自動で取得し、5時間枠と週間枠の残り割合をひとつの小さな画面で確認できる Windows 向けアプリです。
tags: [Tauri v2, Rust, React, TypeScript, Vite]
repo: https://github.com/Termnix-IT/ai-limit-view
release: v0.1.10
screenshots:
  - image: ../../assets/limitview-dashboard.png
    alt: LimitView の通常表示。Codex と Claude Code の利用枠の残り割合を二重リングで示し、下に5時間枠・週間枠の残りと回復までの時間を並べている
    caption: 通常表示
  - image: ../../assets/limitview-mini.png
    alt: LimitView のミニマル表示。二重リングと残り割合だけを 200×200 の小さな窓に表示している
    caption: ミニマル表示（200×200）
---

Codex と Claude Code のサブスクリプション利用枠を自動で取得し、5時間枠と週間枠の残り割合をひとつの小さな画面で確認できる Windows 向けデスクトップアプリです。2つの AI コーディングツールを併用していると、どちらの枠があとどれだけ残っているかを確かめるたびに別々の画面を開く必要があったため、常駐させて一目で判断できるダッシュボードとして作りました。

Codex は青、Claude Code はオレンジの二重リングで残量を表示し、中央のアイコンのクリックやホイールで表示するサービスを、中央の数値や枠のラベルのクリックで5時間枠と週間枠を切り替えられます。リセットまでの残り時間も表示し、透明・非装飾のウィンドウと 200×200 のミニマル表示で作業の邪魔にならないようにしています。

残量は Codex CLI の app-server と、アプリに同梱した OpenUsage から読み取り、サービスごとに60秒間隔で更新します。取得できない場合は「要認証」「CLI未検出」「時間超過」「取得失敗」に分類して原因と復旧手順を示し、タイムアウトやアプリ終了時には起動した取得用プロセスを子孫まで停止します。同梱する OpenUsage はビルド時にバージョンを固定してチェックサムを検証し、取得結果はメモリ上だけに保持してディスクへ保存しない設計です。v0.1.10 では Windows x64 向けインストーラーと SHA-256 チェックサムを配布しています。
