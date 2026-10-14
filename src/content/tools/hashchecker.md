---
title: HashChecker
order: 2
anchor: tool-2
category: hash verification
summary: ベンダー提供のハッシュ値と対象ファイルを照合するツールです。PowerShell 版に加え、共通仕様を起こして Python / Go / C#/.NET / Rust でも同じ仕様を実装しています。
tags: [PowerShell, Python, Go, C#/.NET, Rust, GitHub Actions]
repo: https://github.com/Termnix-IT/HashChecker
secondaryLink:
  label: 共通仕様を見る
  href: https://github.com/Termnix-IT/HashChecker/blob/main/%E5%85%B1%E9%80%9A%E4%BB%95%E6%A7%98.md
featured: 4
---

ベンダーから提供されたハッシュ値と、確認対象ファイルから算出したハッシュ値を比較するためのツールです。MD5 と SHA256 に対応し、ハッシュ値を記載したテキストファイルと対象ファイルを指定するだけで照合できます。空行の無視、複数行検出、16進数形式と文字数の検証、大文字・小文字を区別しない比較まで仕様として定めています。

もとは業務想定の制約下で必要になった確認作業がきっかけで、外部ツールを導入せず Windows 標準機能だけで完結させる前提から PowerShell 版を設計しました。それとは別に、自宅環境で改めて共通仕様書を起こし、同じ仕様を Python / Go / C#/.NET / Rust の 4 言語で CLI として実装し直しています。

主眼は「同じ仕様を言語を変えて実装したときに何が変わるか」を確かめることに置きました。入力検証・エラー表示・終了コードを言語間で揃えた上で、横断確認スクリプトと GitHub Actions で全実装が同一のテストデータに対して同じ終了コードを返すかを push のたびに検証し、仕様差が出たら検出できるようにしています。
