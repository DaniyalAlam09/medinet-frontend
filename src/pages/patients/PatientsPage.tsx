import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Avatar,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
} from '@mui/material';
import {
    People,
    Add,
    Search,
    MoreVert,
    Person,
    LocalHospital,
    Assignment,
    Phone,
    Email,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { patientApi, hospitalApi } from '../../utils/approvalApi';
import { formatDateTime } from '../../components/dashboard/DataTable';
import { useAuth } from '../../hooks/useAuth';
import { Hospital } from '../../types/hospital';

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [viewType, setViewType] = useState<'profile' | 'referrals' | 'medical-history'>('profile');
    const [viewData, setViewData] = useState<any>(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        hospitalId: user?.hospitalId || '',
        bloodType: '',
        allergies: [],
        chronicConditions: [],
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
        }
    });

    // Fetch patients dynamically
    const fetchPatients = async (page: number = 1, status?: string, search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: pagination.limit
            };
            if (status && status !== 'all') {
                params.status = status;
            }
            if (search) {
                params.search = search;
            }

            const response = await patientApi.getPatients(params);
            if (response.success) {
                setPatients(response.data.patients || []);
                setStats(response.data.stats || null);
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: pagination.limit
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch patients');
            if (patients.length === 0) {
                toast.error('Failed to fetch patients');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch patients on mount and when filters change
    useEffect(() => {
        fetchPatients(
            1,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.status]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPatients(
                1,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    // Load hospitals for dropdown
    useEffect(() => {
        const loadHospitals = async () => {
            try {
                setLoadingHospitals(true);
                const response = await hospitalApi.getApprovedHospitals();
                setHospitals(response.data);
            } catch (error) {
                console.error('Error loading hospitals:', error);
            } finally {
                setLoadingHospitals(false);
            }
        };
        loadHospitals();
    }, []);

    const handleOpenAddDialog = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            dateOfBirth: '',
            gender: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'USA'
            },
            hospitalId: user?.hospitalId || '',
            bloodType: '',
            allergies: [],
            chronicConditions: [],
            emergencyContact: {
                name: '',
                relationship: '',
                phone: '',
                email: ''
            }
        });
        setOpenAddDialog(true);
    };

    const handleCreatePatient = async () => {
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        setCreateLoading(true);
        try {
            const patientData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                hospitalId: formData.hospitalId,
                bloodType: formData.bloodType,
                allergies: formData.allergies,
                chronicConditions: formData.chronicConditions,
                emergencyContact: formData.emergencyContact
            };

            await patientApi.createPatient(patientData);
            toast.success('Patient created successfully');
            setOpenAddDialog(false);
            fetchPatients(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create patient');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleViewPatient = async (type: 'profile' | 'referrals' | 'medical-history', patient: any) => {
        setViewType(type);
        setSelectedPatient(patient);
        setViewLoading(true);
        setViewData(null);
        setOpenViewDialog(true);

        try {
            let response;
            if (type === 'profile') {
                response = await patientApi.getPatientProfile(patient._id);
            } else if (type === 'referrals') {
                response = await patientApi.getPatientReferrals(patient._id);
            } else {
                response = await patientApi.getPatientMedicalHistory(patient._id);
            }

            if (response.success) {
                setViewData(response.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load data');
        } finally {
            setViewLoading(false);
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchPatients(
            page,
            filters.status !== 'all' ? filters.status : undefined,
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

    const getStatusColor = (user: any) => {
        if (!user.isActive) return 'error';
        if (user.approvalStatus === 'approved') return 'success';
        if (user.approvalStatus === 'pending') return 'warning';
        if (user.approvalStatus === 'rejected') return 'error';
        return 'default';
    };

    const getStatusLabel = (user: any) => {
        if (!user.isActive) return 'Inactive';
        if (user.approvalStatus === 'approved') return 'Active';
        if (user.approvalStatus === 'pending') return 'Pending';
        if (user.approvalStatus === 'rejected') return 'Rejected';
        return 'Unknown';
    };

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patient: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedPatient(patient);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPatient(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Patient Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage patient records, view medical history, and track referrals
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ minWidth: 140 }}
                    onClick={handleOpenAddDialog}
                >
                    Add Patient
                </Button>
            </Box>

            {/* Loading State */}
            {loading && patients.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress size={60} />
                </Box>
            )}

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            fullWidth
                            placeholder="Search patients by name, email, or phone..."
                            value={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ maxWidth: 600, flexGrow: 1 }}
                        />
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                value={filters.status}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
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
                            Total: {pagination.total} patients
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Patients
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.total || pagination.total || 0}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <People />
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
                                        Active Patients
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats?.active || patients.filter(p => p.isActive && p.approvalStatus === 'approved').length || 0}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <People />
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
                                        {stats?.pending || patients.filter(p => p.approvalStatus === 'pending').length || 0}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <People />
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
                                        New This Month
                                    </Typography>
                                    <Typography variant="h4">
                                        {patients.filter(p => {
                                            const created = new Date(p.createdAt);
                                            const now = new Date();
                                            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                                        }).length}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <People />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Patients Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Patient Directory
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Patient</TableCell>
                                            <TableCell>Contact</TableCell>
                                            <TableCell>Age/Gender</TableCell>
                                            <TableCell>Hospital</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {patients.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {error || 'No patients found'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            patients.map((patient) => (
                                                <TableRow key={patient._id} hover>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2">
                                                                    {patient.firstName} {patient.lastName}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    ID: {patient._id?.substring(0, 6).toUpperCase()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            {patient.phone && (
                                                                <Box display="flex" alignItems="center" mb={0.5}>
                                                                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                                    <Typography variant="body2">
                                                                        {patient.phone}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {patient.email && (
                                                                <Box display="flex" alignItems="center">
                                                                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                                    <Typography variant="body2">
                                                                        {patient.email}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <Person sx={{ fontSize: 20, mr: 1 }} />
                                                            <Typography variant="body2">
                                                                {patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)} / ${patient.gender || 'N/A'}` : 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {patient.hospitalId?.name ? (
                                                            <Box display="flex" alignItems="center">
                                                                <LocalHospital sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                                <Typography variant="body2">
                                                                    {patient.hospitalId.name}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                N/A
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={getStatusLabel(patient)}
                                                            color={getStatusColor(patient) as any}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDateTime(patient.createdAt)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            onClick={(e) => handleMenuOpen(e, patient)}
                                                            size="small"
                                                        >
                                                            <MoreVert />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
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
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    if (selectedPatient) handleViewPatient('profile', selectedPatient);
                    handleMenuClose();
                }}>
                    <Person sx={{ mr: 1 }} fontSize="small" />
                    View Profile
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedPatient) handleViewPatient('referrals', selectedPatient);
                    handleMenuClose();
                }}>
                    <Assignment sx={{ mr: 1 }} fontSize="small" />
                    View Referrals
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedPatient) handleViewPatient('medical-history', selectedPatient);
                    handleMenuClose();
                }}>
                    <LocalHospital sx={{ mr: 1 }} fontSize="small" />
                    Medical History
                </MenuItem>
            </Menu>

            {/* Add Patient Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Password (Optional)"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    helperText="Leave empty to generate random password"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        label="Gender"
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Blood Type</InputLabel>
                                    <Select
                                        value={formData.bloodType}
                                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                        label="Blood Type"
                                    >
                                        <MenuItem value="A+">A+</MenuItem>
                                        <MenuItem value="A-">A-</MenuItem>
                                        <MenuItem value="B+">B+</MenuItem>
                                        <MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="AB+">AB+</MenuItem>
                                        <MenuItem value="AB-">AB-</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem>
                                        <MenuItem value="O-">O-</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {user?.role === 'super_admin' && (
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={hospitals}
                                        getOptionLabel={(option) => `${option.name} - ${option.address.city}, ${option.address.state}`}
                                        loading={loadingHospitals}
                                        value={hospitals.find(h => h._id === formData.hospitalId) || null}
                                        onChange={(_, value) => setFormData({ ...formData, hospitalId: value?._id || '' })}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Hospital"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loadingHospitals ? <CircularProgress size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Address
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    value={formData.address.street}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, street: e.target.value }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={formData.address.city}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, city: e.target.value }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={formData.address.state}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, state: e.target.value }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    value={formData.address.zipCode}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, zipCode: e.target.value }
                                    })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} disabled={createLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreatePatient}
                        disabled={createLoading}
                    >
                        {createLoading ? <CircularProgress size={24} /> : 'Create Patient'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Patient Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {viewType === 'profile' && 'Patient Profile'}
                    {viewType === 'referrals' && 'Patient Referrals'}
                    {viewType === 'medical-history' && 'Medical History'}
                </DialogTitle>
                <DialogContent>
                    {viewLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : viewData ? (
                        <Box sx={{ pt: 2 }}>
                            {viewType === 'profile' && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                        <Typography variant="body1">{viewData.firstName} {viewData.lastName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">{viewData.email}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                        <Typography variant="body1">{viewData.phone || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                                        <Typography variant="body1">{viewData.dateOfBirth ? new Date(viewData.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                        <Typography variant="body1">{viewData.gender || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                                        <Typography variant="body1">{viewData.bloodType || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Hospital</Typography>
                                        <Typography variant="body1">{viewData.hospitalId?.name || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            )}
                            {viewType === 'referrals' && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Referrals ({viewData.count || 0})
                                    </Typography>
                                    {viewData.referrals && viewData.referrals.length > 0 ? (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Referral ID</TableCell>
                                                        <TableCell>From Doctor</TableCell>
                                                        <TableCell>To Hospital</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Created</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {viewData.referrals.map((referral: any) => (
                                                        <TableRow key={referral._id}>
                                                            <TableCell>{referral.referralId}</TableCell>
                                                            <TableCell>
                                                                {referral.referringDoctor ?
                                                                    `${referral.referringDoctor.firstName} ${referral.referringDoctor.lastName}` :
                                                                    'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {referral.receivingHospital?.name || 'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={referral.status}
                                                                    size="small"
                                                                    color={referral.status === 'completed' ? 'success' : referral.status === 'pending' ? 'warning' : 'default'}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{formatDateTime(referral.createdAt)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No referrals found for this patient.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            {viewType === 'medical-history' && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>Allergies</Typography>
                                            {viewData.allergies && viewData.allergies.length > 0 ? (
                                                <Box>
                                                    {viewData.allergies.map((allergy: any, index: number) => (
                                                        <Chip key={index} label={allergy.allergen} sx={{ mr: 1, mb: 1 }} />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No allergies recorded</Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>Chronic Conditions</Typography>
                                            {viewData.chronicConditions && viewData.chronicConditions.length > 0 ? (
                                                <Box>
                                                    {viewData.chronicConditions.map((condition: any, index: number) => (
                                                        <Chip key={index} label={condition.condition} sx={{ mr: 1, mb: 1 }} />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No chronic conditions recorded</Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>Medications</Typography>
                                            {viewData.medications && viewData.medications.length > 0 ? (
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Name</TableCell>
                                                                <TableCell>Dosage</TableCell>
                                                                <TableCell>Frequency</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {viewData.medications.map((med: any, index: number) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{med.name}</TableCell>
                                                                    <TableCell>{med.dosage}</TableCell>
                                                                    <TableCell>{med.frequency}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No medications recorded</Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>Medical History</Typography>
                                            {viewData.medicalHistory && viewData.medicalHistory.length > 0 ? (
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell>Type</TableCell>
                                                                <TableCell>Description</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {viewData.medicalHistory.map((history: any, index: number) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{history.date ? new Date(history.date).toLocaleDateString() : 'N/A'}</TableCell>
                                                                    <TableCell>{history.type}</TableCell>
                                                                    <TableCell>{history.description}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No medical history recorded</Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">No data available</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PatientsPage;
