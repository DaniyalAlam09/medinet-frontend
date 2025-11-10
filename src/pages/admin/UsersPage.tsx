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
    Pagination,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    LocalHospital as HospitalIcon,
    MedicalServices as MedicalIcon,
    Group as GroupIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { userApi } from '../../utils/approvalApi';
import { formatDateTime } from '../../components/dashboard/DataTable';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
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
        role: 'all',
        status: 'all',
        search: ''
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [toggleLoading, setToggleLoading] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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

    // Fetch users dynamically
    const fetchUsers = async (page: number = 1, role?: string, status?: string, search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                page,
                limit: pagination.limit
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
                setPagination({
                    current: response.data.pagination?.current || page,
                    pages: response.data.pagination?.pages || 1,
                    total: response.data.pagination?.total || 0,
                    limit: pagination.limit
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user stats
    const fetchStats = async () => {
        try {
            const response = await userApi.getUserStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch user stats:', err);
            // Set default stats if API fails
            setStats({
                total: 0,
                active: 0,
                pending: 0,
                byRole: {
                    super_admin: 0,
                    hospital: 0,
                    doctor: 0,
                    patient: 0
                }
            });
        }
    };

    // Fetch users and stats on mount
    useEffect(() => {
        fetchUsers(
            1,
            filters.role !== 'all' ? filters.role : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined
        );
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch users when role or status filters change
    useEffect(() => {
        fetchUsers(
            1,
            filters.role !== 'all' ? filters.role : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.role, filters.status]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers(
                1,
                filters.role !== 'all' ? filters.role : undefined,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters.search]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchUsers(
            page,
            filters.role !== 'all' ? filters.role : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            filters.search || undefined
        );
    };

    const handleRoleFilterChange = (role: string) => {
        setFilters(prev => ({ ...prev, role }));
        setPagination(prev => ({ ...prev, current: 1 }));
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

    const getStatusLabel = (user: any) => {
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

    const handleOpenDialog = (type: 'add' | 'edit', user?: any) => {
        setDialogType(type);
        setSelectedUser(user || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            handleMenuClose();
            return;
        }

        setDeleteLoading(userId);
        try {
            await userApi.deleteUser(userId);
            toast.success('User deleted successfully');
            handleMenuClose();
            fetchUsers(
                pagination.current,
                filters.role !== 'all' ? filters.role : undefined,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleToggleStatus = async (userId: string) => {
        setToggleLoading(userId);
        try {
            await userApi.toggleUserStatus(userId);
            toast.success('User status updated successfully');
            handleMenuClose();
            fetchUsers(
                pagination.current,
                filters.role !== 'all' ? filters.role : undefined,
                filters.status !== 'all' ? filters.status : undefined,
                filters.search || undefined
            );
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update user status');
        } finally {
            setToggleLoading(null);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Management
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage all system users and their permissions
                </Typography>
            </Box>

            {/* Loading State */}
            {loading && users.length === 0 && (
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
                                <GroupIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Users</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats?.total || pagination.total || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stats?.active || users.filter(u => u.isActive && u.approvalStatus === 'approved').length || 0} active
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AdminIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Admins</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {(stats?.byRole?.super_admin || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                System administrators
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MedicalIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Doctors</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats?.byRole?.doctor || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Medical professionals
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Patients</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {stats?.byRole?.patient || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Registered patients
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
                            placeholder="Search users..."
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
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={filters.role}
                                onChange={(e) => handleRoleFilterChange(e.target.value)}
                                label="Filter by Role"
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="super_admin">Super Admin</MenuItem>
                                <MenuItem value="hospital">Hospital Admin</MenuItem>
                                <MenuItem value="doctor">Doctor</MenuItem>
                                <MenuItem value="patient">Patient</MenuItem>
                            </Select>
                        </FormControl>
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
                            Total: {pagination.total} users
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Users Table */}
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
                                        <TableCell>User</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Hospital/Clinic</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    No users found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                            {getRoleIcon(user.role)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {user.firstName} {user.lastName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.role?.replace('_', ' ').toUpperCase() || 'N/A'}
                                                        color={getRoleColor(user.role) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {user.hospitalId?.name || user.clinicId?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getStatusLabel(user)}
                                                        color={getStatusColor(user) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {formatDateTime(user.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleMenuOpen(e, user)}
                                                        size="small"
                                                        disabled={toggleLoading === user._id || deleteLoading === user._id}
                                                    >
                                                        {toggleLoading === user._id || deleteLoading === user._id ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            <MoreVertIcon />
                                                        )}
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
                <MenuItem onClick={() => handleOpenDialog('edit', selectedUser)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit User</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => selectedUser && handleToggleStatus(selectedUser._id)}
                    disabled={selectedUser?.role === 'super_admin' || toggleLoading === selectedUser?._id}
                >
                    <ListItemIcon>
                        <MoreVertIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                        {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
                    </ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => selectedUser && handleDeleteUser(selectedUser._id)}
                    disabled={selectedUser?.role === 'super_admin' || deleteLoading === selectedUser?._id}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete User</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'add' ? 'Add New User' : 'Edit User'}
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        User management form will be implemented here with proper validation and API integration.
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        This dialog will include fields for:
                    </Typography>
                    <ul>
                        <li>Personal information (name, email, phone)</li>
                        <li>Role selection</li>
                        <li>Hospital assignment (if applicable)</li>
                        <li>Permissions and access levels</li>
                        <li>Account status settings</li>
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>
                        {dialogType === 'add' ? 'Add User' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsersPage;
