# BOLDDEE RENTALS — PRODUCTION DEPLOYMENT GUIDE
**System Architecture:** Express.js REST API + SQLite (WAL Mode) + React Vite SPA  
**Target Host Environment:** Ubuntu 22.04 / 24.04 LTS VPS (DigitalOcean, AWS EC2, Linode, or Hetzner)  
**Ghana Network Optimizations:** Low-latency CDN caching, local Mobile Money webhook endpoints  

---

## 1. Production Architecture Overview
```
           HTTPS :443
[Client] --------------> [ Nginx Reverse Proxy / SSL (Let's Encrypt) ]
                                      |
                         Reverse Proxy to :5000
                                      |
                      +---------------+---------------+
                      |                               |
                      v                               v
             [ /api/* Endpoints ]             [ Static Vite SPA ]
             Express.js Engine                Cached in /dist
                      |
                      v
             [ better-sqlite3 ]
             (ACID Transactions, WAL Mode, Foreign Keys)
                      |
                      v
             [ /data/bolddee.db ]
             Persistent Storage & Hot Snapshots
```

---

## 2. Server Prerequisites
- **Operating System:** Ubuntu 22.04 / 24.04 LTS
- **Hardware Minimum:** 1 vCPU, 2 GB RAM, 25 GB SSD Storage
- **Installed Software:**
  - Node.js 22.x LTS (`curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs`)
  - Docker & Docker Compose (optional but recommended)
  - Nginx & Certbot (`sudo apt install -y nginx certbot python3-certbot-nginx`)
  - Git & Build Essentials (`sudo apt install -y git build-essential python3 sqlite3`)

---

## 3. Environment Configuration
Clone the repository and prepare your production `.env` file:
```bash
git clone https://github.com/bolddee/bolddee-rentals.git /var/www/bolddee
cd /var/www/bolddee
cp .env.example .env
nano .env
```
Ensure the following production secrets are provided:
```ini
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://bolddeerentals.com

# Cryptographic Keys (Generate with `openssl rand -hex 32`)
JWT_SECRET=your_production_64_character_hex_jwt_secret_key
ADMIN_SECRET_KEY=YourStrongMasterAdminKey2026!

# Database Storage Path
DATABASE_URL=data/bolddee.db

# Live Paystack Ghana Credentials
PAYSTACK_SECRET_KEY=your_live_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_live_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_live_paystack_webhook_secret

# Operations Hotline
WHATSAPP_PHONE=233546996210
```

---

## 4. Deployment Option A: Docker Compose (Recommended)
Launch the multi-stage containerized environment with zero downtime:
```bash
# 1. Build and start containers in the background
docker compose up -d --build

# 2. Check running status and health check
docker compose ps
docker compose logs -f bolddee-app

# 3. Verify API health
curl http://localhost:5000/api/health
```

---

## 5. Deployment Option B: PM2 Native Node.js Process Manager
If deploying directly on bare Ubuntu without Docker:
```bash
# 1. Install dependencies and compile better-sqlite3 native bindings
npm ci

# 2. Run automated test suite to ensure environment integrity
node tests/testSuite.js

# 3. Build optimized frontend bundle
npm run build

# 4. Install PM2 globally
sudo npm install -g pm2

# 5. Start Express production server
pm2 start server/server.js --name "bolddee-api" --time

# 6. Configure PM2 to restart on system boot
pm2 startup
pm2 save
```

---

## 6. Nginx Reverse Proxy & SSL Configuration
Configure Nginx as a reverse proxy with TLS 1.3 encryption:
```nginx
# /etc/nginx/sites-available/bolddeerentals.com
server {
    server_name bolddeerentals.com www.bolddeerentals.com;

    # Gzip Compression for Fast Ghanaian Mobile Browsing
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend Static SPA Assets
    location / {
        root /var/www/bolddee/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 15M;
    }
}
```
Enable site and obtain free Let's Encrypt SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/bolddeerentals.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d bolddeerentals.com -d www.bolddeerentals.com
```

---

## 7. Automated Daily Backups Setup (Cron)
Configure automated midnight hot database backups with 30-day retention:
```bash
# Open crontab
crontab -e

# Add automated daily backup at 02:00 AM UTC:
0 2 * * * /usr/bin/node /var/www/bolddee/server/db/backup.js backup >> /var/log/bolddee-backup.log 2>&1
```
