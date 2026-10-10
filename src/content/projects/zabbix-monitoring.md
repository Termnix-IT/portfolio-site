---
title: Zabbix 監視基盤
order: 2
anchor: project-2
category: monitoring
status: 完成
tags: [Zabbix, Raspberry Pi, SNMP, SMB, UFW]
publications:
  - label: Qiita 記事
    description: エージェント設定・SNMP 監視・通知の構築まとめ
    status: 公開準備中
  - label: GitHub リポジトリ
    description: Zabbix 構成の設定ファイル・手順
    status: 公開準備中
---

VLAN20（サーバセグメント）の Raspberry Pi 上に Zabbix Server を構築し、自宅環境の監視基盤として稼働させています。ER605 は SNMP で、DMZ の公開サーバはエージェント経由で監視し、セグメントをまたいだ死活・リソース状況を 1 か所で確認できるようにしました。同じ Raspberry Pi では SMB によるファイル共有も併用しています。

### 監視対象

ER605（SNMP）／DMZ 公開サーバ（Zabbix Agent）／Raspberry Pi 自身を監視対象としています。ダッシュボードのスクリーンショットは追って掲載予定です。
