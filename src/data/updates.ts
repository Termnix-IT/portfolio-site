// 更新履歴（src/data/updates.yaml）を新しい順に取り出す。並べ替えは安定なので、同じ日付の項目は YAML に書いた順を保つ
import { getEntry } from 'astro:content';

export async function getUpdates() {
  const entry = await getEntry('updates', 'main');
  if (!entry) {
    throw new Error('src/data/updates.yaml に main がありません');
  }
  return [...entry.data.items].sort((a, b) => b.date.getTime() - a.date.getTime());
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
