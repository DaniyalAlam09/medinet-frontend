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
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    MedicalServices as MedicalServicesIcon,
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

const HospitalDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('hospital');
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'doctor' | 'referral' | 'patient'>('doctor');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type: 'doctor' | 'referral' | 'patient') => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleViewDoctor = (doctor: any) => {
        console.log('View doctor:', doctor);
        // Implement view doctor logic
    };

    const handleEditDoctor = (doctor: any) => {
        console.log('Edit doctor:', doctor);
        // Implement edit doctor logic
    };

    const handleDeleteDoctor = (doctor: any) => {
        console.log('Delete doctor:', doctor);
        // Implement delete doctor logic
    };

    const handleViewReferral = (referral: any) => {
        console.log('View referral:', referral);
        // Implement view referral logic
    };

    const handleEditReferral = (referral: any) => {
        console.log('Edit referral:', referral);
        // Implement edit referral logic
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
            title: 'Doctors',
            value: data.stats?.totalDoctors || 0,
            subtitle: `${data.doctors?.filter((d: any) => d.status === 'Active').length || 0} active`,
            icon: <MedicalServicesIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.doctors || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.doctors || 0) >= 0
            }
        },
        {
            title: 'Patients',
            value: data.stats?.totalPatients || 0,
            subtitle: `+${data.stats?.todayAppointments || 0} today`,
            icon: <PeopleIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.patients || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.patients || 0) >= 0
            }
        },
        {
            title: 'Referrals',
            value: data.stats?.totalReferrals || 0,
            subtitle: `${data.stats?.pendingReferrals || 0} pending`,
            icon: <AssignmentIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.referrals || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.referrals || 0) >= 0
            }
        },
        {
            title: 'System Status',
            value: data.stats?.systemStatus || 'Unknown',
            subtitle: 'All systems operational',
            icon: <HospitalIcon />,
            color: (data.stats?.systemStatus === 'Operational' ? 'success' : 'error') as 'success' | 'error',
            chip: {
                label: data.stats?.systemStatus || 'Unknown',
                color: (data.stats?.systemStatus === 'Operational' ? 'success' : 'error') as 'success' | 'error',
                icon: <CheckCircleIcon />
            }
        }
    ];

    // Prepare doctor table columns
    const doctorColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Doctor',
            minWidth: 200,
            format: (_value, row) => formatAvatar(`Dr. ${row.firstName} ${row.lastName}`, row.profileImage)
        },
        {
            id: 'specialization',
            label: 'Specialization',
            minWidth: 150,
            format: (value) => <Chip label={value} size="small" />
        },
        {
            id: 'licenseNumber',
            label: 'License',
            minWidth: 120
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'Active': 'success',
                'On Leave': 'error',
                'Pending': 'warning'
            })
        },
        {
            id: 'yearsOfExperience',
            label: 'Experience',
            minWidth: 100,
            format: (value) => `${value} years`
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200
        }
    ];

    // Prepare doctor table actions
    const doctorActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewDoctor,
            tooltip: 'View Doctor'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditDoctor,
            tooltip: 'Edit Doctor'
        },
        {
            icon: <DeleteIcon />,
            onClick: handleDeleteDoctor,
            color: 'error',
            tooltip: 'Delete Doctor'
        }
    ];

    // Prepare referral table columns
    const referralColumns: TableColumn[] = [
        {
            id: 'patientId',
            label: 'Patient',
            minWidth: 150,
            format: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'fromDoctor',
            label: 'From Doctor',
            minWidth: 150,
            format: (value) => value ? `Dr. ${value.firstName} ${value.lastName}` : 'N/A'
        },
        {
            id: 'toHospital',
            label: 'To Hospital',
            minWidth: 150,
            format: (value) => value?.name || 'N/A'
        },
        {
            id: 'specialty',
            label: 'Specialty',
            minWidth: 120,
            format: (value) => <Chip label={value} size="small" />
        },
        {
            id: 'priority',
            label: 'Priority',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'High': 'error',
                'Medium': 'warning',
                'Low': 'success'
            })
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'Completed': 'success',
                'Pending': 'warning',
                'In Progress': 'info',
                'Cancelled': 'error'
            })
        },
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        }
    ];

    // Prepare referral table actions
    const referralActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewReferral,
            tooltip: 'View Referral'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditReferral,
            tooltip: 'Edit Referral'
        }
    ];

    // Prepare tab configurations
    const tabConfigs = [
        {
            label: 'Doctors',
            content: (
                <DataTable
                    columns={doctorColumns}
                    data={data.doctors || []}
                    actions={doctorActions}
                    loading={loading}
                    emptyMessage="No doctors found"
                />
            ),
            actionButton: {
                label: 'Add Doctor',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('doctor')
            }
        },
        {
            label: 'Referrals',
            content: (
                <DataTable
                    columns={referralColumns}
                    data={data.referrals || []}
                    actions={referralActions}
                    loading={loading}
                    emptyMessage="No referrals found"
                />
            ),
            actionButton: {
                label: 'Create Referral',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('referral')
            }
        },
        {
            label: 'Patients',
            content: (
                <Alert severity="info">
                    Patient management features will be implemented here. This includes patient registration, medical records, and appointment scheduling.
                </Alert>
            ),
            actionButton: {
                label: 'Add Patient',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('patient')
            }
        },
        {
            label: 'Analytics',
            content: (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ActivityFeed
                        activities={data.activities || []}
                        loading={loading}
                        title="Hospital Activities"
                        maxItems={5}
                        sx={{ flex: 1 }}
                    />
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Hospital Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {data.stats?.hospitalName || 'Hospital'} • Welcome back, {user?.firstName} {user?.lastName}
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
                    {dialogType === 'doctor' && 'Add New Doctor'}
                    {dialogType === 'referral' && 'Create New Referral'}
                    {dialogType === 'patient' && 'Add New Patient'}
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

export default HospitalDashboard;
