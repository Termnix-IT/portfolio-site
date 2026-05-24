# Security Best Practices Report

## Executive Summary

問い合わせフォーム追加に伴い、Web 側リポジトリのみを対象にセキュリティレビューを実施した。AWS Lambda / SES / CloudFront / WAF などの実装・IaC は専用リポジトリで管理されている前提のため、本レポートでは検証対象外とする。

Web 側の実装では、ユーザー入力を直接 `innerHTML` に流す箇所、`eval()`、`postMessage`、危険なリダイレクト、Web Storage への secret 保存は確認されなかった。フォーム送信処理も `textContent` によるステータス表示を使っており、DOM XSS の強い兆候はない。

主な改善点は、ブラウザで実行されるコードと外部リソースの制御である。優先度は、CSP / security headers の明文化、第三者 CDN の SRI または self-hosting、`innerHTML` の整理の順で高い。

## Scope

対象:

- `contact.html`
- `static/main.js`
- 他 HTML entrypoint の外部リソース読み込み
- `.github/workflows/deploy.yml` に見える Web 配布処理
- `README.md` / `MAINTENANCE.md` の Web 側運用記述

対象外:

- AWS Lambda Function URL の実装
- SES 送信処理
- CloudFront / WAF / Response Headers Policy の IaC
- AWS 側の rate limiting、CORS、ログ設計、監視設定

## Findings

### F-001: CSP and browser security headers are not represented in this Web repo

- Rule ID: JS-CSP-001
- Severity: Medium
- Location:
  - `contact.html:1-15`
  - `.github/workflows/deploy.yml:65-68`
- Evidence:
  - No `Content-Security-Policy` appears in the HTML files or visible deployment workflow.
  - The workflow syncs static files to S3 and invalidates CloudFront cache, but response headers are not configured in this repository.
- Impact: If XSS is introduced later, or a third-party script is compromised, the browser has no visible policy restricting script execution or outbound connections. On the contact page, this can expose name, email, and message content before submission.
- Fix:
  - Manage the actual headers in the AWS IaC repo, but keep the expected Web policy documented here or cross-linked from here.
  - Recommended baseline:

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' https://qiita.com https://74lhuwdzmjjv6rfhk6auutx5gq0okeyl.lambda-url.ap-northeast-1.on.aws/
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
```

  - If this site should not be embedded, add `frame-ancestors 'none'` in the HTTP-delivered CSP from CloudFront.
- Mitigation: If CloudFront headers are already managed in the AWS IaC repo, add a note in this Web repo pointing to that source of truth so future Web changes do not accidentally require broader CSP permissions without review.
- False positive notes: This may already be implemented in the dedicated AWS IaC repository. The Web-side action is to document and preserve the required allowlist.

### F-002: Third-party CDN assets are loaded without Subresource Integrity

- Rule ID: JS-SRI-001
- Severity: Medium
- Location:
  - `contact.html:7-8`
  - `contact.html:203`
  - Same pattern appears in `index.html`, `portfolio.html`, `toolbox.html`, and `diagram.html`.
- Evidence:
  - Bootstrap CSS is loaded from `https://cdn.jsdelivr.net/...` without `integrity`.
  - Font Awesome CSS is loaded from `https://cdnjs.cloudflare.com/...` without `integrity`.
  - Bootstrap JavaScript is loaded from `https://cdn.jsdelivr.net/...` without `integrity`.
- Impact: Third-party JavaScript runs with the same browser privileges as first-party code. If a CDN asset or delivery path is compromised, injected code can read contact form fields and exfiltrate them.
- Fix:
  - Best Web-side option: self-host Bootstrap and Font Awesome under `static/vendor/`, then allow only `'self'` for scripts in CSP.
  - Alternative: keep CDN usage, but pin exact versions and add `integrity` plus `crossorigin="anonymous"` for CDN scripts/styles.
  - Update the AWS IaC CSP allowlist to match whichever option is chosen.
- Mitigation: CSP helps, but SRI or self-hosting is still recommended for pages that handle personal data.
- False positive notes: Google Fonts are harder to pin with SRI in normal usage; prioritize Bootstrap JS and library CSS first.

### F-003: Remaining `innerHTML` usage is constant today, but should be removed for stricter DOM-sink hygiene

- Rule ID: JS-XSS-001
- Severity: Low
- Location:
  - `static/main.js:83`
  - `static/main.js:202-204`
  - `static/main.js:261`
  - `static/main.js:283`
- Evidence:
  - `closeButton.innerHTML = '&times;'`
  - `submitButton.innerHTML = isSubmitting ? '<i ...> 送信中' : '<i ...> 送信する'`
  - `list.innerHTML = ''`
- Impact: Current values are constants or clearing operations, so this is not an exploitable DOM XSS issue by itself. However, `innerHTML` patterns make future changes easier to accidentally turn into injection sinks.
- Fix:
  - Use `textContent` for text-only updates.
  - Build icon elements with `document.createElement('i')` where markup is needed.
  - Use `replaceChildren()` for clearing lists.
- Mitigation: Add a Web coding rule in `MAINTENANCE.md`: avoid `innerHTML` unless the value is a reviewed constant.
- False positive notes: No user-controlled input currently reaches these sinks.

### F-004: Public endpoint is hard-coded in markup; acceptable, but document the boundary

- Rule ID: CONTACT-WEB-001
- Severity: Low
- Location:
  - `contact.html:144`
  - `static/main.js:127-175`
- Evidence:
  - The Lambda Function URL is exposed in `data-endpoint`.
  - The browser sends JSON with `fetch(endpoint, ...)`.
- Impact: Exposing a public endpoint in frontend code is expected for a static site and is not a secret leak. The risk is operational confusion: future maintainers may mistake browser-side validation, honeypot, or CORS as security controls.
- Fix:
  - Keep `data-endpoint` if this is the intended static-site design.
  - In `MAINTENANCE.md`, explicitly state that the endpoint is public by design and that enforcement lives in the AWS IaC / Lambda repo.
  - Consider naming the AWS IaC repo or adding a non-sensitive link if it is accessible to maintainers.
- Mitigation: None needed in browser code beyond avoiding secrets in HTML/JS.
- False positive notes: This is documentation hardening, not a code vulnerability.

## Positive Observations

- `contact.html:150-171` has useful browser-side UX constraints: `required`, `type="email"`, `maxlength`, and `minlength`.
- `static/main.js:144-175` trims submitted values and sends JSON explicitly with `Content-Type: application/json`.
- `static/main.js:214-286` renders Qiita article titles with `textContent`, not HTML parsing.
- No `eval()`, `new Function`, `document.write`, `postMessage`, `localStorage` secret storage, or attacker-controlled navigation sink was found.
- External links reviewed on the contact page use `target="_blank"` with `rel="noopener noreferrer"`.
- The `_gotcha` honeypot is present as a low-cost bot signal, while `MAINTENANCE.md` already says server-side validation and spam controls are required.

## Recommended Web-Side Next Steps

1. Decide CDN strategy: self-host Bootstrap / Font Awesome, or add SRI to pinned CDN URLs.
2. Add a Web-side CSP allowlist document and keep AWS IaC response headers aligned with it.
3. Remove low-value `innerHTML` usage from `static/main.js`.
4. Add a short note in `MAINTENANCE.md` that the Lambda URL is public by design and AWS-side enforcement is managed in the dedicated IaC repo.
