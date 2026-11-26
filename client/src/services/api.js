import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') || '';
export const API_BASE_URL = rawBase ? `${rawBase}/api` : '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 45000, // 45s timeout for Render free-tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry interceptor — retries once on network error or 5xx
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (
      config &&
      !config._retried &&
      (!error.response || error.response.status >= 500) &&
      config.method === 'get'
    ) {
      config._retried = true;
      await new Promise((r) => setTimeout(r, 2000));
      return api(config);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/password', data),
};

export const publicApi = {
  getBootstrap: () => api.get('/portfolio/bootstrap'),
  getProjects: (params) => api.get('/projects', { params }),
  getProjectBySlug: (idOrSlug) => api.get(`/projects/${idOrSlug}`),
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlogBySlug: (idOrSlug) => api.get(`/blogs/${idOrSlug}`),
  submitContact: (data) => api.post('/contact', data),
  trackView: (path) => api.post('/analytics/track', { path }).catch(() => {}),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  updateProfile: (data) => api.put('/admin/profile', data),
  updateSettings: (data) => api.put('/admin/settings', data),
  exportJson: () => api.get('/admin/export', { responseType: 'blob' }),

  // Messages
  getMessages: (params) => api.get('/admin/messages', { params }),
  updateMessage: (id, data) => api.patch(`/admin/messages/${id}`, data),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),

  // Uploads
  getUploadStatus: () => api.get('/admin/upload/status'),
  uploadSingle: (file, folder = 'uploads', onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/admin/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },
  uploadMultiple: (files, folder = 'gallery', onProgress) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('folder', folder);
    return api.post('/admin/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },
  deleteFile: (publicId, resourceType = 'image') =>
    api.post('/admin/upload/delete', { publicId, resourceType }),

  // Generic module CRUD
  list: (module, params) => api.get(`/admin/${module}`, { params }),
  create: (module, data) => api.post(`/admin/${module}`, data),
  update: (module, id, data) => api.put(`/admin/${module}/${id}`, data),
  remove: (module, id) => api.delete(`/admin/${module}/${id}`),
  toggleStatus: (module, id) => api.patch(`/admin/${module}/${id}/status`),
  toggleFeatured: (module, id) => api.patch(`/admin/${module}/${id}/featured`),
  reorder: (module, items) => api.put(`/admin/${module}/reorder`, { items }),
};
