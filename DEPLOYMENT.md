# BGIN Agent Framework - Deployment Guide

## デプロイ方法

### 方法1: デプロイスクリプトを使用（推奨）

```bash
# プロジェクトルートで実行
./deploy.sh

# サーバー起動
cd backend
npm start
```

### 方法2: 手動ビルド

```bash
# フロントエンドをビルド
cd frontend
npm install
npm run build

# バックエンドをビルド
cd ../backend
npm install
npm run build

# サーバー起動
npm start
```

### 方法3: ワンコマンドデプロイ

```bash
cd backend
npm run start:production
```

## サーバー構成

バックエンドサーバー（ポート4000）が以下を提供します：

- **フロントエンド**: `http://localhost:4000/`
  - 静的ファイル配信: `frontend/dist/`
  - SPA fallback: すべてのルートで `index.html` を返す

- **API**: `http://localhost:4000/api/*`
  - `/api/auth` - 認証
  - `/api/agents/archive` - Archive Agent
  - `/api/agents/codex` - Codex Agent
  - `/api/agents/discourse` - Discourse Agent
  - `/api/synthesis/collaborate` - Multi-agent collaboration
  - `/api/chat/rooms` - チャット履歴

- **Health Check**: `http://localhost:4000/health`

## 開発モード

開発時は、フロントエンドとバックエンドを別々に起動：

### ターミナル1: フロントエンド（ポート3000）
```bash
cd frontend
npm run dev
```

### ターミナル2: バックエンド（ポート4000）
```bash
cd backend
npm run dev
```

### ターミナル3: データベース（PostgreSQL）
```bash
docker-compose up postgres
```

## プロダクションデプロイ

### 必要な環境変数

バックエンドディレクトリに `.env` ファイルを作成：

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/bgin_mvp

# LLM Provider
BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
BLUENEXUS_API_KEY=your_api_key
BLUENEXUS_MODEL=gpt-4o

# JWT & Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
ANONYMIZATION_SALT=your_salt

# Server
PORT=4000
NODE_ENV=production
```

### PostgreSQLの起動

```bash
# Docker Composeでデータベースのみ起動
docker-compose up -d postgres

# マイグレーション実行
cd backend
npm run db:migrate
```

### サーバー起動

```bash
cd backend
npm run start:production
```

## EC2などのサーバーへのデプロイ

### 1. 環境準備

```bash
# Node.js 18+ をインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL & Docker をインストール
sudo apt-get install -y docker.io docker-compose
```

### 2. リポジトリをクローン

```bash
git clone <your-repo-url>
cd BGIN-Agent-Framework
```

### 3. 環境変数を設定

```bash
cp backend/.env.example backend/.env
nano backend/.env  # 環境変数を編集
```

### 4. ビルド & デプロイ

```bash
./deploy.sh
cd backend
npm start
```

### 5. プロセス管理（PM2を使用）

```bash
# PM2をグローバルインストール
sudo npm install -g pm2

# サーバー起動
cd backend
pm2 start dist/server.js --name bgin-backend

# 自動起動設定
pm2 startup
pm2 save

# ログ確認
pm2 logs bgin-backend
```

## トラブルシューティング

### フロントエンドが表示されない

```bash
# frontend/dist が存在するか確認
ls -la frontend/dist

# 再ビルド
cd frontend
npm run build
```

### APIが404を返す

```bash
# バックエンドのログを確認
cd backend
npm run dev
```

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
docker-compose ps

# 起動
docker-compose up -d postgres

# 接続テスト
psql -h localhost -U postgres -d bgin_mvp
```

## パフォーマンス最適化

### Nginxをリバースプロキシとして使用（オプション）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS設定（Let's Encrypt）

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## モニタリング

### ログ確認

```bash
# PM2使用時
pm2 logs bgin-backend

# 直接起動時
cd backend
npm start 2>&1 | tee logs/server.log
```

### ヘルスチェック

```bash
curl http://localhost:4000/health
```

## バックアップ

### データベースバックアップ

```bash
# バックアップ
docker exec bgin-postgres pg_dump -U postgres bgin_mvp > backup.sql

# リストア
docker exec -i bgin-postgres psql -U postgres bgin_mvp < backup.sql
```
