export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface HospitalCapacity {
  beds: number;
  icuBeds?: number;
  emergencyBeds?: number;
}

export interface HospitalAccreditation {
  jcaho?: boolean;
  cap?: boolean;
  aoa?: boolean;
}

export interface HospitalStats {
  totalDoctors: number;
  totalPatients: number;
  totalReferrals: number;
}

export interface Hospital {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  type: 'public' | 'private' | 'non-profit' | 'government';
  specialties?: string[];
  capacity: HospitalCapacity;
  services?: string[];
  accreditation?: HospitalAccreditation;
  website?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  adminId?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  stats?: HospitalStats;
  createdAt: string;
  updatedAt: string;
}

export interface HospitalRegistration {
  name: string;
  email: string;
  phone: string;
  address: Address;
  type: 'public' | 'private' | 'non-profit' | 'government';
  specialties?: string[];
  capacity: HospitalCapacity;
  services?: string[];
  website?: string;
  description?: string;
}

export interface HospitalUpdate {
  name?: string;
  phone?: string;
  address?: Partial<Address>;
  specialties?: string[];
  capacity?: Partial<HospitalCapacity>;
  services?: string[];
  website?: string;
  description?: string;
}

export interface ApprovalStats {
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  pendingHospitals: number;
  approvedHospitals: number;
  rejectedHospitals: number;
}

export interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'doctor' | 'hospital' | 'patient';
  phone?: string;
  hospitalId?: string;
  hospital?: {
    _id: string;
    name: string;
    address: Address;
  };
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PendingHospital {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  type: 'public' | 'private' | 'non-profit' | 'government';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  adminId?: string;
  admin?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}