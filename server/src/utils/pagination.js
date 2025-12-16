// src/utils/pagination.js

/**
 * Menghitung metadata pagination
 * @param {number} page - Halaman saat ini (dari query param)
 * @param {number} limit - Jumlah item per halaman
 * @param {number} totalItems - Total data di database
 */
exports.getPagination = (page, limit, totalItems) => {
  const currentPage = page ? parseInt(page) : 1;
  const limitItems = limit ? parseInt(limit) : 10;
  const totalPages = Math.ceil(totalItems / limitItems);

  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage: limitItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

/**
 * Menghitung offset untuk query Prisma
 */
exports.getPagingData = (page, limit) => {
  const p = page ? parseInt(page) : 1;
  const l = limit ? parseInt(limit) : 10;
  
  const skip = (p - 1) * l;
  const take = l;

  return { skip, take };
};