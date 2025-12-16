const Joi = require('joi');

// --- SCHEMA UNTUK CREATE (Data Wajib Ada) ---
const createProjectSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.base': 'Judul harus berupa teks',
    'string.empty': 'Judul tidak boleh kosong',
    'string.min': 'Judul minimal 3 karakter',
    'any.required': 'Judul wajib diisi'
  }),
  description: Joi.string().min(10).required().messages({
    'string.empty': 'Deskripsi tidak boleh kosong',
    'string.min': 'Deskripsi minimal 10 karakter',
    'any.required': 'Deskripsi wajib diisi'
  }),
  githubUrl: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Link GitHub harus berupa URL valid'
  }),
  authorId: Joi.number().optional(), // Diinject oleh middleware, jadi optional di validasi awal
  componentIds: Joi.alternatives().try(
    Joi.string().allow('', null), 
    Joi.array().items(Joi.number())
  ).optional()
});

// --- SCHEMA UNTUK UPDATE (Semua Opsional) ---
// Error 400 terjadi karena sebelumnya Anda pakai schema Create (Required) di sini
const updateProjectSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(10).optional(),
  githubUrl: Joi.string().uri().allow('', null).optional(),
  authorId: Joi.number().optional(),
  componentIds: Joi.alternatives().try(
    Joi.string().allow('', null), 
    Joi.array().items(Joi.number())
  ).optional()
});

module.exports = { createProjectSchema, updateProjectSchema };