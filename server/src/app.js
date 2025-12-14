const express = require('express');
const cors = require('cors');
const path = require('path');
const projectRoutes = require('./routes/project.routes');

const app = express();

app.use(cors()); // Agar Frontend bisa akses Backend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder public statis agar gambar bisa diakses browser
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/projects', projectRoutes);

module.exports = app;