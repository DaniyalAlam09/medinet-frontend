import api from './api';
import { PendingUser, PendingHospital, ApprovalStats, Hospital } from '../types/hospital';

export const approvalApi = {
  // Get pending users (Super Admin)
  getPendingUsers: async (params?: { role?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/approval/pending-users', { params });
    return response.data;
  },

  // Get pending hospitals (Super Admin)
  getPendingHospitals: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/approval/pending-hospitals', { params });
    return response.data;
  },

  // Get pending doctors for hospital (Hospital Admin)
  getPendingDoctors: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/approval/pending-doctors', { params });
    return response.data;
  },

  // Approve user
  approveUser: async (userId: string, message?: string) => {
    const response = await api.post(`/api/approval/approve-user/${userId}`, { message });
    return response.data;
  },

  // Reject user
  rejectUser: async (userId: string, reason: string) => {
    const response = await api.post(`/api/approval/reject-user/${userId}`, { reason });
    return response.data;
  },

  // Approve hospital
  approveHospital: async (hospitalId: string, message?: string) => {
    const response = await api.post(`/api/approval/approve-hospital/${hospitalId}`, { message });
    return response.data;
  },

  // Reject hospital
  rejectHospital: async (hospitalId: string, reason: string) => {
    const response = await api.post(`/api/approval/reject-hospital/${hospitalId}`, { reason });
    return response.data;
  },

  // Get approval statistics
  getApprovalStats: async (): Promise<{ success: boolean; data: ApprovalStats }> => {
    const response = await api.get('/api/approval/stats');
    return response.data;
  },
};

export const hospitalApi = {
  // Get approved hospitals (Public)
  getApprovedHospitals: async (): Promise<{ success: boolean; data: Hospital[] }> => {
    const response = await api.get('/api/hospitals/approved');
    return response.data;
  },

  // Register hospital (Public registration)
  registerHospital: async (hospitalData: any) => {
    const response = await api.post('/api/hospitals', hospitalData);
    return response.data;
  },

  // Create hospital (Public registration) - alias for registerHospital
  createHospital: async (hospitalData: any) => {
    const response = await api.post('/api/hospitals', hospitalData);
    return response.data;
  },

  // Get all hospitals (Super Admin)
  getHospitals: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/hospitals', { params });
    return response.data;
  },

  // Get hospital by ID
  getHospitalById: async (id: string) => {
    const response = await api.get(`/api/hospitals/${id}`);
    return response.data;
  },

  // Update hospital
  updateHospital: async (id: string, hospitalData: any) => {
    const response = await api.put(`/api/hospitals/${id}`, hospitalData);
    return response.data;
  },

  // Delete hospital
  deleteHospital: async (id: string, deleteUsers: boolean = false) => {
    const response = await api.delete(`/api/hospitals/${id}`, {
      data: { deleteUsers }
    });
    return response.data;
  },
};

export const userApi = {
  // Get all users (Super Admin)
  getUsers: async (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/api/users/stats');
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // Toggle user status
  toggleUserStatus: async (id: string) => {
    const response = await api.patch(`/api/users/${id}/toggle-status`);
    return response.data;
  },
};

export const doctorApi = {
  // Get all doctors
  getDoctors: async (params?: { status?: string; search?: string; specialization?: string; hospitalId?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/doctors', { params });
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id: string) => {
    const response = await api.get(`/api/doctors/${id}`);
    return response.data;
  },

  // Create doctor
  createDoctor: async (doctorData: any) => {
    const response = await api.post('/api/doctors', doctorData);
    return response.data;
  },
};

export const patientApi = {
  // Get all patients
  getPatients: async (params?: { status?: string; search?: string; hospitalId?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/patients', { params });
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (id: string) => {
    const response = await api.get(`/api/patients/${id}`);
    return response.data;
  },

  // Create patient
  createPatient: async (patientData: any) => {
    const response = await api.post('/api/patients', patientData);
    return response.data;
  },

  // Get patient profile
  getPatientProfile: async (id: string) => {
    const response = await api.get(`/api/patients/${id}/profile`);
    return response.data;
  },

  // Get patient referrals
  getPatientReferrals: async (id: string) => {
    const response = await api.get(`/api/patients/${id}/referrals`);
    return response.data;
  },

  // Get patient medical history
  getPatientMedicalHistory: async (id: string) => {
    const response = await api.get(`/api/patients/${id}/medical-history`);
    return response.data;
  },
};

export const analyticsApi = {
  // Get referral trends
  getReferralTrends: async (params?: { period?: number }) => {
    const response = await api.get('/api/analytics/referral-trends', { params });
    return response.data;
  },

  // Get user activity patterns
  getUserActivityPatterns: async (params?: { period?: number }) => {
    const response = await api.get('/api/analytics/user-activity', { params });
    return response.data;
  },

  // Get system performance metrics
  getSystemPerformanceMetrics: async () => {
    const response = await api.get('/api/analytics/system-performance');
    return response.data;
  },
};
