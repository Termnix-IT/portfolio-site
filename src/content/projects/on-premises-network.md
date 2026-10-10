---
title: オンプレネットワーク構築
order: 1
anchor: project-1
category: on-premises
status: 完成
summary: 上位ルータ配下に DMZ を切って外部公開ホストを隔離し、内部は ER605 で VLAN10/20/30/40 にセグメント分割して ACL でゾーン間を制御しています。当初この Web ページ自体を自宅の Flask + Nginx で公開していましたが、現在は AWS へ移行し、オンプレは公開サーバの運用と検証の基盤として再設計しました。
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

当初は自宅の Flask + Nginx でこの Web ページを公開していましたが、配信を AWS S3 + CloudFront へ移行したことに伴い、オンプレ側をネットワークから設計し直しました。上位ルータ AX1800 の配下に DMZ（192.168.5.x）を切って外部公開ホストを隔離し、内部は ER605 を境界に VLAN10（クライアント）／20（サーバ）／30（Wi-Fi・IoT）／40（テスト）へセグメント分割、ACL でゾーン間の通信を制御しています。

DMZ の Ubuntu では Minecraft サーバを運用しており、ポートフォワーディングで必要なポートのみを開放し、サーバ自体も使用するときだけ起動する運用にすることで、常時外部にさらす面を最小限に抑えています。テスト用の VLAN40 も同様に、検証時のみ立ち上げる構成としました。
