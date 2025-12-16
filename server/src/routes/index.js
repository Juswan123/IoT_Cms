// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import Sub-Routes
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes'); // Pastikan file ini ada
// const componentRoutes = require('./component.routes'); // Jika ada

// Daftarkan URL
// URL: /api/auth/...
router.use('/auth', authRoutes);

// URL: /api/projects/...
router.use('/projects', projectRoutes);

// Test Route untuk cek server jalan
router.get('/', (req, res) => {
  res.json({ message: "Welcome to IoT CMS API v1.0" });
});

module.exports = router;