import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    useTheme,
    useMediaQuery,
    Stack,
    Paper,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Schedule as ScheduleIcon,
    Support as SupportIcon,
    Business as BusinessIcon,
    Send as SendIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';

const ContactPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const contactInfo = [
        {
            icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Email Us',
            details: ['support@medinet.com', 'sales@medinet.com', 'partnerships@medinet.com'],
            description: 'Send us an email and we\'ll respond within 24 hours',
        },
        {
            icon: <PhoneIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            title: 'Call Us',
            details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
            description: 'Speak with our team Monday-Friday, 9AM-6PM EST',
        },
        {
            icon: <LocationIcon sx={{ fontSize: 40, color: 'success.main' }} />,
            title: 'Visit Us',
            details: ['123 Healthcare Ave', 'Medical District, NY 10001'],
            description: 'Our headquarters in the heart of the medical district',
        },
        {
            icon: <ScheduleIcon sx={{ fontSize: 40, color: 'info.main' }} />,
            title: 'Business Hours',
            details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed'],
            description: 'We\'re here to help during business hours',
        },
    ];

    const departments = [
        {
            icon: <SupportIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
            title: 'Technical Support',
            description: 'Get help with technical issues and system troubleshooting',
            contact: 'support@medinet.com',
            responseTime: 'Within 2 hours',
        },
        {
            icon: <BusinessIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
            title: 'Sales & Partnerships',
            description: 'Learn about our solutions and partnership opportunities',
            contact: 'sales@medinet.com',
            responseTime: 'Within 4 hours',
        },
        {
            icon: <EmailIcon sx={{ fontSize: 32, color: 'success.main' }} />,
            title: 'General Inquiries',
            description: 'Questions about our services and general information',
            contact: 'info@medinet.com',
            responseTime: 'Within 24 hours',
        },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                company: '',
                subject: '',
                message: '',
            });
        }, 2000);
    };

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 800,
                            mb: 3,
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="h5"
                        component="p"
                        sx={{
                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                            mb: 4,
                            opacity: 0.9,
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Get in touch with our team. We're here to help and answer any questions you may have.
                    </Typography>
                </Container>
            </Box>

            {/* Contact Information Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Get in Touch
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Multiple ways to reach us
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {contactInfo.map((info, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    p: 3,
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[12],
                                    },
                                }}
                            >
                                <Box sx={{ mb: 3 }}>{info.icon}</Box>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {info.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {info.description}
                                </Typography>
                                <Stack spacing={1}>
                                    {info.details.map((detail, detailIndex) => (
                                        <Typography key={detailIndex} variant="body2" sx={{ fontWeight: 500 }}>
                                            {detail}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Contact Form and Departments */}
            <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8}>
                        {/* Contact Form */}
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 4 }}>
                                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                                    Send us a Message
                                </Typography>

                                {submitStatus === 'success' && (
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        <CheckIcon sx={{ mr: 1 }} />
                                        Thank you for your message! We'll get back to you soon.
                                    </Alert>
                                )}

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Company/Organization"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                multiline
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                disabled={isSubmitting}
                                                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                                                sx={{ px: 6, py: 2 }}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Departments */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
                                Departments
                            </Typography>
                            <Stack spacing={3}>
                                {departments.map((dept, index) => (
                                    <Paper key={index} sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ mt: 0.5 }}>{dept.icon}</Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" component="h3" gutterBottom>
                                                    {dept.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {dept.description}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                                    {dept.contact}
                                                </Typography>
                                                <Typography variant="caption" color="primary.main">
                                                    {dept.responseTime}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Quick answers to common questions
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                How quickly can we get started?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Most hospitals can be up and running within 2-4 weeks, depending on the complexity
                                of your existing systems and integration requirements.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Is there a free trial available?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Yes! We offer a 30-day free trial with full access to all features. No credit
                                card required to get started.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                What kind of support do you provide?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                We provide 24/7 technical support, training sessions, documentation, and dedicated
                                account managers for enterprise customers.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Is my data secure?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Absolutely. We're HIPAA compliant, use end-to-end encryption, and undergo regular
                                security audits to ensure your data is always protected.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA Section */}
            {/* <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    py: 12,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.7 }}>
                        Don't wait to transform your healthcare operations. Contact us today to schedule
                        a demo or start your free trial.
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
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                },
                            }}
                        >
                            Schedule a Demo
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                px: 6,
                                py: 2,
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            Start Free Trial
                        </Button>
                    </Stack>
                </Container>
            </Box> */}
        </Box>
    );
};

export default ContactPage;
