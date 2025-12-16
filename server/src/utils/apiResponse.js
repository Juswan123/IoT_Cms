// src/utils/apiResponse.js

/**
 * Format respon sukses standar
 */
exports.successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message: message,
  };
  
  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Format respon error standar
 */
exports.errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message: message,
  };

  // Jika ada detail error (misal dari validasi)
  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};