---
title: LimitView
order: 4
anchor: tool-4
category: ai usage monitor
summary: Codex と Claude Code を中心に、AI サービスのサブスクリプション利用枠を自動で取得し、5時間枠と週間枠の残り割合をひとつの小さな画面で確認できる Windows 向けアプリです。
tags: [Tauri v2, Rust, React, TypeScript, Vite]
repo: https://github.com/Termnix-IT/ai-limit-view
release: v1.0.0
screenshots:
  - image: ../../assets/limitview-dashboard.png
    alt: LimitView の通常表示。Codex と Claude Code の利用枠の残り割合を二重リングで示し、下に5時間枠・週間枠の残りと回復までの時間を並べている
    caption: 通常表示
  - image: ../../assets/limitview-mini.png
    alt: LimitView のミニマル表示。二重リングと残り割合だけを小さな窓に表示している
    caption: ミニマル表示
---

Codex や Claude Code など AI サービスの利用枠を自動で取得し、5時間枠と週間枠の残りをリングで一目で確認できる Windows 向けアプリです。複数の AI コーディングツールを併用していても、残量を確かめるためにそれぞれの画面を開かずに済みます。

リングは1～3本で、表示するサービスと色を選べ、リセットまでの残り時間も表示します。作業の邪魔にならないよう、リングだけを好きな大きさで出すミニマル表示と、右クリックで表示の切り替えや最前面の固定を選べるメニューを備えています。Rust（Tauri）と React で作り、残量は Codex CLI と同梱の OpenUsage から読み取ります。取得結果はメモリ上だけに保持し、ディスクへは保存しません。

Windows x64 向けのインストーラーを SHA-256 チェックサム付きで配布しており、アプリ内から署名を確かめたうえで更新できます。インストーラーはコード署名されていないため、SmartScreen の警告が出る場合があります。また、Codex と Claude Code 以外の Z.AI Coding Plan などのサービスは、実契約アカウントでの残量取得が未検証です。
