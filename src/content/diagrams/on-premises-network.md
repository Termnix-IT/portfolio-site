---
title: オンプレネットワーク構成図
order: 1
anchor: diagram-1
category: on-premises
status: 完成
date: 2026年9月
tags: [DMZ, VLAN, ACL, Zabbix, SNMP, Linux]
image: ../../assets/on-premises-mynetwork.png
alt: オンプレネットワーク構成図
---

AX1800 配下の DMZ（192.168.5.x）に外部公開ホストを隔離し、内部は ER605 を境界に VLAN10/20/30/40 へ分割した構成。ゾーン間は ACL で制御し、VLAN20 の Raspberry Pi に置いた Zabbix Server から ER605 と公開サーバを監視しています。
