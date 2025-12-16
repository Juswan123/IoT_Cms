// src/config/jwt.js
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'rahasia_negara_api', // Fallback jika .env kosong
  expiresIn: '1d', // Token berlaku 1 hari
};