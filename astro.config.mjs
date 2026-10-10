// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.termnix-it.jp',
  build: {
    // 既存の URL（portfolio.html など）を保つため、ディレクトリではなく .html ファイルとして出力する
    format: 'file',
  },
  devToolbar: {
    enabled: false,
  },
});
