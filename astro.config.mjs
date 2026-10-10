// @ts-check
import { defineConfig } from 'astro/config';

// 問い合わせフォームの送信先（src/components/ContactForm.astro と同じ Lambda Function URL）
const CONTACT_ENDPOINT_ORIGIN = 'https://74lhuwdzmjjv6rfhk6auutx5gq0okeyl.lambda-url.ap-northeast-1.on.aws';

export default defineConfig({
  site: 'https://www.termnix-it.jp',
  build: {
    // 既存の URL（portfolio.html など）を保つため、ディレクトリではなく .html ファイルとして出力する
    format: 'file',
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    // コードの色付け（Shiki）はインライン style を使い CSP と両立しないため、使わない（掲載文にコードブロックはない）
    syntaxHighlight: false,
  },
  security: {
    // 各ページの <head> に Content-Security-Policy の meta を出し、読み込んでよい先をこのサイトと下の外部サービスに絞る。
    // ページ内の <script> と <style> は Astro が build 時にハッシュを計算して許可する。
    // 外部サービスを増やしたら（画像の CDN、解析ツールなど）ここに追加しないとブラウザに遮断される
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        'font-src https://fonts.gstatic.com',
        `connect-src 'self' https://qiita.com ${CONTACT_ENDPOINT_ORIGIN}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: {
        resources: [
          "'self'",
          'https://fonts.googleapis.com',
          // 経歴の順番（--i）など、要素の style 属性で渡している CSS 変数のために、属性の style だけ許可する
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
});
