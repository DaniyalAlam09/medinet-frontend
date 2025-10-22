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
  deleteHospital: async (id: string) => {
    const response = await api.delete(`/api/hospitals/${id}`);
    return response.data;
  },
};
