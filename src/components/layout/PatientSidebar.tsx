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
    Schedule as ScheduleIcon,
    Assignment as AssignmentIcon,
    Assessment as AssessmentIcon,
    Person as PersonIcon,
    LocalHospital as HospitalIcon,
    BookOnline as BookIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PatientSidebarProps {
    open: boolean;
    onClose: () => void;
    variant?: 'temporary' | 'permanent';
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ open, onClose, variant = 'temporary' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: <DashboardIcon />,
            description: 'My health overview',
        },
        {
            title: 'Appointments',
            path: '/dashboard/appointments',
            icon: <ScheduleIcon />,
            description: 'Book & manage appointments',
        },
        {
            title: 'Book Appointment',
            path: '/dashboard/book-appointment',
            icon: <BookIcon />,
            description: 'Schedule new appointment',
        },
        {
            title: 'Medical Records',
            path: '/dashboard/records',
            icon: <AssessmentIcon />,
            description: 'View my records',
        },
        {
            title: 'Referrals',
            path: '/dashboard/referrals',
            icon: <AssignmentIcon />,
            description: 'Track referrals',
        },

        {
            title: 'My Doctors',
            path: '/dashboard/doctors',
            icon: <PersonIcon />,
            description: 'My healthcare team',
        },
        {
            title: 'Hospitals',
            path: '/dashboard/hospitals',
            icon: <HospitalIcon />,
            description: 'Find hospitals',
        },

        {
            title: 'Profile',
            path: '/dashboard/profile',
            icon: <PersonIcon />,
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
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                        <PersonIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            Patient Portal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Health Management
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={`Welcome, ${user?.firstName}`}
                    color="info"
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
                                    backgroundColor: 'info.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'info.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'info.light',
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
                    Health Status: <Chip label="Good" color="success" size="small" />
                </Typography>
            </Box>
        </Drawer>
    );
};

export default PatientSidebar;
