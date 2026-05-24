# Maintenance Guide

このドキュメントは、このポートフォリオサイトを継続的に育てるときの保守メモです。
公開向けの説明は `../README.md`、デプロイ方法は `DEPLOYMENT.md`、このファイルは編集運用の基準として使います。

## 対象範囲

- HTML: `index.html`, `portfolio.html`, `toolbox.html`, `diagram.html`, `contact.html`
- CSS: `static/style.css`
- JavaScript: `static/main.js`
- 画像: `static/img/`

## 1. 可読性を崩さないための基本ルール

### ファイルごとの役割を分ける

- `*.html`
  - ページ固有の構造と文言だけを書く
  - レイアウト調整を `style=""` に増やしすぎない
- `static/style.css`
  - 見た目の共通ルールを書く
  - 同じ見た目を 2 回以上使うならクラス化する
- `static/main.js`
  - ページ横断で必要な動きだけを書く
  - 特定ページ専用の処理を増やすときは、対象要素が存在する場合だけ動くようにする

### HTML の書き方

- セクション単位でコメントを残す
  - 例: `<!-- プロジェクト1 -->`
- 同じ構造の繰り返しは、クラス名と並び順をそろえる
- 見た目調整のための `style=""` は増やさず、短い補助クラスを追加して管理する
- 見出し階層を飛ばしすぎない
  - ページタイトルは `h1`
  - セクション見出しは `h2`
  - カードや小見出しは `h3` または `h4`
- 装飾用の要素名より、役割が分かるクラス名を使う
  - 良い例: `project-spotlight`, `section-heading`, `publishing-card`
  - 避けたい例: `box1`, `item2`, `blue-text`

### CSS の書き方

- 近い用途のスタイルをまとまりで置く
  - 既存の `/* --- セクション名 --- */` コメントに合わせる
- 色、余白、影は既存の CSS variable を優先して使う
  - 例: `var(--border-color)`, `var(--text-secondary)`
- 同じ余白調整を複数箇所で使う場合は、ローカル変数か共通クラスに寄せる
  - 今回の `--content-divider-space` のように意味のある名前を付ける
- 1 回しか使わない値を増やしすぎない
- `!important` は既存互換のために必要な箇所だけに限定する

### JavaScript の書き方

- 冒頭に定数をまとめ、意味のある名前を付ける
- `DOMContentLoaded` 内に初期化処理をまとめる
- DOM 更新は小さな helper 関数に切り出す
- 要素取得後は `if (!element) return;` のように存在確認を入れる
- 取得失敗時の文言はユーザーに分かる内容にする
- UI 操作とデータ取得を混ぜすぎない

## 2. 編集前に確認すること

1. どのページを更新するか決める
2. 変更が HTML だけで済むか、CSS の共通化が必要かを先に判断する
3. 同じ見た目や同じ構造が他ページにないかを確認する
4. 追加ではなく既存クラスの再利用で済まないかを見る

## 3. よくある追加作業の手順

### トップページに新しいコンテンツセクションを追加する

1. `index.html` の `<section class="section-block home-editorial-main">` 内で配置位置を決める
2. 既存の `home-section` 構造に合わせて追加する
3. 見出しは以下の並びを基本にする

```html
<section class="home-section fade-up">
    <div class="section-heading section-heading-split">
        <div>
            <p class="section-kicker">Category</p>
            <h2 class="section-title no-line">見出し</h2>
        </div>
        <p class="section-note">補足文</p>
    </div>
</section>
```

4. 線や余白が必要な場合は、まず既存のパターンを流用する
  - `border-top: 1px solid var(--border-color);`
  - `--content-divider-space`
5. 似たセクションがあるなら、その CSS を流用し、差分だけ追加する

### ポートフォリオ実績を 1 件追加する

1. `portfolio.html` の既存 `project-card` を 1 ブロック複製する
2. `id="project-x"` を重複しない値に変える
3. 以下を更新する
  - プロジェクト名
  - 説明文
  - 技術タグ
  - Qiita / GitHub 状態
  - 構成図やスクリーンショット
4. 画像を使う場合は `static/img/` に追加する
5. 画像の `alt` は内容が分かる日本語で書く

### 新しい画像を追加する

1. `static/img/` に配置する
2. ファイル名は内容が分かる英語ベースにする
  - 例: `home-server-diagram.png`
3. HTML では相対パスで参照する

```html
<img src="static/img/home-server-diagram.png" alt="自宅サーバ公開プロジェクト構成図">
```

4. 幅や余白の調整が必要なら、インライン style ではなくクラスを追加する
5. プレースホルダーや補足文も同様にクラス化して、HTML に装飾ロジックを残さない

### 共通スタイルを追加する

1. `static/style.css` の近いセクションを探す
2. 既存命名に合わせてクラス名を付ける
3. 単発の見た目ではなく、再利用される粒度で作る
4. レスポンシブ対応が必要なら、同じファイル末尾の `@media` ブロックも更新する
5. 既存セレクタの重複定義がないか確認してから追加する

### JavaScript の処理を追加する

1. `static/main.js` で既存処理と責務が近い場所に追加する
2. 対象要素がないページでエラーにならないようにする
3. 非同期処理を入れる場合は、失敗時の表示も用意する
4. 表示崩れが起きるなら、JS ではなく CSS で解決できないか先に検討する
5. DOM 描画処理は `renderXxx` のような関数に寄せて、取得処理と分離する

## 4. 追加時に増やしすぎない方がよいもの

- インライン style
- 似た意味の CSS クラス
- 同じセレクタへの重複定義
- ページ固有なのに共通化されていない JavaScript
- 同じ役割なのに名前が違う見出しブロック
- 調整用だけの空 div

## 5. 推奨する更新順

### 文言だけ変える場合

1. 対象 HTML を修正する
2. 見出し階層と日本語の表記ゆれを確認する
3. リンク先と `alt` を確認する

### 見た目も変える場合

1. HTML の構造を整える
2. CSS を既存クラスの再利用優先で追加する
3. PC 幅とモバイル幅の両方で確認する
4. 余白と横線の見え方を他セクションと比較する

### 新ページを増やす場合

1. 既存ページをベースに新しい `*.html` を作る
2. ナビゲーションにリンクを追加する
3. 必要ならパンくずも追加する
4. そのページ専用の見た目を最小限だけ `style.css` に追加する
5. 全ページ共通のヘッダー / フッターとの差分が大きくならないようにする

## 6. 変更後の確認チェックリスト

- HTML の閉じタグが崩れていない
- リンク切れがない
- 画像パスが正しい
- `style.css` に似たルールを重複追加していない
- モバイル幅で横スクロールが出ていない
- 横線の上下余白が周囲と揃っている
- ページごとの文体が揃っている

## 7. このリポジトリで今後やるとよい整理

- `style.css` が大きくなってきたら、用途別に分割を検討する
  - 例: `layout.css`, `components.css`, `pages/home.css`
- ポートフォリオ案件が増えたら、カード構造の命名規則を固定する
- JavaScript の機能が増えたら、`main.js` を処理単位で分割する
- 画像が増えたら、用途別ディレクトリに分ける
  - 例: `static/img/projects/`, `static/img/common/`

## 8. 運用メモ

- デザイン調整は、単発修正ではなく「今後も使うか」で判断する
- 迷ったら HTML を簡潔に保ち、CSS 側で表現する
- 追加のたびに少しずつ共通化すると、後で全面改修しやすい

## 9. 問い合わせフォーム運用方針

### 現在の方針

- `contact.html` は静的 HTML のまま運用する
- フォーム送信処理は `static/main.js` から AWS Lambda Function URL へ JSON POST する
- サイト側にはメール送信処理、問い合わせ内容の保存処理を持たせない
- フォームには honeypot 用の `_gotcha` フィールドを置き、最低限の bot 対策を行う
- Lambda 側では `Content-Type: application/json` のリクエストを受け取る

### 送信フォームで扱う情報

- お名前
- 返信先メールアドレス
- 用件
- メッセージ本文

機密情報、パスワード、秘密鍵、業務固有情報は送信対象にしない。フォーム文言にもその注意を残す。

### 現在の AWS 実装案

問い合わせフォームは以下の構成を基本にする。

- Frontend: `contact.html` から `fetch()` で JSON 送信
- Endpoint: AWS Lambda Function URL
- Mail: Amazon SES
- Notification: 問い合わせ内容を管理者メールへ送信
- Storage: 原則なし。必要になった場合のみ S3 または DynamoDB を検討する

送信 payload は以下の形式にする。

```json
{
  "name": "Your Name",
  "email": "user@example.com",
  "topic": "technical-question",
  "message": "お問い合わせ本文",
  "_gotcha": ""
}
```

### AWS 実装時に必ず設計すること

- CORS は公開ドメインだけを許可する
- `OPTIONS` と `POST` に対して必要な CORS header を返す
- 入力値は Lambda 側で必ず検証する
- 送信頻度制限を入れる
- honeypot または Turnstile / reCAPTCHA などの spam 対策を入れる
- SES の送信元ドメイン認証、SPF、DKIM、DMARC を設定する
- Lambda のログには必要以上の個人情報を残さない
- 送信失敗時のユーザー表示と管理者向け検知方法を決める

### AWS 化の判断基準

以下のどれかが必要になった時点で AWS 実装を検討する。

- 外部フォームサービスの制限や費用が運用に合わなくなった
- AWS 学習成果として問い合わせフォーム基盤をポートフォリオ化したい
- 送信ログ、通知先、エラー処理を細かく制御したい
- 独自ドメインのメール送信基盤を整備したい
