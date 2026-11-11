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

ベンダーが公開しているハッシュ値と、手元のファイルから計算したハッシュ値を照合し、入手したファイルが壊れたり書き換えられたりしていないかを確かめるツールです。

MD5 と SHA256 に対応し、ハッシュ値を書いたテキストファイルと対象ファイルを指定するだけで照合できます。Windows 標準機能だけで動く PowerShell 版に加え、共通仕様をもとに Python / Go / C#/.NET / Rust でも同じ CLI を実装し、GitHub Actions で全実装が同じテストデータに同じ結果を返すことを確かめています。
