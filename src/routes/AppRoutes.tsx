import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import FeaturesPage from '../pages/FeaturesPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import StepperRegisterPage from '../pages/auth/StepperRegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import EditProfilePage from '../pages/profile/EditProfilePage';
import HospitalsPage from '../pages/hospitals/HospitalsPage';
import PatientsPage from '../pages/patients/PatientsPage';
import ReferralsPage from '../pages/referrals/ReferralsPage';

// Admin Pages
import UsersPage from '../pages/admin/UsersPage';
import ApprovalPage from '../pages/admin/ApprovalPage';

// Hospital Pages
import DoctorsPage from '../pages/hospital/DoctorsPage';
import DoctorApprovalPage from '../pages/hospital/DoctorApprovalPage';

// Doctor Pages
import AppointmentsPage from '../pages/doctor/AppointmentsPage';

// Patient Pages
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApprovalStatus from '../components/auth/ApprovalStatus';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading, user, needsApproval } = useAuth();

    if (isLoading) {
        return <LoadingSpinner message="Authenticating..." fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user needs approval
    if (needsApproval()) {
        return <ApprovalStatus user={user!} />;
    }

    return <>{children}</>;
};

// Role-based Route Component
const RoleBasedRoute: React.FC<{
    children: React.ReactNode;
    allowedRoles: string[]
}> = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="features" element={<FeaturesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<StepperRegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />

                {/* Super Admin Routes */}
                <Route
                    path="users"
                    element={
                        <RoleBasedRoute allowedRoles={['super_admin']}>
                            <UsersPage />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="approvals"
                    element={
                        <RoleBasedRoute allowedRoles={['super_admin']}>
                            <ApprovalPage />
                        </RoleBasedRoute>
                    }
                />

                {/* Hospital Management - Admin and Super Admin only */}
                <Route
                    path="hospitals"
                    element={
                        <RoleBasedRoute allowedRoles={['super_admin', 'hospital']}>
                            <HospitalsPage />
                        </RoleBasedRoute>
                    }
                />

                {/* Doctor Management - Hospital Admin and Super Admin only */}
                <Route
                    path="doctors"
                    element={
                        <RoleBasedRoute allowedRoles={['super_admin', 'hospital']}>
                            <DoctorsPage />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="doctor-approvals"
                    element={
                        <RoleBasedRoute allowedRoles={['hospital']}>
                            <DoctorApprovalPage />
                        </RoleBasedRoute>
                    }
                />

                {/* Appointments - Doctor and Patient only */}
                <Route
                    path="appointments"
                    element={
                        <RoleBasedRoute allowedRoles={['doctor', 'patient']}>
                            <AppointmentsPage />
                        </RoleBasedRoute>
                    }
                />

                {/* Book Appointment - Patient only */}
                <Route
                    path="book-appointment"
                    element={
                        <RoleBasedRoute allowedRoles={['patient']}>
                            <BookAppointmentPage />
                        </RoleBasedRoute>
                    }
                />

                {/* Patient Management - All authenticated users */}
                <Route path="patients" element={<PatientsPage />} />

                {/* Referral Management - All authenticated users */}
                <Route path="referrals" element={<ReferralsPage />} />

                {/* Profile - All authenticated users */}
                <Route path="profile" element={<EditProfilePage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
