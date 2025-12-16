const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Routes
const projectRoutes = require('./routes/project.routes');
const authRoutes = require('./routes/auth.routes'); // <--- TAMBAH INI

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Pasang Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes); // <--- DAFTARKAN DI SINI

module.exports = app;