const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Gunakan secret key yang aman
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_api';

// 1. REGISTER USER BARU
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({ success: true, message: "Registrasi berhasil", data: { email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Cek Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Buat Token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // FIX: Hanya kirim SATU respon json. 
    // (Kode duplikat yang menyebabkan error sudah dihapus disini)
    res.json({
      success: true,
      message: "Login berhasil",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET ME (Profil Saya)
exports.getMe = async (req, res, next) => {
  try {
    // Debugging: Cek apakah user ID terbaca
    // console.log("User Request:", req.user); 

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User tidak terautentikasi dengan benar." });
    }

    const userId = parseInt(req.user.id); // <--- PASTIKAN JADI INTEGER

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true // Ini akan error jika Langkah 1 dilewatkan
      }
    });

    if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan di database" });
    }

    // Buang password sebelum dikirim
    const { password, ...userData } = user;

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("ERROR GET ME:", error); // Biar muncul di terminal server
    next(error);
  }
};