import api from './api';

const projectService = {
  // Ambil semua project (bisa filter)
  getAll: async (params) => {
    // params bisa berupa { search: '...', sortBy: '...' }
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Ambil detail 1 project
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Upload Project Baru (FormData untuk gambar)
  create: async (formData) => {
    const response = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update Project
  update: async (id, formData) => {
    const response = await api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Hapus Project
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Ambil List Komponen (Dropdown)
  getComponents: async () => {
    const response = await api.get('/projects/components');
    return response.data;
  }
};

export default projectService;