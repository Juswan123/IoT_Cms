# Panduan Deployment ke AWS EC2

Dokumen ini menjelaskan langkah-langkah men-deploy aplikasi ke AWS EC2 menggunakan Ubuntu, Nginx, dan PM2.

## Prasyarat
1.  Akun AWS aktif.
2.  Akses SSH ke instance EC2 (`key.pem`).
3.  Domain (opsional, tapi disarankan untuk SSL).

## Langkah 1: Setup Server (EC2)
1.  Launch Instance baru (Ubuntu 22.04 LTS).
2.  Buka port di Security Group: `22` (SSH), `80` (HTTP), `443` (HTTPS).
3.  SSH ke server:
    ```bash
    ssh -i "kunci-anda.pem" ubuntu@ip-public-ec2
    ```

## Langkah 2: Install Node.js & Git
```bash
sudo apt update
curl -fsSL [https://deb.nodesource.com/setup_18.x](https://deb.nodesource.com/setup_18.x) | sudo -E bash -
sudo apt install -y nodejs git nginx