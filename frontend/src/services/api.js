import axios from 'axios';

const BASE_URL = 'https://rodolfo-daughterly-darci.ngrok-free.dev/api';
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
  getDownloadUrl: (name) => `${BASE_URL}/download/${name}`,
  getPreviewUrl: (id) => `${BASE_URL}/files/preview/${id}`
};

export const systemService = {
  getStats: () => api.get('/system/stats'),
  getActivity: () => api.get('/system/activity')
};

export default api;
