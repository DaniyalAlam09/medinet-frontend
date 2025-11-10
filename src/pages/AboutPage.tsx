import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Stack,
    Avatar,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Analytics as AnalyticsIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    CheckCircle as CheckIcon,
    Star as StarIcon,
    TrendingUp as TrendingIcon,
    Shield as ShieldIcon,
    Support as SupportIcon,
    Schedule as ScheduleIcon,
    Assessment as ReportIcon,
    Public as PublicIcon,
    EmojiEvents as AwardIcon,
    Group as TeamIcon,
    Business as CompanyIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const teamMembers = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Medical Officer',
            image: '/api/placeholder/300/300',
            bio: 'Leading healthcare transformation with 15+ years of experience in medical informatics.',
            specialties: ['Medical Informatics', 'Healthcare IT', 'Patient Safety'],
        },
        {
            name: 'Michael Chen',
            role: 'Chief Technology Officer',
            image: '/api/placeholder/300/300',
            bio: 'Technology visionary with expertise in scalable healthcare systems and data security.',
            specialties: ['System Architecture', 'Data Security', 'Cloud Computing'],
        },
        {
            name: 'Dr. Emily Rodriguez',
            role: 'Head of Product',
            image: '/api/placeholder/300/300',
            bio: 'Product strategist focused on user experience and clinical workflow optimization.',
            specialties: ['Product Strategy', 'UX Design', 'Clinical Workflows'],
        },
        {
            name: 'David Kim',
            role: 'Head of Engineering',
            image: '/api/placeholder/300/300',
            bio: 'Engineering leader passionate about building robust and scalable healthcare solutions.',
            specialties: ['Software Engineering', 'System Integration', 'Performance Optimization'],
        },
    ];

    const values = [
        {
            icon: <ShieldIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Security First',
            description: 'We prioritize data security and privacy in everything we build, ensuring HIPAA compliance and patient data protection.',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
            title: 'Patient-Centered',
            description: 'Every feature we develop is designed to improve patient care and outcomes, putting patients at the center of our mission.',
        },
        {
            icon: <TrendingIcon sx={{ fontSize: 48, color: 'success.main' }} />,
            title: 'Innovation',
            description: 'We continuously innovate to stay ahead of healthcare technology trends and provide cutting-edge solutions.',
        },
        {
            icon: <SupportIcon sx={{ fontSize: 48, color: 'info.main' }} />,
            title: 'Partnership',
            description: 'We work closely with healthcare providers to understand their needs and build solutions that truly serve them.',
        },
    ];

    const milestones = [
        {
            year: '2020',
            title: 'Company Founded',
            description: 'MediNet was founded with a vision to transform healthcare through technology.',
        },
        {
            year: '2021',
            title: 'First Hospital Partnership',
            description: 'Launched our first pilot program with City General Hospital.',
        },
        {
            year: '2022',
            title: 'HIPAA Certification',
            description: 'Achieved full HIPAA compliance and security certification.',
        },
        {
            year: '2023',
            title: '100+ Hospitals',
            description: 'Reached milestone of 100+ connected hospitals nationwide.',
        },
        {
            year: '2024',
            title: 'National Expansion',
            description: 'Expanded to all 50 states with 500+ hospital partners.',
        },
    ];

    const stats = [
        { label: 'Hospitals Connected', value: '500+', icon: <HospitalIcon /> },
        { label: 'Active Users', value: '10K+', icon: <PeopleIcon /> },
        { label: 'Referrals Processed', value: '50K+', icon: <AssignmentIcon /> },
        { label: 'Years of Experience', value: '4+', icon: <AwardIcon /> },
    ];

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
                        About MediNet
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
                        Transforming healthcare through innovative technology and seamless collaboration
                    </Typography>
                </Container>
            </Box>

            {/* Mission Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
                            Our Mission
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                            To revolutionize healthcare delivery by creating seamless connections between hospitals,
                            doctors, and patients through innovative technology solutions that improve care quality,
                            reduce costs, and enhance patient outcomes.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                            We believe that every patient deserves access to the best possible care, regardless of
                            their location or the complexity of their medical needs. By breaking down barriers
                            between healthcare providers, we're creating a more connected and efficient healthcare ecosystem.
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Chip label="Patient-Centered" color="primary" />
                            <Chip label="Innovation-Driven" color="secondary" />
                            <Chip label="Security-Focused" color="success" />
                            <Chip label="Collaborative" color="info" />
                        </Stack>
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
                            <PublicIcon sx={{ fontSize: 80, mb: 3 }} />
                            <Typography variant="h4" gutterBottom>
                                National Impact
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                                Connecting healthcare providers across the country
                            </Typography>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 3 }} />
                            <Grid container spacing={2}>
                                {stats.map((stat, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Values Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                            Our Values
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            The principles that guide everything we do
                        </Typography>
                    </Box>

                    <Grid container spacing={6}>
                        {values.map((value, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        p: 4,
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: theme.shadows[12],
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mx: 'auto',
                                            mb: 3,
                                            bgcolor: `${value.icon.props.sx.color}.light`,
                                        }}
                                    >
                                        {value.icon}
                                    </Avatar>
                                    <Typography variant="h5" component="h3" gutterBottom>
                                        {value.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {value.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Team Section */}
            {/* <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Our Team
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Meet the experts behind MediNet's success
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {teamMembers.map((member, index) => (
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
                                <Avatar
                                    src={member.image}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 3,
                                        bgcolor: 'primary.main',
                                    }}
                                />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {member.name}
                                </Typography>
                                <Typography variant="body2" color="primary.main" sx={{ mb: 2, fontWeight: 600 }}>
                                    {member.role}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                    {member.bio}
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                                    {member.specialties.map((specialty, specIndex) => (
                                        <Chip
                                            key={specIndex}
                                            label={specialty}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    ))}
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container> */}

            {/* Timeline Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
                            Our Journey
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Key milestones in our mission to transform healthcare
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        {/* Timeline line */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                width: '2px',
                                bgcolor: 'primary.main',
                                transform: 'translateX(-50%)',
                                display: { xs: 'none', md: 'block' },
                            }}
                        />

                        <Grid container spacing={4}>
                            {milestones.map((milestone, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            pl: { xs: 0, md: index % 2 === 0 ? 0 : 4 },
                                            pr: { xs: 0, md: index % 2 === 0 ? 4 : 0 },
                                            textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' },
                                        }}
                                    >
                                        {/* Timeline dot */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                left: { xs: 0, md: index % 2 === 0 ? 'calc(100% - 8px)' : '-8px' },
                                                top: '20px',
                                                width: '16px',
                                                height: '16px',
                                                bgcolor: 'primary.main',
                                                borderRadius: '50%',
                                                border: '4px solid white',
                                                boxShadow: '0 0 0 2px #1988C8',
                                                display: { xs: 'block', md: 'block' },
                                            }}
                                        />
                                        <Card sx={{ p: 3 }}>
                                            <Typography variant="h4" color="primary.main" gutterBottom>
                                                {milestone.year}
                                            </Typography>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {milestone.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {milestone.description}
                                            </Typography>
                                        </Card>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>

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
                        Join Our Mission
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.7 }}>
                        Be part of the healthcare transformation. Together, we can create a more connected,
                        efficient, and patient-centered healthcare system.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Chip
                            label="Partner with us"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                px: 3,
                                py: 1,
                                fontSize: '1rem',
                            }}
                        />
                        <Chip
                            label="Join our team"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                px: 3,
                                py: 1,
                                fontSize: '1rem',
                            }}
                        />
                        <Chip
                            label="Learn more"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                px: 3,
                                py: 1,
                                fontSize: '1rem',
                            }}
                        />
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default AboutPage;
