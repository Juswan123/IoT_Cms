# IoT CMS Backend System

Sistem Manajemen Konten (CMS) untuk perangkat IoT berbasis Node.js. Aplikasi ini menangani autentikasi pengguna, manajemen perangkat (ESP32), dan visualisasi data sensor.

## 🚀 Fitur Utama

* **Autentikasi Aman:** Menggunakan JWT (JSON Web Token).
* **Manajemen Perangkat:** CRUD untuk perangkat IoT.
* **Data Real-time:** Menerima dan menyimpan data telemetri sensor.
* **API RESTful:** Struktur endpoint yang standar dan terdokumentasi.

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL / PostgreSQL (via Sequelize/TypeORM)
* **Security:** Helmet, CORS, Bcrypt

## ⚙️ Instalasi & Menjalankan Lokal

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/iot-cms-project.git](https://github.com/username/iot-cms-project.git)
    cd iot-cms-project
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Salin file `.env.example` ke `.env` dan isi kredensial.
    ```bash
    cp .env.example .env
    ```

4.  **Jalankan Server**
    ```bash
    npm start
    # atau untuk mode development
    npm run dev
    ```

## 🧪 Testing
Jalankan unit test (jika ada):
```bash
npm test
### 3. File `API-DOCS.md`
Dokumentasi singkat agar frontend atau perangkat IoT tahu cara berkomunikasi dengan server.

```markdown
# Dokumentasi API

Base URL: `/api/v1`

## 1. Authentication

### Login
* **URL:** `/auth/login`
* **Method:** `POST`
* **Body:**
    ```json
    {
      "email": "admin@example.com",
      "password": "password123"
    }
    ```
* **Success Response:** `200 OK` + `{ token: "..." }`

### Register
* **URL:** `/auth/register`
* **Method:** `POST`
* **Body:** `{ "username": "...", "email": "...", "password": "..." }`

## 2. Devices (Perangkat IoT)

### Get All Devices
* **URL:** `/devices`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`

### Register New Device
* **URL:** `/devices`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
    ```json
    {
      "device_name": "ESP32_Sensor_Suhu",
      "mac_address": "AA:BB:CC:DD:EE:FF",
      "location": "Gudang 1"
    }
    ```

## 3. Telemetry Data
* **URL:** `/data/push`
* **Method:** `POST`
* **Description:** Endpoint untuk ESP32 mengirim data.