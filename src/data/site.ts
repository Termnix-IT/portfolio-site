// サイト全体で共通の設定値（ナビゲーション、外部リンク、各ページのメタ情報）

// hobby はヘッダーのナビには出さず、フッターからだけリンクする。
// notFound は存在しない URL で CloudFront が返す 404 ページで、検索結果と sitemap には出さない
export type PageKey = 'home' | 'projects' | 'tools' | 'diagrams' | 'news' | 'contact' | 'hobby' | 'notFound';

export const siteName = 'Termnix-ITのページ';

export const links = {
  github: 'https://github.com/Termnix-IT',
  qiita: 'https://qiita.com/Termnix-IT',
};

export const navItems: { key: PageKey; label: string; href: string }[] = [
  { key: 'projects', label: 'Projects', href: '/portfolio.html' },
  { key: 'tools', label: 'Tools', href: '/toolbox.html' },
  { key: 'diagrams', label: 'Diagrams', href: '/diagram.html' },
  { key: 'news', label: 'News', href: '/news.html' },
  { key: 'contact', label: 'Contact', href: '/contact.html' },
];

// <title> と meta description。description は各ページのヒーローの説明文に合わせる。
// noindex のページは検索エンジンに載せず、sitemap.xml からも外す
export const pages: Record<PageKey, { title: string; description: string; path: string; noindex?: boolean }> = {
  home: {
    title: 'ホーム',
    description:
      'インフラエンジニア Termnix-IT のプロフィールです。Linux・ネットワーク・Python を中心に、公開・監視・自動化の経験を実務と個人プロジェクトで積み重ねています。',
    path: '/',
  },
  projects: {
    title: 'ポートフォリオ',
    description:
      'オンプレネットワークの設計や監視基盤の整備など、個人で構築・検証したプロジェクトをまとめています。構成図や関連する記事もあわせて載せています。',
    path: '/portfolio.html',
  },
  tools: {
    title: '作成ツール一覧',
    description: '日々の運用や個人プロジェクトのために自作したツールとアプリケーションをまとめています。',
    path: '/toolbox.html',
  },
  diagrams: {
    title: '構成図ギャラリー',
    description:
      '個人プロジェクトや学習で作ったシステム構成図をまとめています。機器の配置、通信の経路、通信を制御する箇所を図で整理しています。',
    path: '/diagram.html',
  },
  news: {
    title: 'News',
    description:
      '今取り組んでいることと、サイトの更新、作成ツールのリリース、制作や学習の記録を新しい順に載せています。',
    path: '/news.html',
  },
  contact: {
    title: '問い合わせ',
    description:
      'Qiita・GitHub のコメントや DM、または問い合わせフォームからご連絡ください。技術的な相談や案件のお話も歓迎します。',
    path: '/contact.html',
  },
  hobby: {
    title: '趣味の制作',
    description: '仕事とは別に、趣味で作っているものを紹介しています。好きな題材を、業務では使わない技術も試しながら作っています。',
    path: '/hobby.html',
  },
  notFound: {
    title: 'ページが見つかりません',
    description: 'URL が変わったか、ページが削除された可能性があります。下の一覧から目的のページを開いてください。',
    path: '/404.html',
    noindex: true,
  },
};
