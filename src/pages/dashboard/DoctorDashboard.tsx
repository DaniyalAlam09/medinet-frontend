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
    Visibility as ViewIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Assessment as AssessmentIcon,
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

const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error } = useDashboardData('doctor');
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'patient' | 'referral' | 'appointment'>('patient');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type: 'patient' | 'referral' | 'appointment') => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleViewPatient = (patient: any) => {
        console.log('View patient:', patient);
        // Implement view patient logic
    };

    const handleEditPatient = (patient: any) => {
        console.log('Edit patient:', patient);
        // Implement edit patient logic
    };

    const handleViewAppointment = (appointment: any) => {
        console.log('View appointment:', appointment);
        // Implement view appointment logic
    };

    const handleEditAppointment = (appointment: any) => {
        console.log('Edit appointment:', appointment);
        // Implement edit appointment logic
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
            title: 'My Patients',
            value: data.stats?.totalPatients || 0,
            subtitle: `${data.patients?.filter((p: any) => p.status === 'Active').length || 0} active`,
            icon: <PeopleIcon />,
            color: 'primary' as const,
            trend: {
                value: data.stats?.monthlyGrowth?.patients || 0,
                label: 'vs last month',
                isPositive: (data.stats?.monthlyGrowth?.patients || 0) >= 0
            }
        },
        {
            title: 'Today\'s Appointments',
            value: data.stats?.todayAppointments || 0,
            subtitle: `${data.appointments?.filter((a: any) => a.status === 'Scheduled').length || 0} scheduled`,
            icon: <ScheduleIcon />,
            color: 'primary' as const
        },
        {
            title: 'Referrals',
            value: data.stats?.thisMonthReferrals || 0,
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
            title: 'Rating',
            value: `${data.stats?.averageRating || 0}/5`,
            subtitle: 'Patient satisfaction',
            icon: <AssessmentIcon />,
            color: 'primary' as const,
            progress: {
                value: (data.stats?.averageRating || 0) * 20,
                label: `Based on ${data.stats?.totalPatients || 0} reviews`
            }
        }
    ];

    // Prepare patient table columns
    const patientColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Patient',
            minWidth: 200,
            format: (_value, row) => formatAvatar(`${row.firstName} ${row.lastName}`, row.profileImage)
        },
        {
            id: 'age',
            label: 'Age/Gender',
            minWidth: 120,
            format: (value, row) => `${value} / ${row.gender}`
        },
        {
            id: 'condition',
            label: 'Condition',
            minWidth: 150,
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
                'Active': 'success',
                'Discharged': 'error',
                'Pending': 'warning'
            })
        },
        {
            id: 'lastVisit',
            label: 'Last Visit',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        },
        {
            id: 'nextAppointment',
            label: 'Next Appointment',
            minWidth: 150,
            format: (value) => value ? formatDateTime(value) : 'Not scheduled'
        }
    ];

    // Prepare patient table actions
    const patientActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewPatient,
            tooltip: 'View Patient'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditPatient,
            tooltip: 'Edit Patient'
        }
    ];

    // Prepare appointment table columns
    const appointmentColumns: TableColumn[] = [
        {
            id: 'time',
            label: 'Time',
            minWidth: 100,
            format: (value, row) => (
                <Box>
                    <Typography variant="subtitle2">{value}</Typography>
                    <Typography variant="body2" color="text.secondary">{row.date}</Typography>
                </Box>
            )
        },
        {
            id: 'patientName',
            label: 'Patient',
            minWidth: 150
        },
        {
            id: 'type',
            label: 'Type',
            minWidth: 120,
            format: (value) => <Chip label={value} size="small" />
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (value) => formatStatus(value, {
                'Scheduled': 'success',
                'Completed': 'info',
                'Cancelled': 'error'
            })
        },
        {
            id: 'notes',
            label: 'Notes',
            minWidth: 200
        }
    ];

    // Prepare appointment table actions
    const appointmentActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: handleViewAppointment,
            tooltip: 'View Appointment'
        },
        {
            icon: <EditIcon />,
            onClick: handleEditAppointment,
            tooltip: 'Edit Appointment'
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
                'Approved': 'success',
                'Pending': 'warning',
                'Rejected': 'error'
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
            label: 'My Patients',
            content: (
                <DataTable
                    columns={patientColumns}
                    data={data.patients || []}
                    actions={patientActions}
                    loading={loading}
                    emptyMessage="No patients found"
                />
            ),
            actionButton: {
                label: 'Add Patient',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('patient')
            }
        },
        {
            label: 'Appointments',
            content: (
                <DataTable
                    columns={appointmentColumns}
                    data={data.appointments || []}
                    actions={appointmentActions}
                    loading={loading}
                    emptyMessage="No appointments found"
                />
            ),
            actionButton: {
                label: 'Schedule Appointment',
                icon: <AddIcon />,
                onClick: () => handleOpenDialog('appointment')
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
            label: 'Analytics',
            content: (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ActivityFeed
                        activities={data.activities || []}
                        loading={loading}
                        title="My Activities"
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
                    Doctor Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {data.stats?.doctorName || 'Dr. Unknown'} • {data.stats?.specialization || 'Specialization'} • Welcome back, {user?.firstName} {user?.lastName}
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
                    {dialogType === 'patient' && 'Add New Patient'}
                    {dialogType === 'referral' && 'Create New Referral'}
                    {dialogType === 'appointment' && 'Schedule Appointment'}
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

export default DoctorDashboard;
