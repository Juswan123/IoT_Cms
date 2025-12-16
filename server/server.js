require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Import Routes
const authRoutes = require('./src/routes/auth.routes');
const projectRoutes = require('./src/routes/project.routes');
const componentRoutes = require('./src/routes/component.routes'); // Aktifkan jika sudah ada

// Import Middleware Error
const errorHandler = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// === 1. MIDDLEWARE ===
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan port frontend Anda
    credentials: true // Agar cookie/auth header bisa lewat
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === 2. STATIC FOLDER (PERBAIKAN DISINI) ===
// Kita arahkan URL '/uploads' ke folder fisik 'server/public/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// === 3. ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/components', componentRoutes);

// === 4. ERROR HANDLER ===
app.use(errorHandler);

// === 5. START SERVER ===
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Static folder diset ke: ${path.join(__dirname, 'public', 'uploads')}`);
});