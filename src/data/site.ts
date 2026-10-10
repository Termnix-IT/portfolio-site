// サイト全体で共通の設定値（ナビゲーション、外部リンク、各ページのメタ情報）

// hobby はヘッダーのナビには出さず、フッターからだけリンクする
export type PageKey = 'home' | 'projects' | 'tools' | 'diagrams' | 'contact' | 'hobby';

export const siteName = 'Termnix-ITのページ';

export const links = {
  github: 'https://github.com/Termnix-IT',
  qiita: 'https://qiita.com/Termnix-IT',
};

export const navItems: { key: PageKey; label: string; href: string }[] = [
  { key: 'projects', label: 'Projects', href: '/portfolio.html' },
  { key: 'tools', label: 'Tools', href: '/toolbox.html' },
  { key: 'diagrams', label: 'Diagrams', href: '/diagram.html' },
  { key: 'contact', label: 'Contact', href: '/contact.html' },
];

// <title> と meta description。description は各ページのヒーローの説明文に合わせる
export const pages: Record<PageKey, { title: string; description: string; path: string }> = {
  home: {
    title: 'ホーム',
    description:
      'インフラエンジニア Termnix-IT のキャリアプロフィールです。Linux・ネットワーク・Python を中心に、公開／監視／自動化を実務と個人プロジェクトの両面で積み重ねています。',
    path: '/',
  },
  projects: {
    title: 'ポートフォリオ',
    description:
      'オンプレネットワークの設計や監視基盤の整備など、運用視点を持って手を動かしたプロジェクトをまとめています。構成図と手順を残し、あとから見返せる形で公開しています。',
    path: '/portfolio.html',
  },
  tools: {
    title: '作成ツール一覧',
    description: '日々の運用や個人プロジェクトで使うために自作したツール、スクリプト、アプリケーションをまとめています。',
    path: '/toolbox.html',
  },
  diagrams: {
    title: '構成図ギャラリー',
    description:
      '個人プロジェクトや学習の中で作成したシステム構成図をまとめています。あとから自分でも見返せるよう、構成・経路・制御点を整理しています。',
    path: '/diagram.html',
  },
  contact: {
    title: '問い合わせ',
    description:
      'Qiita・GitHub からのコメントや DM、または問い合わせフォームよりご連絡いただけます。技術的な相談や案件のお話など歓迎しています。',
    path: '/contact.html',
  },
  hobby: {
    title: '趣味の制作',
    description: '仕事とは別に、趣味で作っているものを紹介しています。好きな題材を、普段の業務では使わない技術も試しながら形にしています。',
    path: '/hobby.html',
  },
};
