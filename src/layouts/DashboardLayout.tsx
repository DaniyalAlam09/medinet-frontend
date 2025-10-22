import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    ListItemIcon,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Logout,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import SuperAdminSidebar from '../components/layout/SuperAdminSidebar';
import HospitalSidebar from '../components/layout/HospitalSidebar';
import DoctorSidebar from '../components/layout/DoctorSidebar';
import PatientSidebar from '../components/layout/PatientSidebar';

const drawerWidth = 280;

const DashboardLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleProfileMenuClose();
        navigate('/login');
    };

    // Get page title based on current route
    const getPageTitle = () => {
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];

        if (lastSegment === 'dashboard' || lastSegment === '') {
            return 'Dashboard';
        }

        // Capitalize first letter and replace hyphens with spaces
        return lastSegment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Render appropriate sidebar based on user role
    const renderSidebar = (variant: 'temporary' | 'permanent' = 'temporary') => {
        if (!user) return null;

        const sidebarProps = {
            open: variant === 'temporary' ? mobileOpen : true,
            onClose: variant === 'temporary' ? handleDrawerToggle : () => { },
            variant
        };

        switch (user.role) {
            case 'super_admin':
                return <SuperAdminSidebar {...sidebarProps} />;
            case 'hospital':
                return <HospitalSidebar {...sidebarProps} />;
            case 'doctor':
                return <DoctorSidebar {...sidebarProps} />;
            case 'patient':
                return <PatientSidebar {...sidebarProps} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {getPageTitle()}
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/dashboard/profile'); }}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile drawer */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {renderSidebar('temporary')}
                </Box>
                {/* Desktop drawer */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    {renderSidebar('permanent')}
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
