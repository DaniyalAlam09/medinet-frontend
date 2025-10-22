export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  profileImage?: string;
  hospitalId?: string;
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  isActive: boolean;
  isEmailVerified: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super_admin' | 'hospital' | 'doctor' | 'patient';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  hospitalId?: string;
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
}

export interface AuthError {
  field: string;
  message: string;
  value?: any;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  errors?: AuthError[];
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  needsApproval: () => boolean;
}
