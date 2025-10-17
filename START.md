# BGIN Agent Framework - クイックスタートガイド

## EC2デプロイ後の起動手順

### 0. Docker Composeのインストール（初回のみ）

**⚠️ Docker Composeがインストールされていない場合:**

```bash
# インストールスクリプトを実行
./install-docker-compose.sh

# または手動でインストール
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# バージョン確認
docker-compose --version
```

**Docker Composeなしで起動する方法（推奨）:**

Docker Composeをインストールせずに、Dockerコマンドで直接起動できます：

```bash
# Dockerサービスを起動
sudo service docker start

# PostgreSQLコンテナを起動（pgvector拡張機能付き）
docker run -d \
  --name bgin-postgres \
  -e POSTGRES_DB=bgin_mvp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -v bgin_postgres_data:/var/lib/postgresql/data \
  ankane/pgvector:v0.5.1

# 起動確認
docker ps
docker logs bgin-postgres
```

### 1. データベースを起動

**方法A: Docker Compose使用（インストール済みの場合）**

```bash
# PostgreSQLのみを起動（pgvector拡張機能付き）
docker-compose up -d postgres

# 起動確認
docker-compose ps
docker-compose logs postgres

# データベース接続テスト
docker-compose exec postgres psql -U postgres -d bgin_mvp
```

**方法B: Dockerコマンド直接使用（推奨）**

```bash
# 上記「0. Docker Composeのインストール」セクションを参照
# すでに起動している場合は、このステップをスキップ
```

**PostgreSQL情報:**
- ポート: `5432`
- データベース名: `bgin_mvp`
- ユーザー: `postgres`
- パスワード: デフォルトは `password`（環境変数 `DB_PASSWORD` で変更可能）
- 拡張機能: `pgvector` (ベクトル検索用)

### 2. マイグレーション実行（初回のみ）

**方法A: Docker Compose使用**

```bash
# チャットルームテーブルを作成
docker-compose exec postgres psql -U postgres -d bgin_mvp -f /docker-entrypoint-initdb.d/migrations/002_add_chat_rooms.sql
```

**方法B: Dockerコマンド直接使用（推奨）**

```bash
# マイグレーションファイルをコンテナにコピー
docker cp database/migrations/002_add_chat_rooms.sql bgin-postgres:/tmp/

# マイグレーションを実行
docker exec bgin-postgres psql -U postgres -d bgin_mvp -f /tmp/002_add_chat_rooms.sql

# テーブルが作成されたか確認
docker exec bgin-postgres psql -U postgres -d bgin_mvp -c "\dt"
```

### 3. バックエンドサーバーを起動

```bash
cd backend
npm start
```

サーバーが起動すると以下のログが表示されます：
```
🚀 BGIN MVP server running on port 4000
Environment: production
Multi-agent mode: enabled
Enhanced RAG system: enabled
Real-time monitoring: enabled
```

### 4. アクセス確認

ブラウザで以下にアクセス：

- **フロントエンド**: http://your-ec2-public-ip:4000
- **API**: http://your-ec2-public-ip:4000/api
- **Health Check**: http://your-ec2-public-ip:4000/health

## ワンコマンドスタートアップ

```bash
# 1. データベース起動
docker-compose up -d postgres

# 2. サーバー起動
cd backend && npm start
```

## 環境変数の設定

`backend/.env` ファイルを作成：

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/bgin_mvp

# LLM Provider (BlueNexus)
BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
BLUENEXUS_API_KEY=your_api_key_here
BLUENEXUS_MODEL=gpt-4o

# JWT & Security
JWT_SECRET=your_secure_jwt_secret_here
ENCRYPTION_KEY=your_32_character_encryption_key
ANONYMIZATION_SALT=your_random_salt_here

# Server
PORT=4000
NODE_ENV=production
```

## トラブルシューティング

### データベースに接続できない

```bash
# PostgreSQLが起動しているか確認
docker-compose ps postgres

# ログを確認
docker-compose logs postgres

# 再起動
docker-compose restart postgres
```

### ポート4000が使用中

```bash
# ポートを使用しているプロセスを確認
lsof -i :4000

# プロセスを停止
kill -9 <PID>
```

### チャット履歴が保存されない

```bash
# マイグレーションが実行されているか確認
docker-compose exec postgres psql -U postgres -d bgin_mvp -c "\dt"

# chat_rooms と chat_messages テーブルが存在するはず
```

## 停止とクリーンアップ

```bash
# サーバーを停止（Ctrl+C）

# データベースを停止
docker-compose down

# データベースのデータも削除する場合（注意！）
docker-compose down -v
```

## 追加のサービス（オプション）

### Redisキャッシュを起動

```bash
docker-compose up -d postgres redis
```

### Qdrantベクトルデータベースを起動（RAG用）

```bash
docker-compose up -d postgres redis qdrant
```

### すべてのサービスを起動

```bash
docker-compose up -d
```

## PM2でプロセス管理（推奨）

```bash
# PM2をインストール
npm install -g pm2

# サーバーを起動
cd backend
pm2 start dist/server.js --name bgin-backend

# 自動起動設定
pm2 startup
pm2 save

# ログ確認
pm2 logs bgin-backend

# 再起動
pm2 restart bgin-backend

# 停止
pm2 stop bgin-backend
```

## 開発モード

開発時は、フロントエンドとバックエンドを別々に起動：

```bash
# ターミナル1: データベース
docker-compose up postgres

# ターミナル2: バックエンド（ホットリロード）
cd backend
npm run dev

# ターミナル3: フロントエンド（ホットリロード）
cd frontend
npm run dev
```

開発モードでは：
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:4000
