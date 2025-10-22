import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Pagination,
    Stack,
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { approvalApi } from '../../utils/approvalApi';
import { PendingUser, PendingHospital, ApprovalStats } from '../../types/hospital';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`approval-tabpanel-${index}`}
            aria-labelledby={`approval-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const ApprovalPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [pendingHospitals, setPendingHospitals] = useState<PendingHospital[]>([]);
    const [stats, setStats] = useState<ApprovalStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | null>(null);
    const [message, setMessage] = useState('');
    const [reason, setReason] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await approvalApi.getPendingUsers({
                page: currentPage,
                limit: 10,
            });
            setPendingUsers(response.data.users);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error loading pending users:', error);
            toast.error('Failed to load pending users');
        } finally {
            setLoading(false);
        }
    };

    const loadPendingHospitals = async () => {
        try {
            setLoading(true);
            const response = await approvalApi.getPendingHospitals({
                page: currentPage,
                limit: 10,
            });
            setPendingHospitals(response.data.hospitals);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error loading pending hospitals:', error);
            toast.error('Failed to load pending hospitals');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await approvalApi.getApprovalStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        if (tabValue === 0) {
            loadPendingUsers();
        } else {
            loadPendingHospitals();
        }
    }, [tabValue, currentPage]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setCurrentPage(1);
    };

    const handleApprove = async () => {
        if (!selectedItem) return;

        try {
            if (tabValue === 0) {
                await approvalApi.approveUser(selectedItem._id, message);
                toast.success('User approved successfully');
            } else {
                await approvalApi.approveHospital(selectedItem._id, message);
                toast.success('Hospital approved successfully');
            }
            setActionDialog(null);
            setMessage('');
            setSelectedItem(null);
            if (tabValue === 0) {
                loadPendingUsers();
            } else {
                loadPendingHospitals();
            }
            loadStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve');
        }
    };

    const handleReject = async () => {
        if (!selectedItem || !reason.trim()) return;

        try {
            if (tabValue === 0) {
                await approvalApi.rejectUser(selectedItem._id, reason);
                toast.success('User rejected successfully');
            } else {
                await approvalApi.rejectHospital(selectedItem._id, reason);
                toast.success('Hospital rejected successfully');
            }
            setActionDialog(null);
            setReason('');
            setSelectedItem(null);
            if (tabValue === 0) {
                loadPendingUsers();
            } else {
                loadPendingHospitals();
            }
            loadStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin':
                return 'error';
            case 'hospital':
                return 'primary';
            case 'doctor':
                return 'info';
            case 'patient':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Approval Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and approve pending user and hospital registrations
                </Typography>
            </Box>

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Pending Users
                                </Typography>
                                <Typography variant="h4" color="warning.main">
                                    {stats.pendingUsers}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Approved Users
                                </Typography>
                                <Typography variant="h4" color="success.main">
                                    {stats.approvedUsers}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Rejected Users
                                </Typography>
                                <Typography variant="h4" color="error.main">
                                    {stats.rejectedUsers}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Pending Hospitals
                                </Typography>
                                <Typography variant="h4" color="warning.main">
                                    {stats.pendingHospitals}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Approved Hospitals
                                </Typography>
                                <Typography variant="h4" color="success.main">
                                    {stats.approvedHospitals}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Rejected Hospitals
                                </Typography>
                                <Typography variant="h4" color="error.main">
                                    {stats.rejectedHospitals}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Pending Users" />
                        <Tab label="Pending Hospitals" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Pending User Approvals</Typography>
                        <IconButton onClick={loadPendingUsers} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Hospital</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pendingUsers.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell>
                                                    {user.firstName} {user.lastName}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.role}
                                                        color={getRoleColor(user.role) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {user.hospital?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.approvalStatus}
                                                        color={getStatusColor(user.approvalStatus) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Approve">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => {
                                                                    setSelectedItem(user);
                                                                    setActionDialog('approve');
                                                                }}
                                                            >
                                                                <ApproveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    setSelectedItem(user);
                                                                    setActionDialog('reject');
                                                                }}
                                                            >
                                                                <RejectIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={(_, page) => setCurrentPage(page)}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Pending Hospital Approvals</Typography>
                        <IconButton onClick={loadPendingHospitals} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Hospital Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Address</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pendingHospitals.map((hospital) => (
                                            <TableRow key={hospital._id}>
                                                <TableCell>{hospital.name}</TableCell>
                                                <TableCell>{hospital.email}</TableCell>
                                                <TableCell>{hospital.phone}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={hospital.type}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {hospital.address.city}, {hospital.address.state}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={hospital.status}
                                                        color={getStatusColor(hospital.status) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(hospital.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Approve">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => {
                                                                    setSelectedItem(hospital);
                                                                    setActionDialog('approve');
                                                                }}
                                                            >
                                                                <ApproveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    setSelectedItem(hospital);
                                                                    setActionDialog('reject');
                                                                }}
                                                            >
                                                                <RejectIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={(_, page) => setCurrentPage(page)}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </TabPanel>
            </Paper>

            {/* Action Dialog */}
            <Dialog
                open={actionDialog !== null}
                onClose={() => {
                    setActionDialog(null);
                    setMessage('');
                    setReason('');
                    setSelectedItem(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {actionDialog === 'approve' ? 'Approve' : 'Reject'} {tabValue === 0 ? 'User' : 'Hospital'}
                </DialogTitle>
                <DialogContent>
                    {actionDialog === 'approve' ? (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Approval Message (Optional)"
                            fullWidth
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter a message to include in the approval notification..."
                        />
                    ) : (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Rejection Reason"
                            fullWidth
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter the reason for rejection..."
                            required
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setActionDialog(null);
                            setMessage('');
                            setReason('');
                            setSelectedItem(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={actionDialog === 'approve' ? handleApprove : handleReject}
                        color={actionDialog === 'approve' ? 'success' : 'error'}
                        variant="contained"
                        disabled={actionDialog === 'reject' && !reason.trim()}
                    >
                        {actionDialog === 'approve' ? 'Approve' : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ApprovalPage;
