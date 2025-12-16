# 📘 IoT CMS Deployment Documentation

Dokumen ini berisi **panduan teknis lengkap** untuk konfigurasi dan deployment aplikasi **IoT CMS** pada lingkungan **produksi menggunakan AWS EC2**. Dokumen ini dirancang agar **rapi, mudah dibaca, dan siap dinilai/dipresentasikan**.

---

## 📌 1. Repository & Production URL

| Item                      | Detail                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- |
| **GitHub Repository**     | [https://github.com/Juswan123/IoT_Cms](https://github.com/Juswan123/IoT_Cms) |
| **Production URL**        | [http://13.222.169.132/](http://13.222.169.132/)                             |
| **Health Check Endpoint** | [http://13.222.169.132/api/health](http://13.222.169.132/api/health)         |

---

## ☁️ 2. Infrastruktur (AWS EC2)

Aplikasi dideploy pada layanan **AWS EC2** dengan spesifikasi berikut:

| Komponen             | Detail                  |
| -------------------- | ----------------------- |
| **Instance ID**      | `i-0521c8ef1820162b7`   |
| **Instance Type**    | `t3.micro`              |
| **Public IP**        | `13.222.169.132`        |
| **Region**           | US East (N. Virginia)   |
| **Operating System** | Ubuntu Server 22.04 LTS |

---

## 🔐 3. Test Credentials (Untuk Pengujian)

Gunakan akun berikut untuk melakukan pengujian aplikasi **tanpa registrasi ulang**.

| Role      | Email                   | Password        |
| --------- | ----------------------- | --------------- |
| **Admin** | `admin_test@iotcms.com` | `TestAdmin123!` |
| **User**  | `user_test@iotcms.com`  | `TestUser123!`  |

> ⚠️ **Catatan:** Akun ini hanya untuk keperluan testing. Jangan gunakan data sensitif.

---

## ⚙️ 4. Konfigurasi Environment (.env)

File `.env` wajib tersedia pada server backend.

```ini
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL="file:./dev.db"  # Path absolute ke SQLite DB

# Security Configuration
JWT_SECRET=***************  # Minimal 32 karakter acak
JWT_EXPIRES_IN=7d
```

---

## 🚀 5. Langkah Deployment (Step-by-Step)

### A. Persiapan Sistem

```bash
sudo apt update && sudo apt upgrade -y
```

Install **Node.js v20**:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install **Nginx & PM2**:

```bash
sudo apt install -y nginx
sudo npm install -g pm2
```

---

### B. Setup Backend

```bash
cd ~
git clone https://github.com/Juswan123/IoT_Cms.git
cd IoT_Cms/server
npm install
```

Setup environment:

```bash
nano .env
```

Migrasi database:

```bash
npx prisma generate
npx prisma migrate deploy
```

Jalankan backend dengan PM2:

```bash
pm2 start server.js --name iot-api
pm2 save
```

---

### C. Setup Frontend

```bash
cd ~/IoT_Cms/client
npm install
```

> ⚠️ Pastikan **baseURL API menggunakan `/api`**, bukan `localhost`.

Build frontend:

```bash
npm run build
```

Output build akan berada di folder:

```
client/dist
```

---

### D. Pengaturan Permission Folder

```bash
chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/IoT_Cms/client/dist
sudo chmod -R 755 /home/ubuntu/IoT_Cms/server/public/uploads
```

---

## 🌐 6. Konfigurasi Nginx

File konfigurasi:

```
/etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location /uploads/ {
        alias /home/ubuntu/IoT_Cms/server/public/uploads/;
        autoindex on;
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /home/ubuntu/IoT_Cms/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## ✅ 7. Verifikasi Deployment

1. **Akses Website**
   [http://13.222.169.132/](http://13.222.169.132/)

2. **Health Check API**

```http
GET /api/health
```

```json
{
  "status": "ok",
  "message": "Server is healthy",
  "timestamp": "2025-12-16T15:00:00.000Z",
  "uptime": 120.5
}
```

3. **Test Upload Gambar**
   Login → Upload gambar → Pastikan tidak error (404).

---

## 📊 8. Monitoring & Maintenance

### Monitoring PM2

```bash
pm2 status
pm2 logs
pm2 monit
```

### Update Aplikasi

```bash
cd ~/IoT_Cms
git pull origin main
```

**Backend**:

```bash
cd server
npm install
npx prisma migrate deploy
pm2 restart iot-api
```

**Frontend**:

```bash
cd ../client
npm install
npm run build
```

---

## 🛠️ 9. Troubleshooting

| Masalah               | Penyebab          | Solusi                        |
| --------------------- | ----------------- | ----------------------------- |
| 500 Error             | Permission folder | `chmod 755`                   |
| 502 Bad Gateway       | Backend mati      | `pm2 restart iot-api`         |
| 413 Request Too Large | Limit Nginx       | Tambah `client_max_body_size` |
| 404 Image             | Folder upload     | `chmod -R 755 uploads`        |
| CORS Error            | API ke localhost  | Gunakan `/api`                |

---

📌 **Dokumen ini siap digunakan untuk laporan KP, deployment production, maupun presentasi teknis.**
