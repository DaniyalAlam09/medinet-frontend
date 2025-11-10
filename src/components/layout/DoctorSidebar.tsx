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
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    MedicalServices as MedicalServicesIcon,
    Description as DescriptionIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DoctorSidebarProps {
    open: boolean;
    onClose: () => void;
    variant?: 'temporary' | 'permanent';
}

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ open, onClose, variant = 'temporary' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: <DashboardIcon />,
            description: 'My overview',
        },
        {
            title: 'My Patients',
            path: '/dashboard/patients',
            icon: <PeopleIcon />,
            description: 'Patient management',
        },
        {
            title: 'Appointments',
            path: '/dashboard/appointments',
            icon: <ScheduleIcon />,
            description: 'Schedule & manage',
        },
        {
            title: 'Referrals',
            path: '/dashboard/referrals',
            icon: <AssignmentIcon />,
            description: 'Create & track referrals',
        },
        {
            title: 'Reports',
            path: '/dashboard/reports',
            icon: <DescriptionIcon />,
            description: 'Medical reports',
        },
        {
            title: 'Profile',
            path: '/dashboard/profile',
            icon: <SettingsIcon />,
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
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                        <MedicalServicesIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            Doctor Portal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Medical Professional
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={`Dr. ${user?.firstName} ${user?.lastName}`}
                    color="success"
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
                                    backgroundColor: 'success.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'success.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'success.light',
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
                    Status: <Chip label="Active" color="success" size="small" />
                </Typography>
            </Box>
        </Drawer>
    );
};

export default DoctorSidebar;
