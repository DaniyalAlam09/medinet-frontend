import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Stack,
    Chip,
    Avatar,
    Paper,
    Divider,
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Analytics as AnalyticsIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    CheckCircle as CheckIcon,
    ArrowForward as ArrowIcon,
    Star as StarIcon,
    TrendingUp as TrendingIcon,
    Shield as ShieldIcon,
    Support as SupportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <HospitalIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Hospital Management',
            description: 'Comprehensive hospital administration and management tools with real-time monitoring.',
            color: 'primary',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
            title: 'Patient Records',
            description: 'Secure and centralized patient health record management with HIPAA compliance.',
            color: 'secondary',
        },
        {
            icon: <AssignmentIcon sx={{ fontSize: 48, color: 'info.main' }} />,
            title: 'Referral System',
            description: 'Efficient doctor-to-doctor patient referral system with automated workflows.',
            color: 'info',
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 48, color: 'success.main' }} />,
            title: 'Analytics & Reports',
            description: 'Comprehensive analytics and reporting capabilities with real-time insights.',
            color: 'success',
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
            title: 'Secure & Compliant',
            description: 'Enterprise-grade security with HIPAA compliance and data encryption.',
            color: 'warning',
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 48, color: 'error.main' }} />,
            title: 'Fast & Reliable',
            description: 'High-performance system with 99.9% uptime and lightning-fast response.',
            color: 'error',
        },
    ];

    const stats = [
        { label: 'Hospitals Connected', value: '500+', icon: <HospitalIcon /> },
        { label: 'Active Users', value: '10K+', icon: <PeopleIcon /> },
        { label: 'Referrals Processed', value: '50K+', icon: <AssignmentIcon /> },
        { label: 'Uptime', value: '99.9%', icon: <TrendingIcon /> },
    ];

    const benefits = [
        'Reduced referral processing time by 70%',
        'Improved patient care coordination',
        'Enhanced data security and compliance',
        'Real-time analytics and reporting',
        'Seamless integration with existing systems',
        '24/7 technical support',
    ];

    const testimonials = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Medical Officer',
            hospital: 'City General Hospital',
            content: 'MediNet has revolutionized our referral process. The efficiency gains are remarkable.',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'IT Director',
            hospital: 'Regional Medical Center',
            content: 'The security and compliance features give us complete peace of mind.',
            rating: 5,
        },
        {
            name: 'Dr. Emily Rodriguez',
            role: 'Cardiologist',
            hospital: 'Heart & Vascular Institute',
            content: 'Patient data is now accessible instantly, improving our decision-making process.',
            rating: 5,
        },
    ];

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    py: { xs: 10, md: 15 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.3,
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                        <Chip
                            label="Trusted by 500+ Hospitals"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                mb: 3,
                                px: 2,
                                py: 1,
                            }}
                        />

                        <Typography
                            variant="h1"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                fontWeight: 800,
                                mb: 3,
                                lineHeight: 1.1,
                            }}
                        >
                            Transform Healthcare
                            <br />
                            <Box component="span" sx={{ color: 'secondary.main' }}>
                                with MediNet
                            </Box>
                        </Typography>

                        <Typography
                            variant="h5"
                            component="p"
                            sx={{
                                fontSize: { xs: '1.1rem', md: '1.4rem' },
                                mb: 6,
                                opacity: 0.9,
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.6,
                            }}
                        >
                            The National Healthcare Referral & Health Record Management System
                            that connects hospitals, doctors, and patients seamlessly.
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                            sx={{ mb: 8 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    px: 6,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        bgcolor: 'grey.100',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                                onClick={handleGetStarted}
                                endIcon={<ArrowIcon />}
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                            </Button>
                            {!isAuthenticated && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 6,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                    onClick={handleSignIn}
                                >
                                    Sign In
                                </Button>
                            )}
                        </Stack>

                        {/* Stats */}
                        <Grid container spacing={4} sx={{ mt: 8 }}>
                            {stats.map((stat, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                width: 60,
                                                height: 60,
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        >
                                            {stat.icon}
                                        </Avatar>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                fontSize: { xs: '1.5rem', md: '2rem' },
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        gutterBottom
                        sx={{ mb: 3, color: 'text.primary' }}
                    >
                        Powerful Features
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: '600px', mx: 'auto' }}
                    >
                        Everything you need to manage healthcare referrals and patient records efficiently
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    p: 4,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[12],
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            bgcolor: `${feature.color}.light`,
                                            color: `${feature.color}.contrastText`,
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h5" component="h3" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Benefits Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
                                Why Choose MediNet?
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                                Join thousands of healthcare professionals who trust MediNet to streamline their operations and improve patient care.
                            </Typography>

                            <Stack spacing={2}>
                                {benefits.map((benefit, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckIcon sx={{ color: 'success.main', fontSize: 24 }} />
                                        <Typography variant="body1">{benefit}</Typography>
                                    </Box>
                                ))}
                            </Stack>

                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mt: 4, px: 6, py: 2 }}
                                onClick={handleGetStarted}
                                endIcon={<ArrowIcon />}
                            >
                                {isAuthenticated ? 'Access Dashboard' : 'Start Your Free Trial'}
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    color: 'white',
                                }}
                            >
                                <ShieldIcon sx={{ fontSize: 80, mb: 3 }} />
                                <Typography variant="h4" gutterBottom>
                                    Enterprise Security
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                                    HIPAA Compliant • End-to-End Encryption • 99.9% Uptime
                                </Typography>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 3 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
                                    <Box>
                                        <Typography variant="h6">500+</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Hospitals</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6">10K+</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Users</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6">50K+</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Referrals</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            {/* <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        What Our Users Say
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Trusted by healthcare professionals nationwide
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ height: '100%', p: 4 }}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <StarIcon key={i} sx={{ color: 'warning.main', fontSize: 20 }} />
                                    ))}
                                </Box>
                                <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                                    "{testimonial.content}"
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {testimonial.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {testimonial.role}
                                    </Typography>
                                    <Typography variant="body2" color="primary.main">
                                        {testimonial.hospital}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container> */}

            {/* CTA Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    py: 12,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Ready to Transform Healthcare?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.7 }}>
                        Join thousands of healthcare professionals using MediNet to streamline their operations and improve patient care.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                px: 6,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            onClick={handleGetStarted}
                            endIcon={<ArrowIcon />}
                        >
                            {isAuthenticated ? 'Access Dashboard' : 'Get Started Free'}
                        </Button>
                        {!isAuthenticated && (
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 6,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <SupportIcon sx={{ mr: 1 }} />
                                Contact Sales
                            </Button>
                        )}
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;