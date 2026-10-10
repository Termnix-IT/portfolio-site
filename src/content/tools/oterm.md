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

Rust で作ったオリジナルのターミナルソフトです。ratatui と portable-pty を土台に、vt100 で解析した画面を自作のレンダラで描画し、tmux のようなタブと左右・上下に何段でも分割できるペインをひとつの TUI で扱えます。ローカルシェルと SSH の接続先は TOML のプロファイルで管理し、SSH は OS 標準の ssh を呼び出すため、鍵やエージェントによる認証は通常の SSH と同じ仕組みで動きます。

Ctrl+Space で開くモーダルに「1MB 以上のファイルを大きい順に列挙」のような自然言語を入力すると、AI がコマンドを提案してアクティブなペインに挿入します。挿入時には改行を付けず、内容を確認してから自分で実行する流れにしています。AI はクラウドの Anthropic Claude とローカルの Ollama をモーダル内で切り替えられ、API キーは設定本体とは別の secrets.toml に分離して、設定ファイルを共有してもキーが混ざらないようにしました。

v0.5.0 では、過去に実行したコマンドを自然言語で探せるコマンド履歴の AI 検索を追加しました。LLM には質問文だけを送り、返ってきた検索語を使って手元の PowerShell / bash の履歴と照合するため、履歴そのものは外部に送信しません。CI でビルドとテストを行い、Windows / macOS / Linux 向けのバイナリをリリースで配布しています（動作確認は Windows のみ）。
