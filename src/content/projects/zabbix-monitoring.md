---
title: Zabbix 監視基盤
order: 2
anchor: project-2
category: monitoring
status: 運用中
summary: Raspberry Pi に Zabbix を構築し、ルーター・監視サーバー自身・DMZ の公開サーバの3台を監視しています。常に動いている機器で障害が起きたら Discord へ自動で通知し、監視値は API からも取得して確かめています。
tags: [Zabbix, Raspberry Pi, Linux, Discord, API]
publications:
  - label: Qiita 記事
    description: 監視・Discord 通知・API でのデータ取得を、実際に取れた値とあわせてまとめた記事
    status: 公開済み
    href: https://qiita.com/Termnix-IT/items/4d704e19f2aa79e0de6c
  - label: GitHub リポジトリ
    description: Zabbix 構成の設定ファイル・手順
    status: 公開準備中
screenshots:
  - image: ../../assets/zabbix-server-health.jpg
    alt: Zabbix のダッシュボードに表示された、1秒あたりのデータ処理数、データ収集プロセスと内部プロセスの利用率のグラフ
    caption: Zabbix server health のダッシュボード（データ処理数とプロセスの利用率）
  - image: ../../assets/zabbix-cpu-24h.jpg
    alt: 監視サーバーの CPU 使用率の過去24時間の推移。ほぼ 0.5% 前後で推移し、午前3時半ごろに 2.6% まで上がっている
    caption: 監視サーバーの CPU 使用率（2026年10月14日までの24時間）
featured: 2
thumbnail:
  image: ../../assets/zabbix-values-processed.jpg
  alt: Zabbix のダッシュボードに表示された、1秒あたりのデータ処理数のグラフ
---

自宅環境で監視の仕組みを自分で試すため、VLAN20（サーバセグメント）の Raspberry Pi に Zabbix Server を構築しました。監視しているのは、Raspberry Pi 自身、ER605（ルーター）、DMZ の公開サーバ（Ubuntu）の3台です。Raspberry Pi 自身と公開サーバは Zabbix Agent で CPU・メモリ・ディスクを、ER605 は ICMP で疎通と応答時間を確認しています。

障害の通知は Discord の Webhook に送ります。常に動いている Raspberry Pi と ER605 で警告以上の障害が起きたときに、発生と復旧を Discord へ自動で知らせるアクションを設定しました。公開サーバは使うときだけ起動するので、電源を切るたびに通知が届かないよう、通知の対象からは外しています。

監視値は画面で見るだけでなく、Zabbix API からも取得しています。API には読み取り権限と使えるメソッドを絞った専用ユーザーのトークンを使い、最新値と一緒に最終取得時刻や Agent の利用可否も確かめることで、値が来ていない項目を正常と見誤らないようにしています。管理画面と API は自宅のネットワーク内だけで使い、公開サーバとはセグメントを分けて監視以外の通信を止めていますが、接続はまだ HTTP のため、HTTPS 化に取り組んでいます。構成と検証の詳細は Qiita 記事にまとめました。
