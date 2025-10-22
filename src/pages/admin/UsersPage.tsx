import React, { useState } from 'react';
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
    Paper,
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
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    LocalHospital as HospitalIcon,
    MedicalServices as MedicalIcon,
    Group as GroupIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';

const UsersPage: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Mock data
    const [users, setUsers] = useState([
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'super_admin',
            hospital: 'System',
            status: 'Active',
            lastLogin: '2024-01-15 10:30',
            createdAt: '2024-01-01',
        },
        {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@hospital.com',
            role: 'hospital',
            hospital: 'City General Hospital',
            status: 'Active',
            lastLogin: '2024-01-15 09:15',
            createdAt: '2024-01-05',
        },
        {
            id: '3',
            firstName: 'Dr. Michael',
            lastName: 'Chen',
            email: 'michael.chen@hospital.com',
            role: 'doctor',
            hospital: 'City General Hospital',
            status: 'Active',
            lastLogin: '2024-01-15 08:45',
            createdAt: '2024-01-10',
        },
        {
            id: '4',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            role: 'patient',
            hospital: 'N/A',
            status: 'Active',
            lastLogin: '2024-01-14 16:20',
            createdAt: '2024-01-12',
        },
    ]);

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Inactive':
                return 'error';
            case 'Pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

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

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(user => user.id !== userId));
        handleMenuClose();
    };

    const handleToggleStatus = (userId: string) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
                : user
        ));
        handleMenuClose();
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
                                {users.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {users.filter(u => u.status === 'Active').length} active
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
                                {users.filter(u => u.role === 'super_admin' || u.role === 'hospital').length}
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
                                {users.filter(u => u.role === 'doctor').length}
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
                                {users.filter(u => u.role === 'patient').length}
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                            sx={{ minWidth: 250 }}
                        />
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                label="Filter by Role"
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="super_admin">Super Admin</MenuItem>
                                <MenuItem value="hospital">Hospital Admin</MenuItem>
                                <MenuItem value="doctor">Doctor</MenuItem>
                                <MenuItem value="patient">Patient</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog('add')}
                        >
                            Add User
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Hospital</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Login</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
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
                                            label={user.role.replace('_', ' ').toUpperCase()}
                                            color={getRoleColor(user.role) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{user.hospital}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status}
                                            color={getStatusColor(user.status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{user.lastLogin}</TableCell>
                                    <TableCell>{user.createdAt}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, user)}
                                            size="small"
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                <MenuItem onClick={() => handleToggleStatus(selectedUser?.id)}>
                    <ListItemIcon>
                        <MoreVertIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                        {selectedUser?.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleDeleteUser(selectedUser?.id)}>
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
