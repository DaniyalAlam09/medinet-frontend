import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Grid,
    Avatar,
    Menu,
    ListItemIcon,
    ListItemText,
    Badge,
    Pagination,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    MedicalServices as MedicalIcon,
    Search as SearchIcon,
    Schedule as ScheduleIcon,
    Assessment as AssessmentIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { doctorApi, hospitalApi } from '../../utils/approvalApi';
import { formatDateTime } from '../../components/dashboard/DataTable';
import { useAuth } from '../../hooks/useAuth';
import { Hospital } from '../../types/hospital';
import { RadioGroup, Radio, FormControlLabel, FormLabel, Autocomplete } from '@mui/material';

const DoctorsPage: React.FC = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
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
        search: '',
        specialization: 'all'
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
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
        practiceType: 'hospital',
        hospitalId: '',
        clinicName: '',
        clinicAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        clinicPhone: '',
        clinicEmail: '',
        clinicWebsite: '',
        clinicDescription: '',
        licenseNumber: '',
        specialization: '',
        yearsOfExperience: 0,
        qualification: ''
    });

    // Fetch doctors dynamically
    const fetchDoctors = async (page: number = 1, status?: string, search?: string, specialization?: string) => {
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
            if (specialization && specialization !== 'all') {
                params.specialization = specialization;
            }

            const response = await doctorApi.getDoctors(params);
            if (response.success) {
                setDoctors(response.data.doctors || []);
                setStats(response.data.stats || null);
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: pagination.limit
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch doctors');
            if (doctors.length === 0) {
                toast.error('Failed to fetch doctors');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch doctors on mount and when filters change
    useEffect(() => {
        fetchDoctors(
            1,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined,
            filters.specialization !== 'all' ? filters.specialization : undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.status, filters.specialization]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDoctors(
                1,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined,
                filters.specialization !== 'all' ? filters.specialization : undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchDoctors(
            page,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined,
            filters.specialization !== 'all' ? filters.specialization : undefined
        );
    };

    const handleStatusFilterChange = (status: string) => {
        setFilters(prev => ({ ...prev, status }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleSpecializationFilterChange = (specialization: string) => {
        setFilters(prev => ({ ...prev, specialization }));
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

    const getSpecialtyColor = (specialty: string) => {
        const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
        const index = (specialty?.charCodeAt(0) || 0) % colors.length;
        return colors[index];
    };

    // Get unique specializations from doctors
    const specializations = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)));

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

    const handleOpenDialog = (type: 'add' | 'edit', doctor?: any) => {
        setDialogType(type);
        setSelectedDoctor(doctor || null);
        if (type === 'add') {
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
                practiceType: user?.role === 'hospital' ? 'hospital' : 'hospital',
                hospitalId: user?.hospitalId || '',
                clinicName: '',
                clinicAddress: {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'USA'
                },
                clinicPhone: '',
                clinicEmail: '',
                clinicWebsite: '',
                clinicDescription: '',
                licenseNumber: '',
                specialization: '',
                yearsOfExperience: 0,
                qualification: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCreateDoctor = async () => {
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.practiceType === 'hospital' && !formData.hospitalId) {
            toast.error('Please select a hospital');
            return;
        }

        if (formData.practiceType === 'own_clinic') {
            if (!formData.clinicName || !formData.clinicAddress.street || !formData.clinicAddress.city) {
                toast.error('Please fill in all clinic details');
                return;
            }
        }

        if (!formData.licenseNumber || !formData.specialization) {
            toast.error('Please provide license number and specialization');
            return;
        }

        setCreateLoading(true);
        try {
            const doctorData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                practiceType: formData.practiceType,
                licenseNumber: formData.licenseNumber,
                specialization: formData.specialization,
                yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                qualification: formData.qualification
            };

            if (formData.practiceType === 'hospital') {
                doctorData.hospitalId = formData.hospitalId;
            } else {
                doctorData.clinicName = formData.clinicName;
                doctorData.clinicAddress = formData.clinicAddress;
                doctorData.clinicPhone = formData.clinicPhone;
                doctorData.clinicEmail = formData.clinicEmail;
                doctorData.clinicWebsite = formData.clinicWebsite;
                doctorData.clinicDescription = formData.clinicDescription;
            }

            await doctorApi.createDoctor(doctorData);
            toast.success('Doctor created successfully. Awaiting approval.');
            setOpenDialog(false);
            fetchDoctors(
                pagination.current,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined,
                filters.specialization !== 'all' ? filters.specialization : undefined
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create doctor');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDoctor(null);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doctor: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedDoctor(doctor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDoctor(null);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Doctor Management
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage doctors and their schedules in your hospital
                </Typography>
            </Box>

            {/* Loading State */}
            {loading && doctors.length === 0 && (
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

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MedicalIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Doctors</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats?.total || pagination.total || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stats?.active || doctors.filter(d => d.isActive && d.approvalStatus === 'approved').length || 0} active
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Pending Approval</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats?.pending || doctors.filter(d => d.approvalStatus === 'pending').length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Awaiting approval
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Active Doctors</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats?.active || doctors.filter(d => d.isActive && d.approvalStatus === 'approved').length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Currently active
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Specialties</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {specializations.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Different specialties
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Actions */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search doctors..."
                            value={filters.search}
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
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Specialty</InputLabel>
                            <Select
                                value={filters.specialization}
                                onChange={(e) => handleSpecializationFilterChange(e.target.value)}
                                label="Filter by Specialty"
                            >
                                <MenuItem value="all">All Specialties</MenuItem>
                                {specializations.map(specialty => (
                                    <MenuItem key={specialty} value={specialty}>
                                        {specialty}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                            Total: {pagination.total} doctors
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog('add')}
                        >
                            Add Doctor
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Doctors Table */}
            <Card>
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
                                        <TableCell>Doctor</TableCell>
                                        <TableCell>Specialty</TableCell>
                                        <TableCell>License</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Experience</TableCell>
                                        <TableCell>Hospital/Clinic</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {doctors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {error || 'No doctors found'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        doctors.map((doctor) => (
                                            <TableRow key={doctor._id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                            <MedicalIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {doctor.firstName} {doctor.lastName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {doctor.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {doctor.specialization ? (
                                                        <Chip
                                                            label={doctor.specialization}
                                                            color={getSpecialtyColor(doctor.specialization) as any}
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            N/A
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>{doctor.licenseNumber || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getStatusLabel(doctor)}
                                                        color={getStatusColor(doctor) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{doctor.yearsOfExperience || 0} years</TableCell>
                                                <TableCell>
                                                    {doctor.hospitalId?.name || doctor.clinicId?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>{formatDateTime(doctor.createdAt)}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleMenuOpen(e, doctor)}
                                                        size="small"
                                                    >
                                                        <MoreVertIcon />
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
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleOpenDialog('edit', selectedDoctor)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Doctor</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {dialogType === 'add' ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Personal Information
                                    </Typography>
                                </Grid>
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
                                        label="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        helperText="Minimum 6 characters"
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
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Practice Type
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            value={formData.practiceType}
                                            onChange={(e) => setFormData({ ...formData, practiceType: e.target.value })}
                                        >
                                            <FormControlLabel value="hospital" control={<Radio />} label="In Hospital" />
                                            <FormControlLabel value="own_clinic" control={<Radio />} label="Own Clinic" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {formData.practiceType === 'hospital' && (
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
                                                    required
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
                                {formData.practiceType === 'own_clinic' && (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                                Clinic Information
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Clinic Name"
                                                value={formData.clinicName}
                                                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Clinic Phone"
                                                value={formData.clinicPhone}
                                                onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Clinic Email"
                                                type="email"
                                                value={formData.clinicEmail}
                                                onChange={(e) => setFormData({ ...formData, clinicEmail: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Clinic Website"
                                                value={formData.clinicWebsite}
                                                onChange={(e) => setFormData({ ...formData, clinicWebsite: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Street Address"
                                                value={formData.clinicAddress.street}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    clinicAddress: { ...formData.clinicAddress, street: e.target.value }
                                                })}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                value={formData.clinicAddress.city}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    clinicAddress: { ...formData.clinicAddress, city: e.target.value }
                                                })}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                value={formData.clinicAddress.state}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    clinicAddress: { ...formData.clinicAddress, state: e.target.value }
                                                })}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="ZIP Code"
                                                value={formData.clinicAddress.zipCode}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    clinicAddress: { ...formData.clinicAddress, zipCode: e.target.value }
                                                })}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Clinic Description"
                                                multiline
                                                rows={3}
                                                value={formData.clinicDescription}
                                                onChange={(e) => setFormData({ ...formData, clinicDescription: e.target.value })}
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Professional Information
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="License Number"
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Specialization"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Years of Experience"
                                        type="number"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Qualification"
                                        value={formData.qualification}
                                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
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
                        ) : (
                            <Alert severity="info">
                                Edit functionality will be implemented here.
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={createLoading}>
                        Cancel
                    </Button>
                    {dialogType === 'add' && (
                        <Button
                            variant="contained"
                            onClick={handleCreateDoctor}
                            disabled={createLoading}
                        >
                            {createLoading ? <CircularProgress size={24} /> : 'Create Doctor'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DoctorsPage;
