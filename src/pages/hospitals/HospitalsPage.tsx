import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Chip,
    Avatar,
    useTheme,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {
    LocalHospital,
    Add,
    Search,
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Phone,
    Email,
    LocationOn,
    Hotel,
    LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { hospitalApi } from '../../utils/approvalApi';

const HospitalsPage: React.FC = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 12
    });
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
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
    const [editLoading, setEditLoading] = useState(false);
    const [addHospitalLoading, setAddHospitalLoading] = useState(false);
    const [deleteUsers, setDeleteUsers] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch hospitals dynamically
    const fetchHospitals = async (page: number = 1, status?: string, search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: pagination.limit
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
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: pagination.limit
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch hospitals');
            toast.error('Failed to fetch hospitals');
        } finally {
            setLoading(false);
        }
    };

    // Fetch hospitals on mount and when filters change
    useEffect(() => {
        fetchHospitals(
            1,
            filters.status || undefined,
            filters.search || undefined
        );
    }, [filters.status]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchHospitals(
                1,
                filters.status || undefined,
                filters.search || undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters.search]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchHospitals(
            page,
            filters.status || undefined,
            filters.search || undefined
        );
    };

    const handleStatusFilterChange = (status: string) => {
        setFilters(prev => ({ ...prev, status }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleSearchChange = (search: string) => {
        setFilters(prev => ({ ...prev, search }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleViewHospital = (hospital: any) => {
        setSelectedHospital(hospital);
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
            fetchHospitals(
                pagination.current,
                filters.status || undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update hospital');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteHospital = (hospital: any) => {
        setSelectedHospital(hospital);
        setOpenDeleteDialog(true);
    };

    const handleOpenAddDialog = () => {
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
        setOpenAddDialog(true);
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
            setOpenAddDialog(false);
            fetchHospitals(
                pagination.current,
                filters.status || undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create hospital');
        } finally {
            setAddHospitalLoading(false);
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
            fetchHospitals(
                pagination.current,
                filters.status || undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete hospital';
            const associatedUsersCount = error.response?.data?.associatedUsersCount;
            if (errorMessage.includes('associated user') && associatedUsersCount && !deleteUsers) {
                toast.warning(`Hospital has ${associatedUsersCount} associated user(s). Check the option to delete them as well.`);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
            case 'suspended':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'public':
                return 'primary';
            case 'private':
                return 'secondary';
            case 'non-profit':
                return 'info';
            case 'government':
                return 'success';
            default:
                return 'default';
        }
    };

    // Calculate stats
    const stats = {
        total: pagination.total,
        active: hospitals.filter(h => h.status === 'approved').length,
        pending: hospitals.filter(h => h.status === 'pending').length,
    };

    if (loading && hospitals.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Hospital Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage hospitals, view statistics, and oversee operations
                    </Typography>
                </Box>
                {user?.role === 'super_admin' && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ minWidth: 140 }}
                        onClick={handleOpenAddDialog}
                    >
                        Add Hospital
                    </Button>
                )}
            </Box>

            {/* Search and Filter */}
            <Box display="flex" gap={2} mb={4} flexWrap="wrap">
                <TextField
                    placeholder="Search hospitals..."
                    variant="outlined"
                    size="small"
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 250, flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                        value={filters.status}
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
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Hospitals
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.total}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <LocalHospital />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Approved Hospitals
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.active}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <LocalHospital />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Pending Approval
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.pending}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <LocalHospital />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Showing
                                    </Typography>
                                    <Typography variant="h4">
                                        {hospitals.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        of {stats.total}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <LocalHospital />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Hospitals List */}
            <Typography variant="h5" component="h2" gutterBottom mb={3}>
                Hospital Directory
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {hospitals.map((hospital) => (
                            <Grid item xs={12} md={6} lg={4} key={hospital._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 24px -8px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    {/* Header with gradient */}
                                    <Box
                                        sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            color: 'white',
                                            p: 3,
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -50,
                                                right: -50,
                                                width: 150,
                                                height: 150,
                                                borderRadius: '50%',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                            }}
                                        />
                                        <Box display="flex" alignItems="flex-start" justifyContent="space-between" position="relative" zIndex={1}>
                                            <Box display="flex" alignItems="center" gap={2} flex={1}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                        width: 56,
                                                        height: 56,
                                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                                    }}
                                                >
                                                    <HospitalIcon sx={{ fontSize: 32 }} />
                                                </Avatar>
                                                <Box flex={1} minWidth={0}>
                                                    <Typography
                                                        variant="h6"
                                                        component="h3"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 0.5,
                                                            color: 'white',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {hospital.name}
                                                    </Typography>
                                                    <Box display="flex" gap={1} flexWrap="wrap">
                                                        <Chip
                                                            label={hospital.type ? hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1).replace('-', ' ') : 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(255, 255, 255, 0.25)',
                                                                color: 'white',
                                                                fontWeight: 500,
                                                                backdropFilter: 'blur(10px)',
                                                            }}
                                                        />
                                                        <Chip
                                                            label={hospital.status ? hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1) : 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: hospital.status === 'approved'
                                                                    ? 'rgba(76, 175, 80, 0.9)'
                                                                    : hospital.status === 'pending'
                                                                        ? 'rgba(255, 152, 0, 0.9)'
                                                                        : 'rgba(244, 67, 54, 0.9)',
                                                                color: 'white',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        {/* Contact Information */}
                                        <Box sx={{ mb: 2.5 }}>
                                            {hospital.email && (
                                                <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                                                    <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {hospital.email}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {hospital.phone && (
                                                <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                                                    <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {hospital.phone}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {hospital.address && (
                                                <Box display="flex" alignItems="flex-start" gap={1.5} mb={1.5}>
                                                    <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mt: 0.25 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {hospital.address.city || ''}{hospital.address.city && hospital.address.state ? ', ' : ''}{hospital.address.state || ''}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Divider */}
                                        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, my: 2 }} />

                                        {/* Capacity Information */}
                                        <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    flex: 1,
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                                }}
                                            >
                                                <Hotel sx={{ fontSize: 20, color: 'primary.main' }} />
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                        {hospital.capacity?.beds || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Total Beds
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {hospital.capacity?.icuBeds > 0 && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        flex: 1,
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                                    }}
                                                >
                                                    <LocalHospital sx={{ fontSize: 20, color: 'error.main' }} />
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                            {hospital.capacity.icuBeds}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ICU Beds
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Specialties */}
                                        {hospital.specialties && hospital.specialties.length > 0 && (
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                        mb: 1,
                                                        display: 'block',
                                                    }}
                                                >
                                                    Specialties
                                                </Typography>
                                                <Box display="flex" flexWrap="wrap" gap={0.75}>
                                                    {hospital.specialties.slice(0, 3).map((specialty: string, index: number) => (
                                                        <Chip
                                                            key={index}
                                                            label={specialty}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: theme.palette.primary.main,
                                                                color: theme.palette.primary.main,
                                                                '&:hover': {
                                                                    bgcolor: theme.palette.primary.main,
                                                                    color: 'white',
                                                                },
                                                            }}
                                                        />
                                                    ))}
                                                    {hospital.specialties.length > 3 && (
                                                        <Chip
                                                            label={`+${hospital.specialties.length - 3} more`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: theme.palette.text.secondary,
                                                                color: theme.palette.text.secondary,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>

                                    {/* Action Buttons */}
                                    <CardActions
                                        sx={{
                                            p: 2,
                                            pt: 0,
                                            gap: 1,
                                            flexWrap: 'wrap',
                                            borderTop: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<Visibility />}
                                            onClick={() => handleViewHospital(hospital)}
                                            sx={{
                                                flex: 1,
                                                minWidth: 100,
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        {user?.role === 'super_admin' && (
                                            <>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleEditHospital(hospital)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => handleDeleteHospital(hospital)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={pagination.pages}
                                page={pagination.current}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Empty State */}
            {!loading && hospitals.length === 0 && (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Avatar sx={{ bgcolor: 'grey.100', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                            <LocalHospital sx={{ fontSize: 32, color: 'grey.500' }} />
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                            No hospitals found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {filters.search || filters.status
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by adding your first hospital to the system.'}
                        </Typography>
                        {user?.role === 'super_admin' && !filters.search && !filters.status && (
                            <Button variant="contained" startIcon={<Add />} onClick={handleOpenAddDialog}>
                                Add Hospital
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* View Hospital Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Hospital Details
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenViewDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <MoreVert />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedHospital && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedHospital.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.email || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Phone
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.phone || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.address
                                            ? `${selectedHospital.address.street || ''}, ${selectedHospital.address.city || ''}, ${selectedHospital.address.state || ''} ${selectedHospital.address.zipCode || ''}`
                                            : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Type
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.type ? selectedHospital.type.charAt(0).toUpperCase() + selectedHospital.type.slice(1) : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={selectedHospital.status ? selectedHospital.status.charAt(0).toUpperCase() + selectedHospital.status.slice(1) : 'N/A'}
                                        color={getStatusColor(selectedHospital.status) as any}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Beds
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.capacity?.beds || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        ICU Beds
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.capacity?.icuBeds || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Emergency Beds
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedHospital.capacity?.emergencyBeds || 0}
                                    </Typography>
                                </Grid>
                                {selectedHospital.specialties && selectedHospital.specialties.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Specialties
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                            {selectedHospital.specialties.map((specialty: string, index: number) => (
                                                <Chip key={index} label={specialty} size="small" />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                                {selectedHospital.description && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Description
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedHospital.description}
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

            {/* Add Hospital Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
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
                    <Button onClick={() => setOpenAddDialog(false)} disabled={addHospitalLoading}>
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
                            <Box display="flex" alignItems="center">
                                <input
                                    type="checkbox"
                                    checked={deleteUsers}
                                    onChange={(e) => setDeleteUsers(e.target.checked)}
                                    style={{ marginRight: 8, cursor: 'pointer' }}
                                />
                                <Typography variant="body2">
                                    Also delete all associated users (doctors and administrators)
                                </Typography>
                            </Box>
                        </Box>
                        {deleteUsers && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                Warning: This will permanently delete all users associated with this hospital.
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
        </Box>
    );
};

export default HospitalsPage;
