```markdown
# API-DOCS.md

## IoT CMS System – REST API Documentation

Dokumentasi ini menjelaskan seluruh endpoint REST API untuk **IoT CMS System**, termasuk autentikasi, manajemen perangkat (devices), dan telemetri sensor.

---

## Base URL

```text
http://localhost:3000/api/v1

```

*(Ganti dengan IP Server saat production)*

---

##Authentication###Authorization HeaderSemua endpoint protected **WAJIB** menyertakan header:

```http
Authorization: Bearer <access_token>

```

---

##Response Format Standar###Success Response```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {},
  "pagination": {}
}

```

###Error Response```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}

```

---

##Authentication Endpoints###Register User**POST** `/auth/register`

Request Body:

```json
{
  "username": "admin_iot",
  "email": "admin@iot-cms.com",
  "password": "StrongPassword123"
}

```

Response `201 Created`

---

###Login User**POST** `/auth/login`

Request Body:

```json
{
  "email": "admin@iot-cms.com",
  "password": "StrongPassword123"
}

```

Response `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-access-token",
    "user": {
      "id": 1,
      "email": "admin@iot-cms.com",
      "role": "admin"
    }
  }
}

```

---

###Get Current User**GET** `/auth/me`

Auth: ✅ Required

Response `200 OK`

---

##Device Endpoints###List Devices**GET** `/devices`

Query Params:

* `page` (default: 1)
* `limit` (default: 10)
* `status` (online | offline)
* `search`

Response `200 OK`

---

###Get Device Detail**GET** `/devices/:id`

Auth: ✅ Required

Response `200 OK`

---

###Register Device**POST** `/devices`

Auth: ✅ Required

Request Body:

```json
{
  "name": "Sensor Suhu Gudang",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "type": "ESP32",
  "location": "Gudang A"
}

```

Response `201 Created`

---

###Update Device**PUT** `/devices/:id`

Auth: ✅ Required

Request Body:

```json
{
  "name": "Sensor Gudang (Renamed)",
  "location": "Gudang B"
}

```

Response `200 OK`

---

###Delete Device**DELETE** `/devices/:id`

Auth: ✅ Required

Response `204 No Content`

---

##Telemetry Endpoints (Sensor Data)###Push Data**POST** `/telemetry`

Auth: ❌ Not required (Validated by Mac Address/API Key internally)

Request Body:

```json
{
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "data": {
    "temperature": 28.5,
    "humidity": 60,
    "voltage": 3.3
  }
}

```

Response `200 OK`

```json
{
  "success": true,
  "message": "Data received",
  "command": "RELAY_ON"
}

```

---

###Get Device History**GET** `/telemetry/:deviceId`

Auth: ✅ Required

Query Params:

* `page`
* `limit`
* `start_date`
* `end_date`

Response `200 OK`

---

##Health Check###Check API Status**GET** `/`

Auth: ❌ Not required

Response `200 OK`

```json
{
  "status": "OK",
  "message": "IoT CMS API is running",
  "timestamp": "2025-12-16T12:00:00Z",
  "uptime": 3600
}

```

---

##HTTP Status Codes* `200 OK`
* `201 Created`
* `204 No Content`
* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `500 Internal Server Error`

---

##Notes* Endpoint `POST /telemetry` dirancang untuk diakses oleh mikrokontroler (ESP32).
* Semua endpoint manajemen (Devices) memerlukan JWT Token valid.
* Timestamp menggunakan format ISO 8601 UTC.

```

```