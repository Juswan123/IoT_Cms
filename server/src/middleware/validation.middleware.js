const validate = (schema) => {
  return (req, res, next) => {
    // Validasi req.body menggunakan schema Joi
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Ambil pesan error yang spesifik
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      
      // Return 400 Bad Request sesuai requirement
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessage
      });
    }

    // Jika aman, lanjut ke controller
    next();
  };
};

module.exports = validate;