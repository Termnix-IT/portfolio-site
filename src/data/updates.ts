// News の記録（src/data/updates.yaml）と Now（src/data/now.yaml）を取り出す
import { getEntry } from 'astro:content';

export type NewsType = 'site' | 'release' | 'activity' | 'learning';

export const newsTypeLabels: Record<NewsType, string> = {
  release: 'リリース',
  activity: '活動',
  learning: '学習',
  site: 'サイト',
};

export const nowStatusLabels = {
  making: '制作中',
  working: '取り組み中',
  learning: '学習中',
} as const;

// 新しい順に並べる。並べ替えは安定なので、同じ日付の項目は YAML に書いた順を保つ
export async function getUpdates() {
  const entry = await getEntry('updates', 'main');
  if (!entry) {
    throw new Error('src/data/updates.yaml に main がありません');
  }
  return [...entry.data.items].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getNow() {
  const entry = await getEntry('now', 'main');
  if (!entry) {
    throw new Error('src/data/now.yaml に main がありません');
  }
  return entry.data;
}

// 外部サイトへのリンクかどうか（新しいタブで開くかの判断に使う）
export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

// 表示用の日付（2026.10.11）。日本時間の日付として扱う
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('/', '.');
}

// <time datetime> 用の日付（2026-10-11）
export function isoDate(date: Date) {
  return formatDate(date).replaceAll('.', '-');
}

// 月ごとの見出し（2026年10月）
export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'long' }).format(date);
}
