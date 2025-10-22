import React from 'react';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import SuperAdminDashboard from './SuperAdminDashboard';
import HospitalDashboard from './HospitalDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const DashboardPage: React.FC = () => {
    const { user, isLoading } = useAuth();

    // Show loading spinner while user data is being fetched
    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading your dashboard...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Show error if no user data
    if (!user) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    Unable to load user data. Please try logging in again.
                </Alert>
            </Container>
        );
    }

    // Route to appropriate dashboard based on user role
    switch (user.role) {
        case 'super_admin':
            return <SuperAdminDashboard />;
        case 'hospital':
            return <HospitalDashboard />;
        case 'doctor':
            return <DoctorDashboard />;
        case 'patient':
            return <PatientDashboard />;
        default:
            return (
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Alert severity="warning">
                        Unknown user role: {user.role}. Please contact system administrator.
                    </Alert>
                </Container>
            );
    }
};

export default DashboardPage;
