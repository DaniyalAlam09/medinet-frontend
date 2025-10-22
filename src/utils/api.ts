import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    // Add auth token to requests
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show access denied message
      console.error('Access denied');
    }
    
    if (error.response?.status >= 500) {
      // Server error - show generic error message
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Generic methods
  get: <T>(url: string, config?: any): Promise<any> =>
    api.get(url, config),
  
  post: <T>(url: string, data?: any, config?: any): Promise<any> =>
    api.post(url, data, config),
  
  put: <T>(url: string, data?: any, config?: any): Promise<any> =>
    api.put(url, data, config),
  
  patch: <T>(url: string, data?: any, config?: any): Promise<any> =>
    api.patch(url, data, config),
  
  delete: <T>(url: string, config?: any): Promise<any> =>
    api.delete(url, config),
};

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', credentials),
  
  register: (userData: any) =>
    apiClient.post('/api/auth/register', userData),
  
  logout: () =>
    apiClient.post('/api/auth/logout'),
  
  getCurrentUser: () =>
    apiClient.get('/api/auth/me'),

  updateProfile: (data: any) =>
    apiClient.put('/api/auth/profile', data),

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/auth/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  forgotPassword: (email: string) =>
    apiClient.post('/api/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/api/auth/reset-password', { token, password }),
};

// Hospital API
export const hospitalAPI = {
  getAll: (params?: any) =>
    apiClient.get('/api/hospitals', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/hospitals/${id}`),
  
  create: (hospitalData: any) =>
    apiClient.post('/api/hospitals', hospitalData),
  
  update: (id: string, hospitalData: any) =>
    apiClient.put(`/api/hospitals/${id}`, hospitalData),
  
  delete: (id: string) =>
    apiClient.delete(`/api/hospitals/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/hospitals/${id}/status`, { status }),
  
  getDoctors: (id: string) =>
    apiClient.get(`/api/hospitals/${id}/doctors`),
  
  getStats: (id: string) =>
    apiClient.get(`/api/hospitals/${id}/stats`),
};

// Patient API
export const patientAPI = {
  getAll: (params?: any) =>
    apiClient.get('/api/patients', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/patients/${id}`),
  
  create: (patientData: any) =>
    apiClient.post('/api/patients', patientData),
  
  update: (id: string, patientData: any) =>
    apiClient.put(`/api/patients/${id}`, patientData),
  
  delete: (id: string) =>
    apiClient.delete(`/api/patients/${id}`),
  
  getRecords: (id: string) =>
    apiClient.get(`/api/patients/${id}/records`),
  
  getReferrals: (id: string) =>
    apiClient.get(`/api/patients/${id}/referrals`),
  
  addRecord: (id: string, recordData: any) =>
    apiClient.post(`/api/patients/${id}/records`, recordData),
};

// Referral API
export const referralAPI = {
  getAll: (params?: any) =>
    apiClient.get('/api/referrals', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/api/referrals/${id}`),
  
  create: (referralData: any) =>
    apiClient.post('/api/referrals', referralData),
  
  update: (id: string, referralData: any) =>
    apiClient.put(`/api/referrals/${id}`, referralData),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/referrals/${id}/status`, { status }),
  
  accept: (id: string, responseData?: any) =>
    apiClient.post(`/api/referrals/${id}/accept`, responseData),
  
  reject: (id: string, responseData?: any) =>
    apiClient.post(`/api/referrals/${id}/reject`, responseData),
  
  getMessages: (id: string) =>
    apiClient.get(`/api/referrals/${id}/messages`),
  
  addMessage: (id: string, message: string) =>
    apiClient.post(`/api/referrals/${id}/messages`, { message }),
  
  generatePDF: (id: string) =>
    apiClient.get(`/api/referrals/${id}/pdf`),
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () =>
        apiClient.get('/api/analytics/dashboard'),

    getHospitals: (params?: any) =>
        apiClient.get('/api/analytics/hospitals', { params }),

    getReferrals: (params?: any) =>
        apiClient.get('/api/analytics/referrals', { params }),

    getPatients: (params?: any) =>
        apiClient.get('/api/analytics/patients', { params }),

    getReports: (params?: any) =>
        apiClient.get('/api/analytics/reports', { params }),

    // Role-specific dashboard endpoints
    getSuperAdminDashboard: () =>
        apiClient.get('/api/analytics/super-admin-dashboard'),

        getHospitalDashboard: () =>
            apiClient.get('/api/analytics/hospital-dashboard'),

    getDoctorDashboard: () =>
        apiClient.get('/api/analytics/doctor-dashboard'),

    getPatientDashboard: () =>
        apiClient.get('/api/analytics/patient-dashboard'),
};

export default api;
