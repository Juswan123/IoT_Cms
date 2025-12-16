# Documentation: IoT CMS Deployment

Dokumen ini berisi detail teknis, konfigurasi, dan panduan deployment untuk aplikasi IoT CMS pada lingkungan produksi (AWS EC2).

## 1. Repository & Production URL

| Item | Detail |
| :--- | :--- |
| **GitHub Repository** | [https://github.com/Juswan123/IoT_Cms](https://github.com/Juswan123/IoT_Cms) |
| **Production URL** | [http://13.222.169.132/](http://13.222.169.132/) |
| **Health Check Endpoint**| [http://13.222.169.132/api/health](http://13.222.169.132/api/health) |

---

## 2. Detail Infrastruktur (AWS EC2)

Aplikasi di-deploy menggunakan layanan AWS EC2 dengan spesifikasi berikut:

* **Instance ID:** `i-0521c8ef1820162b7`
* **Instance Type:** `t3.micro`
* **Public IP:** `13.222.169.132`
* **Region:** US East (N. Virginia)
* **OS:** Ubuntu Server 22.04 LTS

---

## 3. Test Credentials (Untuk Pengujian)

Gunakan akun berikut untuk menguji fungsionalitas aplikasi tanpa melakukan registrasi ulang.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin_test@iotcms.com` | `TestAdmin123!` |
| **Regular User** | `user_test@iotcms.com` | `TestUser123!` |

> **Catatan:** Akun ini hanya untuk keperluan testing. Jangan gunakan data sensitif.

---

## 4. Konfigurasi Environment

Berikut adalah daftar variabel lingkungan yang diperlukan dalam file `.env` di server (value disembunyikan untuk keamanan).

```ini
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL="file:./dev.db"  # Path absolute ke file SQLite

# Security
JWT_SECRET=****** # Minimal 32 karakter acak
JWT_EXPIRES_IN=7d
5. Langkah Deployment (Step-by-Step)
Berikut adalah ringkasan langkah-langkah yang dilakukan untuk men-deploy aplikasi ini dari awal.

A. Persiapan Sistem
Update server: sudo apt update && sudo apt upgrade

Install Node.js v20:

Bash

curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt install -y nodejs
Install Nginx & PM2:

Bash

sudo apt install nginx
sudo npm install -g pm2
B. Setup Backend
Clone repository ke folder ~/IoT_Cms.

Masuk ke folder server: cd ~/IoT_Cms/server.

Install dependencies: npm install.

Setup environment variables (.env).

Migrasi Database:

Bash

npx prisma generate
npx prisma migrate deploy
Start aplikasi dengan PM2:

Bash

pm2 start server.js --name "iot-api"
pm2 save
C. Setup Frontend
Masuk ke folder client: cd ~/IoT_Cms/client.

Hapus referensi localhost pada kode API agar menjadi path relatif (/api).

Install dependencies: npm install.

Build aplikasi React:

Bash

npm run build
Hasil build akan tersimpan di folder dist.

D. Izin Folder (Permissions)
Memberikan akses kepada Nginx untuk membaca file build dan folder upload.

Bash

chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/IoT_Cms/client/dist
sudo chmod -R 755 /home/ubuntu/IoT_Cms/server/public/uploads
6. Konfigurasi Nginx
Nginx bertindak sebagai Reverse Proxy dan Static File Server. File config: /etc/nginx/sites-available/default

Nginx

server {
    listen 80;
    server_name _;

    # Izinkan upload file besar (s/d 50MB)
    client_max_body_size 50M;

    # Serving Uploaded Images (Backend)
    location /uploads/ {
        alias /home/ubuntu/IoT_Cms/server/public/uploads/;
        add_header Cache-Control "public, no-transform";
        autoindex on;
        try_files $uri $uri/ =404;
    }

    # Reverse Proxy ke Node.js Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serving Frontend React (Static Files)
    location / {
        root /home/ubuntu/IoT_Cms/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
7. Langkah Verifikasi & Health Check
Untuk memverifikasi deployment berhasil:

Akses Website: Buka http://13.222.169.132/. Pastikan halaman login/home muncul.

Cek API Health:

Request: GET /api/health

Expected Response (HTTP 200):

JSON

{
  "status": "ok",
  "message": "Server is healthy",
  "timestamp": "2025-12-16T15:00:00.000Z",
  "uptime": 120.5
}
Test Upload: Coba upload gambar pada fitur project untuk memastikan permission folder uploads benar.

8. Monitoring & Maintenance
Monitoring
Untuk memantau status server dan log error:

Cek status aplikasi: pm2 status

Cek log realtime: pm2 logs

Monitoring resource (CPU/RAM): pm2 monit

Maintenance (Update Aplikasi)
Jika ada perubahan kode di GitHub, lakukan langkah ini:

Pull kode terbaru:

Bash

cd ~/IoT_Cms
git pull origin main
Update Backend (jika perlu):

Bash

cd server
npm install
npx prisma migrate deploy
pm2 restart iot-api
Update Frontend (jika perlu):

Bash

cd ../client
npm install
npm run build
9. Troubleshooting (Masalah Umum)
Issue	Kemungkinan Penyebab	Solusi
500 Internal Server Error	Nginx permission denied	Jalankan chmod 755 pada folder home dan project.
502 Bad Gateway	Backend Node.js mati	Cek pm2 status, lalu pm2 restart iot-api.
413 Request Entity Too Large	Upload gambar terlalu besar	Tambahkan client_max_body_size 50M; di Nginx config.
404 Not Found (Images)	Permission folder uploads	Jalankan sudo chmod -R 755 .../public/uploads.
CORS / Network Error	Frontend akses localhost	Ubah baseURL axios menjadi /api dan build ulang frontend.
