const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Lanjut ke proses berikutnya dulu...
  next();

  // ... Setelah response selesai dikirim, baru kita catat lognya
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    
    // Ambil IP Address (support jika di belakang proxy/nginx)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Format Log: [Waktu] METHOD URL STATUS IP - Durasi
    console.log(`[${timestamp}] ${method} ${url} ${statusCode} ${ip} - ${duration}ms`);
  });
};

module.exports = logger;