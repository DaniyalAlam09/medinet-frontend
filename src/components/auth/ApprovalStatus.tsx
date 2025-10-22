import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    CircularProgress,
    Button,
    Chip
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

interface ApprovalStatusProps {
    user: {
        role: string;
        approvalStatus?: string;
        firstName?: string;
        lastName?: string;
    };
    onRefresh?: () => void;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ user, onRefresh }) => {
    const getStatusInfo = () => {
        if (user.role === 'super_admin' || user.role === 'patient') {
            return {
                status: 'approved',
                title: 'Account Active',
                message: 'Your account is active and ready to use.',
                color: 'success' as const,
                icon: <CheckCircleIcon />
            };
        }

        if (user.role === 'hospital') {
            return {
                status: 'pending',
                title: 'Hospital Registration Pending',
                message: 'Your hospital registration is pending approval from Super Admin. You will be notified once approved.',
                color: 'warning' as const,
                icon: <PendingIcon />
            };
        }

        if (user.role === 'doctor') {
            if (user.approvalStatus === 'pending') {
                return {
                    status: 'pending',
                    title: 'Doctor Registration Pending',
                    message: 'Your doctor registration is pending approval from Hospital Admin. You will be notified once approved.',
                    color: 'warning' as const,
                    icon: <PendingIcon />
                };
            } else if (user.approvalStatus === 'rejected') {
                return {
                    status: 'rejected',
                    title: 'Registration Rejected',
                    message: 'Your doctor registration has been rejected. Please contact your hospital admin for more information.',
                    color: 'error' as const,
                    icon: <CancelIcon />
                };
            }
        }

        return {
            status: 'unknown',
            title: 'Unknown Status',
            message: 'Unable to determine approval status.',
            color: 'default' as const,
            icon: <PendingIcon />
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 2,
                bgcolor: 'background.default'
            }}
        >
            <Card sx={{ maxWidth: 500, width: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                        {statusInfo.icon}
                    </Box>

                    <Typography variant="h5" component="h1" gutterBottom>
                        {statusInfo.title}
                    </Typography>

                    <Alert
                        severity={statusInfo.color}
                        sx={{ mb: 3, textAlign: 'left' }}
                    >
                        {statusInfo.message}
                    </Alert>

                    {user.role === 'hospital' && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                What happens next?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                1. Super Admin will review your hospital registration<br />
                                2. You will receive an email notification when approved<br />
                                3. You can then access all hospital management features
                            </Typography>
                        </Box>
                    )}

                    {user.role === 'doctor' && user.approvalStatus === 'pending' && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                What happens next?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                1. Hospital Admin will review your doctor registration<br />
                                2. You will receive an email notification when approved<br />
                                3. You can then access all doctor features
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {onRefresh && (
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={onRefresh}
                            >
                                Refresh Status
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            onClick={() => window.location.href = '/login'}
                        >
                            Back to Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ApprovalStatus;
