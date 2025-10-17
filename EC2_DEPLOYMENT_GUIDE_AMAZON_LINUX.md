# EC2デプロイメントガイド - Simple Server (Amazon Linux版)

このガイドでは、BGIN Multi-Agent Interfaceの`simple-server.js`をAWS EC2インスタンス（Amazon Linux 2023）で起動する手順を説明します。

## 前提条件

- AWS EC2インスタンス（推奨: t3.medium以上、Amazon Linux 2023）
- SSH接続用のキーペア
- EC2セキュリティグループでポート4000を開放

## 1. EC2インスタンスの準備

### 1.1 セキュリティグループの設定

EC2のセキュリティグループで以下のポートを開放してください：

```
インバウンドルール:
- ポート 22 (SSH) - あなたのIPアドレスから
- ポート 4000 (HTTP) - 0.0.0.0/0 または特定のIPアドレスから
```

### 1.2 EC2インスタンスへの接続

```bash
# SSH接続（ec2-userがデフォルトユーザー）
ssh -i /path/to/your-key.pem ec2-user@your-ec2-public-ip
```

## 2. システムの準備

### 2.1 システムパッケージの更新

```bash
# Amazon Linux 2023の場合
sudo dnf update -y

# または Amazon Linux 2の場合
# sudo yum update -y
```

### 2.2 Node.jsのインストール

```bash
# Node.js 18.x をインストール（Amazon Linux 2023推奨方法）
# nvm (Node Version Manager) を使用
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# nvmを有効化
source ~/.bashrc

# Node.js 18をインストール
nvm install 18
nvm use 18
nvm alias default 18

# バージョン確認
node --version  # v18.x.x以上であることを確認
npm --version   # v9.x.x以上であることを確認
```

### 2.3 Gitのインストール（通常は既にインストール済み）

```bash
# Gitがない場合のみインストール
sudo dnf install -y git

# バージョン確認
git --version
```

## 3. アプリケーションのデプロイ

### 3.1 リポジトリのクローン

```bash
# ホームディレクトリに移動
cd ~

# リポジトリをクローン
git clone https://github.com/mitchuski/bgin-agents.git
cd bgin-agents
```

### 3.2 依存関係のインストール

```bash
# ルートディレクトリで依存関係をインストール
npm install

# フロントエンドをビルド
npm run build --workspace=frontend
```

### 3.3 環境変数の設定

```bash
# .envファイルを作成
cp .env.example .env
nano .env
# または vi .env
```

`.env`ファイルに以下の設定を記述してください：

```bash
# 基本設定
NODE_ENV=production
PORT=4000
FRONTEND_URL=http://your-ec2-public-ip:4000

# AI統合（少なくとも1つを設定）
# BlueNexus（推奨）
BLUENEXUS_API_KEY=your-bluenexus-api-key
BLUENEXUS_ENDPOINT=https://api.staging.bluenexus.ai/api
BLUENEXUS_MODEL=claude-3.5-sonnet-20241022

# またはOpenAI
# OPENAI_API_KEY=your-openai-api-key

# またはPhala Cloud
# PHALA_API_KEY=your-phala-api-key
# PHALA_ENDPOINT=your-phala-endpoint

# またはKwaai
# KWAAI_API_KEY=your-kwaai-api-key

# Discourse統合（オプション）
DISCOURSE_URL=https://forum.bgin.org
DISCOURSE_API_KEY=your-discourse-api-key
DISCOURSE_USERNAME=bgin-ai-bot

# セキュリティ
CORS_ORIGIN=*
# 本番環境では特定のドメインに制限することを推奨
# CORS_ORIGIN=https://yourdomain.com
```

保存して終了（Ctrl+X、Y、Enter または vi の場合は :wq）

## 4. サーバーの起動

### 4.1 テスト起動

```bash
# フォアグラウンドで起動してテスト
node simple-server.js
```

以下のようなメッセージが表示されればOKです：

```
🚀 BGIN Multi-Agent Interface
Server running on port 4000
Frontend: http://localhost:4000
Health: http://localhost:4000/health
API: http://localhost:4000/api/agents
```

ブラウザで `http://your-ec2-public-ip:4000` にアクセスして動作確認してください。

テストが成功したら、Ctrl+Cで一旦停止します。

### 4.2 PM2を使用した本番起動

PM2を使用してバックグラウンドで起動し、自動再起動を設定します。

```bash
# PM2をグローバルインストール
npm install -g pm2

# アプリケーションを起動
pm2 start simple-server.js --name "bgin-server"

# 起動スクリプトを保存（再起動時に自動起動）
pm2 save

# システム起動時にPM2を自動起動
pm2 startup
# 表示されたコマンドをコピーして実行してください
# 通常は以下のようなコマンドが表示されます：
# sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v18.x.x/bin /home/ec2-user/.nvm/versions/node/v18.x.x/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
```

### 4.3 PM2の基本コマンド

```bash
# ステータス確認
pm2 status

# ログ確認
pm2 logs bgin-server

# リアルタイムログ監視
pm2 logs bgin-server --lines 100

# 再起動
pm2 restart bgin-server

# 停止
pm2 stop bgin-server

# アプリケーション削除
pm2 delete bgin-server

# モニタリング
pm2 monit
```

## 5. 動作確認

### 5.1 ヘルスチェック

```bash
# ローカルから
curl http://localhost:4000/health

# 外部から
curl http://your-ec2-public-ip:4000/health
```

期待される応答：
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "uptime": 123.45,
  "services": {
    "llm": "connected",
    "frontend": "available"
  }
}
```

### 5.2 LLMステータス確認

```bash
curl http://your-ec2-public-ip:4000/api/status
```

### 5.3 チャット機能テスト

```bash
curl -X POST http://your-ec2-public-ip:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "こんにちは",
    "agent": "archive",
    "session": "bgin-agent-hack"
  }'
```

## 6. セキュリティ設定

### 6.1 ファイアウォール設定（firewalld）

Amazon Linux 2023ではfirewalldが標準です：

```bash
# firewalldの状態確認
sudo systemctl status firewalld

# まだ起動していない場合は起動
sudo systemctl start firewalld
sudo systemctl enable firewalld

# ポート4000を開放
sudo firewall-cmd --permanent --add-port=4000/tcp
sudo firewall-cmd --reload

# 設定確認
sudo firewall-cmd --list-all
```

Amazon Linux 2の場合（iptables）：

```bash
# ポート4000を開放
sudo iptables -A INPUT -p tcp --dport 4000 -j ACCEPT
sudo service iptables save
```

### 6.2 環境変数の保護

```bash
# .envファイルのパーミッション設定
chmod 600 .env

# .gitignoreに.envが含まれていることを確認
cat .gitignore | grep .env
```

## 7. ログとモニタリング

### 7.1 PM2ログ

```bash
# リアルタイムログ
pm2 logs bgin-server

# エラーログのみ
pm2 logs bgin-server --err

# 過去100行のログ
pm2 logs bgin-server --lines 100
```

### 7.2 システムログ

```bash
# システムログの確認
sudo journalctl -u pm2-ec2-user -f
```

## 8. アップデートとメンテナンス

### 8.1 コードの更新

```bash
# リポジトリの更新
cd ~/bgin-agents
git pull origin main

# 依存関係の更新
npm install

# フロントエンドの再ビルド
npm run build --workspace=frontend

# サーバーの再起動
pm2 restart bgin-server
```

### 8.2 バックアップ

```bash
# .envファイルのバックアップ
cp .env .env.backup

# チャットストレージのバックアップ（存在する場合）
tar -czf chat-storage-backup-$(date +%Y%m%d).tar.gz chat-storage/
```

## 9. トラブルシューティング

### 9.1 サーバーが起動しない

```bash
# ログを確認
pm2 logs bgin-server --err

# ポートが使用されているか確認
sudo netstat -tlnp | grep 4000
# またはssコマンド
sudo ss -tlnp | grep 4000

# プロセスを強制終了
sudo kill -9 $(sudo lsof -t -i:4000)

# 再起動
pm2 restart bgin-server
```

### 9.2 LLM接続エラー

```bash
# 環境変数を確認
cat .env | grep API_KEY

# LLMステータスをテスト
curl http://localhost:4000/api/test-llm
```

### 9.3 フロントエンドが表示されない

```bash
# フロントエンドのビルドを確認
ls -la frontend/dist/

# 再ビルド
npm run build --workspace=frontend

# サーバー再起動
pm2 restart bgin-server
```

### 9.4 メモリ不足

```bash
# メモリ使用量確認
free -h

# PM2メモリモニタリング
pm2 monit

# メモリ制限を設定して再起動
pm2 delete bgin-server
pm2 start simple-server.js --name "bgin-server" --max-memory-restart 1G
```

### 9.5 Node.jsが見つからない

```bash
# nvmが読み込まれているか確認
command -v nvm

# nvmが見つからない場合
source ~/.bashrc

# それでもダメな場合、nvmを再インストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

## 10. 本番環境の推奨設定

### 10.1 リバースプロキシ（Nginx）の設定

より本格的な本番環境では、Nginxをリバースプロキシとして使用することを推奨します：

```bash
# Nginxインストール
sudo dnf install -y nginx

# Nginxを起動
sudo systemctl start nginx
sudo systemctl enable nginx

# 設定ファイル作成
sudo nano /etc/nginx/conf.d/bgin.conf
```

設定内容：
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 設定をテスト
sudo nginx -t

# Nginxを再起動
sudo systemctl restart nginx

# firewalldでHTTP/HTTPSを許可
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 10.2 SSL/TLS証明書（Let's Encrypt）

```bash
# EPELリポジトリを有効化
sudo dnf install -y epel-release

# Certbotインストール
sudo dnf install -y certbot python3-certbot-nginx

# SSL証明書取得
sudo certbot --nginx -d your-domain.com

# 自動更新テスト
sudo certbot renew --dry-run
```

## 11. パフォーマンスチューニング

### 11.1 Node.jsメモリ設定

```bash
# PM2起動時にメモリを増やす
pm2 delete bgin-server
pm2 start simple-server.js --name "bgin-server" \
  --node-args="--max-old-space-size=2048"
```

### 11.2 クラスターモード

複数CPUコアを活用する場合：

```bash
pm2 start simple-server.js --name "bgin-server" -i max
```

### 11.3 システムリソースの最適化

```bash
# スワップメモリの追加（メモリが少ない場合）
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永続化
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

## 12. Amazon Linux特有の注意点

### 12.1 nvmとPM2の統合

PM2 startupコマンドを実行する際、nvmのパスを正しく設定する必要があります：

```bash
# PM2 startup実行後に表示されるコマンドをそのまま実行
pm2 startup
# 表示されたコマンドをコピペして実行

# 例：
# sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v18.19.0/bin ...
```

### 12.2 SELinuxの設定（有効な場合）

```bash
# SELinuxのステータス確認
getenforce

# Enforcingの場合、ポート許可が必要
sudo semanage port -a -t http_port_t -p tcp 4000

# SELinuxを一時的に無効化する場合（非推奨）
# sudo setenforce 0
```

## まとめ

これでAmazon Linux EC2インスタンスでBGIN Multi-Agent Interfaceが起動しました！

**アクセスURL:**
- Web UI: `http://your-ec2-public-ip:4000`
- API: `http://your-ec2-public-ip:4000/api`
- ヘルスチェック: `http://your-ec2-public-ip:4000/health`

**重要なコマンド:**
```bash
pm2 status              # ステータス確認
pm2 logs bgin-server    # ログ確認
pm2 restart bgin-server # 再起動
pm2 monit               # モニタリング
```

**Amazon Linux特有のコマンド:**
```bash
sudo dnf update -y      # システム更新
sudo systemctl status firewalld  # ファイアウォール確認
source ~/.bashrc        # nvmの再読み込み
```

何か問題が発生した場合は、まず`pm2 logs bgin-server`でログを確認してください。
