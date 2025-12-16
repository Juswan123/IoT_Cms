const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_api';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // --- MULAI DEBUGGING (CEK TERMINAL SERVER NANTI) ---
  console.log("------------------------------------------------");
  console.log("[DEBUG AUTH] 1. Header diterima:", authHeader);
  // -------------------------------------------------------

  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    console.log("[DEBUG AUTH] 2. Token KOSONG / Tidak ditemukan!");
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("[DEBUG AUTH] 3. Error Verifikasi:", err.message);
      return res.status(403).json({ message: "Token tidak valid atau kadaluarsa." });
    }

    console.log("[DEBUG AUTH] 4. Sukses! User ID:", user.id);
    req.user = user;
    next(); // Lanjut ke controller
  });
};

module.exports = verifyToken;