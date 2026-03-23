const API = "https://rodolfo-daughterly-darci.ngrok-free.dev";
export const API_BASE = API;

// --- Helper for Authorized Fetch ---
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  return fetch(url, { ...options, headers });
};

// --- User's Requested Fetch Functions (FINAL) ---
export const getFiles = async () => {
  const res = await authFetch(`${API}/files`);
  return res.json();
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch(`${API}/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export const deleteFile = async (name) => {
  const res = await authFetch(`${API}/delete/${name}`, {
    method: "DELETE",
  });

  return res.json();
};

// --- Compatibility Exports for Premium UI ---
export const fileService = {
  getFiles,
  uploadFile,
  deleteFile,
  getDownloadUrl: (name) => `${API}/download/${name}`,
  getPreviewUrl: (id) => `${API}/api/files/preview/${id}`
};

export const systemService = {
  getStats: async () => {
    const res = await authFetch(`${API}/api/system/stats`);
    return { data: await res.json() };
  },
  getActivity: async () => {
    const res = await authFetch(`${API}/api/system/activity`);
    return { data: await res.json() };
  }
};

export default { getFiles, uploadFile, deleteFile };
