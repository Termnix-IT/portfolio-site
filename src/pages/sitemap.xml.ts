// 検索エンジン向けの sitemap.xml。src/data/site.ts のページ一覧から、noindex 以外のページを並べる
import type { APIRoute } from 'astro';
import { pages } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const urls = Object.values(pages)
    .filter((page) => !page.noindex)
    .map((page) => `  <url><loc>${new URL(page.path, site).href}</loc></url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
