---
title: オンプレネットワーク構築
order: 1
anchor: project-1
category: on-premises
status: 完成
summary: 上位ルータの配下に DMZ を切って外部公開ホストを隔離し、内部は ER605 で VLAN10/20/30/40 に分けて、ゾーン間の通信を ACL で制御しています。このサイトの配信を自宅の Flask + Nginx から AWS へ移したあと、オンプレは公開サーバの運用と検証の基盤として設計し直しました。
tags: [Linux, DMZ, VLAN, ACL, UFW, ポートフォワーディング]
publications:
  - label: Qiita 記事
    description: DMZ 分離と VLAN セグメント設計についてまとめた記事
    status: 公開準備中
  - label: GitHub リポジトリ
    description: ネットワーク構成と公開サーバの設定ファイル
    status: 公開準備中
diagram:
  image: ../../assets/on-premises-mynetwork.png
  alt: オンプレネットワーク構成図
featured: 1
---

以前はこのサイトを自宅の Flask + Nginx で公開していました。配信を AWS S3 + CloudFront へ移したため、オンプレ側をネットワークから設計し直しました。上位ルータ AX1800 の配下に DMZ（192.168.5.x）を切って外部公開ホストを隔離し、内部は ER605 を境界に VLAN10（クライアント）／20（サーバ）／30（Wi-Fi・IoT）／40（テスト）へ分けています。ゾーン間の通信は ACL で制御しています。

DMZ の Ubuntu では Minecraft サーバを運用しています。ポートフォワーディングで開けるのは必要なポートだけにし、サーバも使うときだけ起動して、外部にさらす範囲と時間を抑えています。テスト用の VLAN40 も、検証するときだけ立ち上げます。
