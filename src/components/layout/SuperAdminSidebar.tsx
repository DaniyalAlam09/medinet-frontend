import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    PersonAdd as PersonAddIcon,
    Group as GroupIcon,
    Report as ReportIcon,
    AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SuperAdminSidebarProps {
    open: boolean;
    onClose: () => void;
    variant?: 'temporary' | 'permanent';
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ open, onClose, variant = 'temporary' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: <DashboardIcon />,
            description: 'System overview and analytics',
        },
        {
            title: 'Hospitals',
            path: '/dashboard/hospitals',
            icon: <HospitalIcon />,
            description: 'Manage all hospitals',
        },
        {
            title: 'Users',
            path: '/dashboard/users',
            icon: <PeopleIcon />,
            description: 'User management',
        },
        {
            title: 'Approvals',
            path: '/dashboard/approvals',
            icon: <AdminIcon />,
            description: 'Manage approvals',
        },
        {
            title: 'Doctors',
            path: '/dashboard/doctors',
            icon: <PersonAddIcon />,
            description: 'Doctor management',
        },
        {
            title: 'Patients',
            path: '/dashboard/patients',
            icon: <GroupIcon />,
            description: 'Patient management',
        },
        {
            title: 'Referrals',
            path: '/dashboard/referrals',
            icon: <AssignmentIcon />,
            description: 'Referral management',
        },
        {
            title: 'Reports',
            path: '/dashboard/reports',
            icon: <ReportIcon />,
            description: 'Generate reports',
        },
        {
            title: 'Profile',
            path: '/dashboard/profile',
            icon: <AdminIcon />,
            description: 'Edit your profile',
        },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <Drawer
            variant={variant}
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 280,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                        <AdminIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            Super Admin
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            System Administrator
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={`Welcome, ${user?.firstName}`}
                    color="error"
                    size="small"
                    variant="outlined"
                />
            </Box>

            <List sx={{ px: 1, py: 2 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            selected={isActive(item.path)}
                            sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'error.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                secondary={item.description}
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: isActive(item.path) ? 600 : 400,
                                }}
                                secondaryTypographyProps={{
                                    fontSize: '0.75rem',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    System Status: <Chip label="Operational" color="success" size="small" />
                </Typography>
            </Box>
        </Drawer>
    );
};

export default SuperAdminSidebar;
