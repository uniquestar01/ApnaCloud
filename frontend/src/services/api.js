import axios from 'axios';

const BASE_URL = 'http://10.150.250.115:5000';
export const API_BASE = BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fileService = {
  getFiles: () => api.get('/files'),
  uploadFile: (formData, onProgress) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  }),
  deleteFile: (name) => api.delete(`/delete/${name}`),
  getPreviewUrl: (id) => `${BASE_URL}/api/files/preview/${id}`
};

export const systemService = {
  getStats: () => api.get('/api/system/stats'),
  getActivity: () => api.get('/api/system/activity')
};

export default api;
