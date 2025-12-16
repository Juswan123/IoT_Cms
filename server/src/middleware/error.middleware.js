const errorHandler = (err, req, res, next) => {
  console.error("ERROR LOG:", err); 

  // FIX: Cek apakah header sudah terkirim ke client
  // Jika sudah, serahkan ke default error handler Express agar tidak crash
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // --- 1. HANDLE PRISMA ERRORS ---
  // P2002: Unique constraint failed (Misal: Email kembar)
  if (err.code === 'P2002') {
    statusCode = 409; // Conflict
    const target = err.meta?.target || 'Field';
    message = `Data ${target} sudah terdaftar (Duplikat).`;
  }
  // P2025: Record not found (Misal: Delete ID yang gak ada)
  else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Data tidak ditemukan.';
  }

  // --- 2. HANDLE JWT ERRORS ---
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token sudah kadaluarsa, silakan login ulang.';
  }

  // --- 3. FORMAT RESPONSE ---
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;