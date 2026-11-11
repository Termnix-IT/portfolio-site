---
title: oterm
order: 5
anchor: tool-5
category: terminal multiplexer
summary: タブと分割ペインを扱える Rust 製のターミナルソフトです。自然言語で入力すると AI がコマンドを提案し、内容を確認してから実行できます。
tags: [Rust, ratatui, portable-pty, Claude API, Ollama, GitHub Actions]
repo: https://github.com/Termnix-IT/oterm
release: v0.5.0
---

タブと分割ペインを扱える Rust 製のターミナルソフトです。tmux のように、ひとつの画面でタブを切り替え、ペインを上下左右に何段でも分割できます。

ローカルのシェルと SSH の接続先をプロファイルで管理でき、SSH は OS 標準の ssh を使うため、鍵による認証も普段どおり使えます。「1MB 以上のファイルを大きい順に列挙」のように自然言語で入力すると AI（Claude またはローカルの Ollama）がコマンドを提案し、過去に実行したコマンドを自然言語で探すこともできます。提案されたコマンドは自動では実行せず、内容を確かめてから自分で実行する流れにしています。

Windows / macOS / Linux 向けのバイナリを GitHub Releases で配布しています（動作確認は Windows のみ）。
