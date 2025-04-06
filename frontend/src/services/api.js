import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page if appropriate
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
};

// Tests API
export const testsAPI = {
  getAll: () => api.get('/tests'),
  getById: (id) => api.get(`/tests/${id}`),
  create: (data) => api.post('/tests', data),
  update: (id, data) => api.put(`/tests/${id}`, data),
  generateTest: (data) => api.post('/tests/generate', data),
  generateQuestion: (testId, data) => api.post(`/tests/${testId}/generate-question`, data),
  exportPdf: (testId) => api.get(`/tests/${testId}/export-pdf`, { responseType: 'blob' }),
  getQuestions: (testId) => api.get(`/tests/${testId}/questions`),
};

// Submissions API
export const submissionsAPI = {
  getAll: () => api.get('/submissions'),
  getById: (id) => api.get(`/submissions/${id}`),
  create: (data) => api.post('/submissions', data),
  grade: (id, files) => {
    const formData = new FormData();
    
    // Append each file to the form data
    files.forEach((file, index) => {
      formData.append(`scan_${index}`, file);
    });
    
    return api.post(`/submissions/${id}/grade`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAnswers: (id) => api.get(`/submissions/${id}/answers`),
};

export default api; 