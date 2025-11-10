import React, { useState, useEffect } from 'react';
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
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Checkbox,
    FormControlLabel,
    Pagination,
    InputAdornment,
    Avatar,
    Card,
    CardContent,
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
    Search as SearchIcon,
    AdminPanelSettings as AdminIcon,
    MedicalServices as MedicalIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
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
import { formatStatus, formatDateTime } from '../../components/dashboard/DataTable';
import { hospitalApi, userApi, analyticsApi } from '../../utils/approvalApi';

const SuperAdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useDashboardData('super_admin');
    const [tabValue, setTabValue] = useState(0);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [hospitalsLoading, setHospitalsLoading] = useState(false);
    const [hospitalsError, setHospitalsError] = useState<string | null>(null);
    const [hospitalsPagination, setHospitalsPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [hospitalFilters, setHospitalFilters] = useState({
        status: '',
        search: ''
    });
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [usersPagination, setUsersPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [userFilters, setUserFilters] = useState({
        role: 'all',
        status: 'all',
        search: ''
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'hospital' | 'user' | 'system'>('hospital');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [viewHospital, setViewHospital] = useState<any>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteUsers, setDeleteUsers] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsPeriod, setAnalyticsPeriod] = useState(30);
    const [editFormData, setEditFormData] = useState<any>({});
    const [addHospitalFormData, setAddHospitalFormData] = useState<any>({
        name: '',
        email: '',
        phone: '',
        type: '',
        website: '',
        description: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
        },
        capacity: {
            beds: 0,
            icuBeds: 0,
            emergencyBeds: 0,
        },
        specialties: [],
        services: [],
        createAdmin: true,
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPassword: '',
        status: 'approved',
    });
    const [addHospitalLoading, setAddHospitalLoading] = useState(false);

    // Fetch hospitals dynamically
    const fetchHospitals = async (page: number = 1, status?: string, search?: string) => {
        setHospitalsLoading(true);
        setHospitalsError(null);
        try {
            const params: any = {
                page,
                limit: hospitalsPagination.limit
            };
            if (status) {
                params.status = status;
            }
            if (search) {
                params.search = search;
            }

            const response = await hospitalApi.getHospitals(params);
            if (response.success) {
                setHospitals(response.data.hospitals || []);
                setHospitalsPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: hospitalsPagination.limit
                });
            }
        } catch (err: any) {
            setHospitalsError(err.response?.data?.message || 'Failed to fetch hospitals');
            // Don't show toast on initial load, only on errors
            if (hospitals.length === 0) {
                toast.error('Failed to fetch hospitals');
            }
        } finally {
            setHospitalsLoading(false);
        }
    };

    // Fetch hospitals on mount and when filters change
    useEffect(() => {
        if (tabValue === 0) { // Only fetch when Hospitals tab is active
            fetchHospitals(
                1,
                hospitalFilters.status || undefined,
                hospitalFilters.search || undefined
            );
        }
    }, [tabValue, hospitalFilters.status]);

    // Debounced search - reset to page 1 when searching
    useEffect(() => {
        if (tabValue === 0) {
            const timeoutId = setTimeout(() => {
                fetchHospitals(
                    1,
                    hospitalFilters.status || undefined,
                    hospitalFilters.search || undefined
                );
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [hospitalFilters.search]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setHospitalsPagination(prev => ({ ...prev, current: page }));
        fetchHospitals(
            page,
            hospitalFilters.status || undefined,
            hospitalFilters.search || undefined
        );
    };

    const handleStatusFilterChange = (status: string) => {
        setHospitalFilters(prev => ({ ...prev, status }));
        setHospitalsPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleSearchChange = (search: string) => {
        setHospitalFilters(prev => ({ ...prev, search }));
        setHospitalsPagination(prev => ({ ...prev, current: 1 }));
    };

    // Fetch users dynamically
    const fetchUsers = async (page: number = 1, role?: string, status?: string, search?: string) => {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const params: any = {
                page,
                limit: usersPagination.limit
            };
            if (role && role !== 'all') {
                params.role = role;
            }
            if (status && status !== 'all') {
                params.status = status;
            }
            if (search) {
                params.search = search;
            }

            const response = await userApi.getUsers(params);
            if (response.success) {
                setUsers(response.data.users || []);
                setUsersPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: usersPagination.limit
                });
            }
        } catch (err: any) {
            setUsersError(err.response?.data?.message || 'Failed to fetch users');
            if (users.length === 0) {
                toast.error('Failed to fetch users');
            }
        } finally {
            setUsersLoading(false);
        }
    };

    // Fetch analytics data
    const fetchAnalytics = async (period: number = 30) => {
        setAnalyticsLoading(true);
        try {
            const [referralTrends, userActivity, systemPerformance] = await Promise.all([
                analyticsApi.getReferralTrends({ period }),
                analyticsApi.getUserActivityPatterns({ period }),
                analyticsApi.getSystemPerformanceMetrics()
            ]);

            setAnalyticsData({
                referralTrends: referralTrends.success ? referralTrends.data : null,
                userActivity: userActivity.success ? userActivity.data : null,
                systemPerformance: systemPerformance.success ? systemPerformance.data : null
            });
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to fetch analytics data');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    // Fetch users on mount and when filters change
    useEffect(() => {
        if (tabValue === 1) { // Only fetch when Users tab is active
            fetchUsers(
                1,
                userFilters.role !== 'all' ? userFilters.role : undefined,
                userFilters.status !== 'all' ? userFilters.status : undefined,
                userFilters.search || undefined
            );
        }
    }, [tabValue, userFilters.role, userFilters.status]);

    // Fetch analytics when Analytics tab is active
    useEffect(() => {
        if (tabValue === 3) { // Analytics tab (assuming it's the 4th tab, index 3)
            fetchAnalytics(analyticsPeriod);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabValue]);

    // Debounced search for users
    useEffect(() => {
        if (tabValue === 1) {
            const timeoutId = setTimeout(() => {
                fetchUsers(
                    1,
                    userFilters.role !== 'all' ? userFilters.role : undefined,
                    userFilters.status !== 'all' ? userFilters.status : undefined,
                    userFilters.search || undefined
                );
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [userFilters.search]);

    const handleUsersPageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setUsersPagination(prev => ({ ...prev, current: page }));
        fetchUsers(
            page,
            userFilters.role !== 'all' ? userFilters.role : undefined,
            userFilters.status !== 'all' ? userFilters.status : undefined,
            userFilters.search || undefined
        );
    };

    const handleUserRoleFilterChange = (role: string) => {
        setUserFilters(prev => ({ ...prev, role }));
        setUsersPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleUserStatusFilterChange = (status: string) => {
        setUserFilters(prev => ({ ...prev, status }));
        setUsersPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleUserSearchChange = (search: string) => {
        setUserFilters(prev => ({ ...prev, search }));
        setUsersPagination(prev => ({ ...prev, current: 1 }));
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <AdminIcon />;
            case 'hospital':
                return <HospitalIcon />;
            case 'doctor':
                return <MedicalIcon />;
            case 'patient':
                return <PersonIcon />;
            default:
                return <PersonIcon />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin':
                return 'error';
            case 'hospital':
                return 'primary';
            case 'doctor':
                return 'success';
            case 'patient':
                return 'info';
            default:
                return 'default';
        }
    };

    const getUserStatusColor = (user: any) => {
        if (!user.isActive) {
            return 'error';
        }
        switch (user.approvalStatus) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const getUserStatusLabel = (user: any) => {
        if (!user.isActive) {
            return 'Inactive';
        }
        switch (user.approvalStatus) {
            case 'approved':
                return 'Active';
            case 'pending':
                return 'Pending';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Unknown';
        }
    };

    const handleOpenDialog = (type: 'hospital' | 'user' | 'system') => {
        setDialogType(type);
        if (type === 'hospital') {
            // Reset form when opening
            setAddHospitalFormData({
                name: '',
                email: '',
                phone: '',
                type: '',
                website: '',
                description: '',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'USA',
                },
                capacity: {
                    beds: 0,
                    icuBeds: 0,
                    emergencyBeds: 0,
                },
                specialties: [],
                services: [],
                createAdmin: true,
                adminFirstName: '',
                adminLastName: '',
                adminEmail: '',
                adminPassword: '',
                status: 'approved',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddHospital = async () => {
        // Basic validation
        if (!addHospitalFormData.name || !addHospitalFormData.type || !addHospitalFormData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!addHospitalFormData.createAdmin && !addHospitalFormData.email) {
            toast.error('Please provide hospital email or create an admin account');
            return;
        }

        if (!addHospitalFormData.address.street || !addHospitalFormData.address.city ||
            !addHospitalFormData.address.state || !addHospitalFormData.address.zipCode) {
            toast.error('Please fill in all address fields');
            return;
        }

        if (addHospitalFormData.capacity.beds < 1) {
            toast.error('Total beds must be at least 1');
            return;
        }

        if (addHospitalFormData.createAdmin) {
            if (!addHospitalFormData.adminFirstName || !addHospitalFormData.adminLastName ||
                !addHospitalFormData.adminEmail || !addHospitalFormData.adminPassword) {
                toast.error('Please fill in all admin account fields');
                return;
            }
            if (addHospitalFormData.adminPassword.length < 6) {
                toast.error('Admin password must be at least 6 characters');
                return;
            }
        }

        setAddHospitalLoading(true);
        try {
            const hospitalData: any = {
                name: addHospitalFormData.name,
                // Email is required - use admin email if creating admin, otherwise use hospital email
                email: addHospitalFormData.createAdmin ? addHospitalFormData.adminEmail : addHospitalFormData.email,
                phone: addHospitalFormData.phone,
                address: addHospitalFormData.address,
                type: addHospitalFormData.type,
                capacity: addHospitalFormData.capacity,
                website: addHospitalFormData.website || undefined,
                description: addHospitalFormData.description || undefined,
                specialties: addHospitalFormData.specialties || [],
                services: addHospitalFormData.services || [],
            };

            // If creating admin user, include admin details
            if (addHospitalFormData.createAdmin) {
                hospitalData.firstName = addHospitalFormData.adminFirstName;
                hospitalData.lastName = addHospitalFormData.adminLastName;
                hospitalData.password = addHospitalFormData.adminPassword;
            }

            // For super admin, we can set status directly
            hospitalData.status = addHospitalFormData.status;

            await hospitalApi.createHospital(hospitalData);
            toast.success('Hospital created successfully');
            setOpenDialog(false);
            refetch?.();
            fetchHospitals(
                hospitalsPagination.current,
                hospitalFilters.status || undefined,
                hospitalFilters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create hospital');
        } finally {
            setAddHospitalLoading(false);
        }
    };

    const handleViewHospital = (hospital: any) => {
        setViewHospital(hospital);
        setOpenViewDialog(true);
    };

    const handleEditHospital = (hospital: any) => {
        setSelectedHospital(hospital);
        setEditFormData({
            name: hospital.name || '',
            email: hospital.email || '',
            phone: hospital.phone || '',
            type: hospital.type || '',
            website: hospital.website || '',
            description: hospital.description || '',
            address: {
                street: hospital.address?.street || '',
                city: hospital.address?.city || '',
                state: hospital.address?.state || '',
                zipCode: hospital.address?.zipCode || '',
                country: hospital.address?.country || 'USA',
            },
            capacity: {
                beds: hospital.capacity?.beds || 0,
                icuBeds: hospital.capacity?.icuBeds || 0,
                emergencyBeds: hospital.capacity?.emergencyBeds || 0,
            },
            specialties: hospital.specialties || [],
            services: hospital.services || [],
        });
        setOpenEditDialog(true);
    };

    const handleDeleteHospital = (hospital: any) => {
        setSelectedHospital(hospital);
        setOpenDeleteDialog(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedHospital) return;

        setEditLoading(true);
        try {
            // Clean up empty strings for optional fields
            const cleanedData = { ...editFormData };
            if (cleanedData.website === '') {
                cleanedData.website = undefined;
            }
            if (cleanedData.description === '') {
                cleanedData.description = undefined;
            }

            await hospitalApi.updateHospital(selectedHospital._id, cleanedData);
            toast.success('Hospital updated successfully');
            setOpenEditDialog(false);
            setSelectedHospital(null);
            refetch?.();
            fetchHospitals(
                hospitalsPagination.current,
                hospitalFilters.status || undefined,
                hospitalFilters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update hospital');
        } finally {
            setEditLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedHospital) return;

        setDeleteLoading(true);
        try {
            await hospitalApi.deleteHospital(selectedHospital._id, deleteUsers);
            toast.success('Hospital deleted successfully');
            setOpenDeleteDialog(false);
            setSelectedHospital(null);
            setDeleteUsers(false);
            refetch?.();
            fetchHospitals(
                hospitalsPagination.current,
                hospitalFilters.status || undefined,
                hospitalFilters.search || undefined
            );
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete hospital';
            const associatedUsersCount = error.response?.data?.associatedUsersCount;

            // If there are associated users and deleteUsers is false, show the option
            if (errorMessage.includes('associated user') && associatedUsersCount && !deleteUsers) {
                // Don't close the dialog, just show the option to delete users
                toast.warning(`Hospital has ${associatedUsersCount} associated user(s). Check the option below to delete them as well.`);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setDeleteLoading(false);
        }
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

    // Prepare stats for StatsGrid - use real data from API
    const statsData = [
        {
            title: 'Total Hospitals',
            value: hospitalsPagination.total || data.stats?.totalHospitals || 0,
            subtitle: `Showing ${hospitals.length} of ${hospitalsPagination.total || 0}`,
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

    // Use hospitals directly from API (backend handles filtering)
    const filteredHospitals = hospitals;

    // Prepare hospital table columns
    const hospitalColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'Hospital Name',
            minWidth: 200,
            format: (value) => value || 'N/A'
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200,
            format: (value) => value || 'N/A'
        },
        {
            id: 'address',
            label: 'Location',
            minWidth: 200,
            format: (value) => {
                if (!value) return 'N/A';
                return `${value.city || ''}, ${value.state || ''}`;
            }
        },
        {
            id: 'type',
            label: 'Type',
            minWidth: 120,
            format: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            format: (value) => formatStatus(value, {
                'approved': 'success',
                'pending': 'warning',
                'rejected': 'error',
                'suspended': 'error'
            })
        },
        {
            id: 'capacity',
            label: 'Capacity',
            minWidth: 120,
            format: (value) => value ? `${value.beds || 0} beds` : 'N/A'
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

    // Prepare user table columns
    const userColumns: TableColumn[] = [
        {
            id: 'name',
            label: 'User',
            minWidth: 200,
            format: (_value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {getRoleIcon(row.role)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2">
                            {row.firstName} {row.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {row.email}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'role',
            label: 'Role',
            minWidth: 120,
            format: (value) => (
                <Chip
                    label={value?.replace('_', ' ').toUpperCase() || 'N/A'}
                    color={getRoleColor(value) as any}
                    size="small"
                />
            )
        },
        {
            id: 'hospitalId',
            label: 'Hospital/Clinic',
            minWidth: 150,
            format: (_value, row) => {
                if (row.hospitalId?.name) return row.hospitalId.name;
                if (row.clinicId?.name) return row.clinicId.name;
                return 'N/A';
            }
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            format: (_value, row) => (
                <Chip
                    label={getUserStatusLabel(row)}
                    color={getUserStatusColor(row) as any}
                    size="small"
                />
            )
        },
        {
            id: 'createdAt',
            label: 'Created',
            minWidth: 120,
            format: (value) => formatDateTime(value)
        }
    ];

    // Prepare user table actions (view only for now)
    const userActions: TableAction[] = [
        {
            icon: <ViewIcon />,
            onClick: (_user: any) => {
                // View user details - can be implemented later
                toast.info('View user details functionality will be implemented');
            },
            tooltip: 'View User'
        }
    ];

    // Prepare tab configurations
    const tabConfigs = [
        {
            label: 'Hospitals',
            content: (
                <Box>
                    {/* Filters and Search */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search hospitals..."
                            variant="outlined"
                            size="small"
                            value={hospitalFilters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 250, flexGrow: 1 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                value={hospitalFilters.status}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                label="Filter by Status"
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                                <MenuItem value="suspended">Suspended</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                            Total: {hospitalsPagination.total} hospitals
                        </Typography>
                    </Box>

                    {/* Hospitals Table */}
                    <DataTable
                        columns={hospitalColumns}
                        data={filteredHospitals}
                        actions={hospitalActions}
                        loading={hospitalsLoading}
                        emptyMessage={hospitalsError || "No hospitals found"}
                    />

                    {/* Pagination */}
                    {hospitalsPagination.pages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={hospitalsPagination.pages}
                                page={hospitalsPagination.current}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </Box>
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
                <Box>
                    {/* Filters and Search */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search users..."
                            variant="outlined"
                            size="small"
                            value={userFilters.search}
                            onChange={(e) => handleUserSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 250, flexGrow: 1 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={userFilters.role}
                                onChange={(e) => handleUserRoleFilterChange(e.target.value)}
                                label="Filter by Role"
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="super_admin">Super Admin</MenuItem>
                                <MenuItem value="hospital">Hospital Admin</MenuItem>
                                <MenuItem value="doctor">Doctor</MenuItem>
                                <MenuItem value="patient">Patient</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                value={userFilters.status}
                                onChange={(e) => handleUserStatusFilterChange(e.target.value)}
                                label="Filter by Status"
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                            Total: {usersPagination.total} users
                        </Typography>
                    </Box>

                    {/* Users Table */}
                    <DataTable
                        columns={userColumns}
                        data={users}
                        actions={userActions}
                        loading={usersLoading}
                        emptyMessage={usersError || "No users found"}
                    />

                    {/* Pagination */}
                    {usersPagination.pages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={usersPagination.pages}
                                page={usersPagination.current}
                                onChange={handleUsersPageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </Box>
            )
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
                <Box>
                    {/* Period Selector */}
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Analytics Dashboard</Typography>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Time Period</InputLabel>
                            <Select
                                value={analyticsPeriod}
                                onChange={(e) => {
                                    setAnalyticsPeriod(e.target.value as number);
                                    fetchAnalytics(e.target.value as number);
                                }}
                                label="Time Period"
                            >
                                <MenuItem value={7}>Last 7 days</MenuItem>
                                <MenuItem value={30}>Last 30 days</MenuItem>
                                <MenuItem value={90}>Last 90 days</MenuItem>
                                <MenuItem value={180}>Last 6 months</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {analyticsLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : analyticsData ? (
                        <Grid container spacing={3}>
                            {/* Referral Trends */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Referral Trends
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mt: 2 }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Total Referrals</Typography>
                                                    <Typography variant="h4">{analyticsData.referralTrends?.totalReferrals || 0}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Completed</Typography>
                                                    <Typography variant="h4" color="success.main">
                                                        {analyticsData.referralTrends?.completedReferrals || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Completion Rate</Typography>
                                                    <Typography variant="h4" color="primary">
                                                        {analyticsData.referralTrends?.completionRate?.toFixed(1) || 0}%
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">By Status</Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {analyticsData.referralTrends?.statusCounts && Object.entries(analyticsData.referralTrends.statusCounts).map(([status, count]: [string, any]) => (
                                                            <Chip key={status} label={`${status}: ${count}`} size="small" sx={{ mr: 1, mb: 1 }} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Top Specialties
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {analyticsData.referralTrends?.specialtyCounts?.slice(0, 5).map((item: any) => (
                                                        <Chip
                                                            key={item.specialty}
                                                            label={`${item.specialty}: ${item.count}`}
                                                            size="small"
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* User Activity Patterns */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            User Activity Patterns
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mt: 2 }}>
                                            <Grid item xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                                                    <Typography variant="h4">{analyticsData.userActivity?.totalUsers || 0}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Active Users</Typography>
                                                    <Typography variant="h4" color="success.main">
                                                        {analyticsData.userActivity?.activeUsers || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Pending Approvals</Typography>
                                                    <Typography variant="h4" color="warning.main">
                                                        {analyticsData.userActivity?.pendingApprovals || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Registrations by Role
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {analyticsData.userActivity?.registrationsByRole && Object.entries(analyticsData.userActivity.registrationsByRole).map(([role, count]: [string, any]) => (
                                                        <Chip
                                                            key={role}
                                                            label={`${role.replace('_', ' ')}: ${count}`}
                                                            size="small"
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* System Performance */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            System Performance
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mt: 2 }}>
                                            <Grid item xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">System Status</Typography>
                                                    <Chip
                                                        label={analyticsData.systemPerformance?.systemHealth?.status || 'Unknown'}
                                                        color={analyticsData.systemPerformance?.systemHealth?.status === 'Healthy' ? 'success' : 'error'}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">Database</Typography>
                                                    <Chip
                                                        label={analyticsData.systemPerformance?.systemHealth?.database || 'Unknown'}
                                                        color={analyticsData.systemPerformance?.systemHealth?.database === 'Connected' ? 'success' : 'error'}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Database Statistics
                                                </Typography>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Users: {analyticsData.systemPerformance?.dbStats?.totalUsers || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Hospitals: {analyticsData.systemPerformance?.dbStats?.totalHospitals || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Referrals: {analyticsData.systemPerformance?.dbStats?.totalReferrals || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Patients: {analyticsData.systemPerformance?.dbStats?.totalPatients || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Monthly Growth
                                                </Typography>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Hospitals: {analyticsData.systemPerformance?.monthlyGrowth?.hospitals || 0}%
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Users: {analyticsData.systemPerformance?.monthlyGrowth?.users || 0}%
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Referrals: {analyticsData.systemPerformance?.monthlyGrowth?.referrals || 0}%
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Recent Activity (24h)
                                                </Typography>
                                                <Box>
                                                    <Typography variant="body2">
                                                        New Users: {analyticsData.systemPerformance?.recentActivity?.newUsers || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        New Hospitals: {analyticsData.systemPerformance?.recentActivity?.newHospitals || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        New Referrals: {analyticsData.systemPerformance?.recentActivity?.newReferrals || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Pending Items
                                                </Typography>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Hospitals: {analyticsData.systemPerformance?.pendingItems?.hospitals || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Users: {analyticsData.systemPerformance?.pendingItems?.users || 0}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Referrals: {analyticsData.systemPerformance?.pendingItems?.referrals || 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    ) : (
                        <Alert severity="info">
                            No analytics data available. Analytics will be displayed here once data is available.
                        </Alert>
                    )}
                </Box>
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

            {/* Add Hospital Dialog */}
            {dialogType === 'hospital' && (
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Hospital</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Hospital Information
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Hospital Name"
                                        value={addHospitalFormData.name}
                                        onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Hospital Type</InputLabel>
                                        <Select
                                            value={addHospitalFormData.type}
                                            onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, type: e.target.value })}
                                            label="Hospital Type"
                                        >
                                            <MenuItem value="public">Public</MenuItem>
                                            <MenuItem value="private">Private</MenuItem>
                                            <MenuItem value="non-profit">Non-Profit</MenuItem>
                                            <MenuItem value="government">Government</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={addHospitalFormData.phone}
                                        onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, phone: e.target.value })}
                                        required
                                    />
                                </Grid>
                                {!addHospitalFormData.createAdmin && (
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Hospital Email"
                                            type="email"
                                            value={addHospitalFormData.email}
                                            onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, email: e.target.value })}
                                            required={!addHospitalFormData.createAdmin}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Website (Optional)"
                                        value={addHospitalFormData.website}
                                        onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, website: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Street Address"
                                        value={addHospitalFormData.address.street}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            address: { ...addHospitalFormData.address, street: e.target.value }
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        value={addHospitalFormData.address.city}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            address: { ...addHospitalFormData.address, city: e.target.value }
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        value={addHospitalFormData.address.state}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            address: { ...addHospitalFormData.address, state: e.target.value }
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="ZIP Code"
                                        value={addHospitalFormData.address.zipCode}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            address: { ...addHospitalFormData.address, zipCode: e.target.value }
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Country"
                                        value={addHospitalFormData.address.country}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            address: { ...addHospitalFormData.address, country: e.target.value }
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Total Beds"
                                        type="number"
                                        value={addHospitalFormData.capacity.beds}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            capacity: { ...addHospitalFormData.capacity, beds: parseInt(e.target.value) || 0 }
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="ICU Beds"
                                        type="number"
                                        value={addHospitalFormData.capacity.icuBeds}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            capacity: { ...addHospitalFormData.capacity, icuBeds: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Emergency Beds"
                                        type="number"
                                        value={addHospitalFormData.capacity.emergencyBeds}
                                        onChange={(e) => setAddHospitalFormData({
                                            ...addHospitalFormData,
                                            capacity: { ...addHospitalFormData.capacity, emergencyBeds: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={addHospitalFormData.status}
                                            onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, status: e.target.value })}
                                            label="Status"
                                        >
                                            <MenuItem value="approved">Approved</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description (Optional)"
                                        multiline
                                        rows={3}
                                        value={addHospitalFormData.description}
                                        onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, description: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Hospital Administrator (Optional)
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={addHospitalFormData.createAdmin}
                                                onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, createAdmin: e.target.checked })}
                                            />
                                        }
                                        label="Create hospital administrator account"
                                    />
                                </Grid>
                                {addHospitalFormData.createAdmin && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Admin First Name"
                                                value={addHospitalFormData.adminFirstName}
                                                onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, adminFirstName: e.target.value })}
                                                required={addHospitalFormData.createAdmin}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Admin Last Name"
                                                value={addHospitalFormData.adminLastName}
                                                onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, adminLastName: e.target.value })}
                                                required={addHospitalFormData.createAdmin}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Admin Email"
                                                type="email"
                                                value={addHospitalFormData.adminEmail}
                                                onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, adminEmail: e.target.value })}
                                                required={addHospitalFormData.createAdmin}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Admin Password"
                                                type="password"
                                                value={addHospitalFormData.adminPassword}
                                                onChange={(e) => setAddHospitalFormData({ ...addHospitalFormData, adminPassword: e.target.value })}
                                                required={addHospitalFormData.createAdmin}
                                                helperText="Minimum 6 characters"
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} disabled={addHospitalLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddHospital}
                            disabled={addHospitalLoading}
                        >
                            {addHospitalLoading ? <CircularProgress size={24} /> : 'Create Hospital'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Other Dialogs */}
            {dialogType !== 'hospital' && (
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
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
            )}

            {/* Edit Hospital Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Hospital</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Hospital Name"
                                    value={editFormData.name || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={editFormData.email || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={editFormData.phone || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Hospital Type</InputLabel>
                                    <Select
                                        value={editFormData.type || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                                        label="Hospital Type"
                                    >
                                        <MenuItem value="public">Public</MenuItem>
                                        <MenuItem value="private">Private</MenuItem>
                                        <MenuItem value="non-profit">Non-Profit</MenuItem>
                                        <MenuItem value="government">Government</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    value={editFormData.address?.street || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        address: { ...editFormData.address, street: e.target.value }
                                    })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={editFormData.address?.city || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        address: { ...editFormData.address, city: e.target.value }
                                    })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={editFormData.address?.state || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        address: { ...editFormData.address, state: e.target.value }
                                    })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    value={editFormData.address?.zipCode || ''}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        address: { ...editFormData.address, zipCode: e.target.value }
                                    })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Website (Optional)"
                                    value={editFormData.website || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value || undefined })}
                                    helperText="Leave empty to remove website"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Total Beds"
                                    type="number"
                                    value={editFormData.capacity?.beds || 0}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        capacity: { ...editFormData.capacity, beds: parseInt(e.target.value) || 0 }
                                    })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label="ICU Beds"
                                    type="number"
                                    value={editFormData.capacity?.icuBeds || 0}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        capacity: { ...editFormData.capacity, icuBeds: parseInt(e.target.value) || 0 }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Emergency Beds"
                                    type="number"
                                    value={editFormData.capacity?.emergencyBeds || 0}
                                    onChange={(e) => setEditFormData({
                                        ...editFormData,
                                        capacity: { ...editFormData.capacity, emergencyBeds: parseInt(e.target.value) || 0 }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={editFormData.description || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} disabled={editLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        disabled={editLoading}
                    >
                        {editLoading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => {
                setOpenDeleteDialog(false);
                setDeleteUsers(false);
            }}>
                <DialogTitle>Delete Hospital</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Are you sure you want to delete <strong>{selectedHospital?.name}</strong>? This action cannot be undone.
                    </Alert>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            If this hospital has associated users (doctors or administrators), you can choose to delete them as well.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={deleteUsers}
                                        onChange={(e) => setDeleteUsers(e.target.checked)}
                                        color="error"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        Also delete all associated users (doctors and administrators)
                                    </Typography>
                                }
                            />
                        </Box>
                        {deleteUsers && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                Warning: This will permanently delete all users associated with this hospital, including doctors and administrators.
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDeleteDialog(false);
                            setDeleteUsers(false);
                        }}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Hospital Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Hospital Details</DialogTitle>
                <DialogContent>
                    {viewHospital && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        {viewHospital.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {viewHospital.email || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Phone
                                    </Typography>
                                    <Typography variant="body1">
                                        {viewHospital.phone || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Hospital Type
                                    </Typography>
                                    <Typography variant="body1" textTransform="capitalize">
                                        {viewHospital.type || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={viewHospital.status || 'N/A'}
                                        color={
                                            viewHospital.status === 'approved' ? 'success' :
                                                viewHospital.status === 'pending' ? 'warning' :
                                                    viewHospital.status === 'rejected' ? 'error' : 'default'
                                        }
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {viewHospital.address ? (
                                            `${viewHospital.address.street || ''}, ${viewHospital.address.city || ''}, ${viewHospital.address.state || ''} ${viewHospital.address.zipCode || ''}, ${viewHospital.address.country || ''}`
                                        ) : 'N/A'}
                                    </Typography>
                                </Grid>
                                {viewHospital.website && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Website
                                        </Typography>
                                        <Typography variant="body1">
                                            <a href={viewHospital.website} target="_blank" rel="noopener noreferrer">
                                                {viewHospital.website}
                                            </a>
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Beds
                                    </Typography>
                                    <Typography variant="body1">
                                        {viewHospital.capacity?.beds || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        ICU Beds
                                    </Typography>
                                    <Typography variant="body1">
                                        {viewHospital.capacity?.icuBeds || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Emergency Beds
                                    </Typography>
                                    <Typography variant="body1">
                                        {viewHospital.capacity?.emergencyBeds || 0}
                                    </Typography>
                                </Grid>
                                {viewHospital.specialties && viewHospital.specialties.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Specialties
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {viewHospital.specialties.map((specialty: string, index: number) => (
                                                <Chip key={index} label={specialty} size="small" />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                                {viewHospital.services && viewHospital.services.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Services
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {viewHospital.services.map((service: string, index: number) => (
                                                <Chip key={index} label={service} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                                {viewHospital.description && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Description
                                        </Typography>
                                        <Typography variant="body1">
                                            {viewHospital.description}
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Created At
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDateTime(viewHospital.createdAt)}
                                    </Typography>
                                </Grid>
                                {viewHospital.updatedAt && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Last Updated
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDateTime(viewHospital.updatedAt)}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SuperAdminDashboard;
