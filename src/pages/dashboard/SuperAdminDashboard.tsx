import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Button,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import {
    StatsGrid,
    DataTable,
    ActivityFeed,
    DashboardTabs,
    TableColumn,
    TableAction
} from '../../components/dashboard';
import { formatStatus, formatAvatar, formatDateTime } from '../../components/dashboard/DataTable';

const SuperAdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('super_admin');
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'hospital' | 'user' | 'system'>('hospital');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type: 'hospital' | 'user' | 'system') => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleViewHospital = (hospital: any) => {
        console.log('View hospital:', hospital);
        // Implement view hospital logic
    };

    const handleEditHospital = (hospital: any) => {
        console.log('Edit hospital:', hospital);
        // Implement edit hospital logic
    };

    const handleDeleteHospital = (hospital: any) => {
        console.log('Delete hospital:', hospital);
        // Implement delete hospital logic
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading dashboard...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!data) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="warning">
                    No data available
                </Alert>
            </Container>
        );
    }

    // Prepare stats for StatsGrid
    const statsData = [
        {
            title: 'Total Hospitals',
            value: data.stats?.totalHospitals || 0,
            subtitle: `+${data.stats?.monthlyGrowth?.hospitals || 0} this month`,
            icon: <HospitalIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.hospitals || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.hospitals || 0) >= 0
            }
        },
        {
            title: 'Total Users',
            value: data.stats?.totalUsers || 0,
            subtitle: `+${data.stats?.monthlyGrowth?.users || 0} this month`,
            icon: <PeopleIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.users || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.users || 0) >= 0
            }
        },
        {
            title: 'Total Referrals',
            value: data.stats?.totalReferrals || 0,
            subtitle: `${data.stats?.activeReferrals || 0} active`,
            icon: <AssignmentIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.referrals || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.referrals || 0) >= 0
            }
        },
        {
            title: 'System Health',
            value: data.stats?.systemHealth?.status || 'Unknown',
            subtitle: `Last backup: ${formatDateTime(data.stats?.lastBackup || new Date())}`,
            icon: <SecurityIcon />,
            color: (data.stats?.systemHealth?.status === 'Healthy' ? 'success' : 'error') as 'success' | 'error',
            chip: {
                label: data.stats?.systemHealth?.status || 'Unknown',
                color: (data.stats?.systemHealth?.status === 'Healthy' ? 'success' : 'error') as 'success' | 'error',
                icon: <CheckCircleIcon />
            }
        }
    ];

    // Prepare hospital table columns
    const hospitalColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Hospital Name',
            minWidth: 200,
            format: (value, row) => formatAvatar(value, row.logo)
        },
        {
            id: 'location',
            label: 'Location',
            minWidth: 150
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'Active': 'success',
                'Maintenance': 'warning',
                'Inactive': 'error'
            })
        },
        {
            id: 'adminId',
            label: 'Admin',
            minWidth: 150,
            format: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'createdAt',
            label: 'Registered',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        }
    ];

    // Prepare hospital table actions
    const hospitalActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewHospital,
            tooltip: 'View Hospital'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditHospital,
            tooltip: 'Edit Hospital'
        },
        {
            icon: <DeleteIcon />,
            onClick: handleDeleteHospital,
            color: 'error',
            tooltip: 'Delete Hospital'
        }
    ];

    // Prepare tab configurations
    const tabConfigs = [
        {
            label: 'Hospitals',
            content: (
                <DataTable
                    columns={hospitalColumns}
                    data={data.hospitals || []}
                    actions={hospitalActions}
                    loading={loading}
                    emptyMessage="No hospitals found"
                />
            ),
            actionButton: {
                label: 'Add Hospital',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('hospital')
            }
        },
        {
            label: 'Users',
            content: (
                <Alert severity="info">
                    User management features will be implemented here. This includes creating, editing, and managing user accounts across all hospitals.
                </Alert>
            ),
            actionButton: {
                label: 'Add User',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('user')
            }
        },
        {
            label: 'System',
            content: (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ActivityFeed
                        activities={data.activities || []}
                        loading={loading}
                        title="System Activities"
                        maxItems={5}
                        sx={{ flex: 1 }}
                    />
                </Box>
            )
        },
        {
            label: 'Analytics',
            content: (
                <Alert severity="info">
                    Advanced analytics and reporting features will be implemented here. This includes referral trends, user activity patterns, and system performance metrics.
                </Alert>
            )
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Super Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Welcome back, {user?.firstName} {user?.lastName}
                </Typography>
            </Box>

            {/* Quick Stats */}
            <StatsGrid
                stats={statsData}
                loading={loading}
                sx={{ mb: 4 }}
            />

            {/* Main Content Tabs */}
            <DashboardTabs
                tabs={tabConfigs}
                value={tabValue}
                onChange={handleTabChange}
                loading={loading}
            />

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'hospital' && 'Add New Hospital'}
                    {dialogType === 'user' && 'Add New User'}
                    {dialogType === 'system' && 'System Configuration'}
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        This dialog will be implemented with proper form fields based on the selected type.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SuperAdminDashboard;
