# CourseTracker

CourseTracker は、技術学習に使う公式 Docs、公式 GitHub、動画、書籍、記事を一元管理するための学習ダッシュボードです。  
公開用ポートフォリオとして安全に見せられる題材を前提に、教材管理、学習ロードマップ、学習ログの拡張を見据えて実装しています。

## 概要

- 学習教材を一つの画面群で整理するための Web アプリです。
- 現在は、認証基盤、共通レイアウト、主要画面へのナビゲーションまでを実装しています。
- 将来的に教材一覧、タグ、メモ、学習ログを追加しやすい土台を整えることを目的にしています。

## 現在できること

- GitHub OAuth を使ったログイン
- ログイン済みユーザー向けの保護ページ
- ダッシュボード、教材一覧、ロードマップ、設定への共通ナビゲーション
- モバイル幅を考慮した主要導線の表示

## 技術スタック

- フレームワーク: Next.js
- 言語: TypeScript
- UI: Tailwind CSS
- 認証: Auth.js
- ORM: Prisma
- データベース: PostgreSQL
- ローカル DB: Docker Compose
- パッケージマネージャー: pnpm

## スクリーンショット

スクリーンショットは今後差し替え予定です。配置先のプレースホルダーとして [docs/screenshots/README.md](docs/screenshots/README.md) を用意しています。

- トップページ: 準備中
- ダッシュボード: 準備中
- 教材一覧: 準備中

## ローカルセットアップ

### 前提

- Node.js 20 以上
- pnpm 10 系
- Docker / Docker Compose
- GitHub OAuth App

### 1. 依存関係をインストール

```bash
pnpm install
```

### 2. 環境変数を設定

`.env.example` を元に `.env` を作成し、必要な値を設定します。

```bash
cp .env.example .env
```

設定が必要な主な環境変数:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_PORT`

GitHub OAuth App の callback URL は次を想定しています。

```txt
http://localhost:3000/api/auth/callback/github
```

### 3. PostgreSQL を起動

```bash
pnpm db:up
pnpm db:check
```

### 4. Prisma を反映

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### 5. 開発サーバーを起動

```bash
pnpm dev
```

起動後は `http://localhost:3000` を開いて動作を確認します。

## 開発コマンド

```bash
pnpm dev
pnpm lint
pnpm build
pnpm db:up
pnpm db:down
pnpm prisma:generate
pnpm prisma:migrate
```

## ディレクトリの要点

- `src/app`: App Router の画面とレイアウト
- `src/app/(app)`: ログイン済みユーザー向けの共通レイアウト配下
- `src/auth.ts`: Auth.js 設定
- `prisma/schema.prisma`: Prisma スキーマ
- `docker-compose.yml`: ローカル PostgreSQL の起動設定

## 今後追加予定の機能

- 教材一覧への実データ表示
- タグ機能
- 学習メモ機能
- 学習ログ機能
- ロードマップの詳細設計
- 設定画面の具体化

## 補足

- 本リポジトリは公開用ポートフォリオを前提にしているため、個人情報や実際の転職活動データは扱いません。
- 本番デプロイ、詳細設計図、完成版スクリーンショットは今後追加予定です。
