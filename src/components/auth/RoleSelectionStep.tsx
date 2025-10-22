import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Grid,
} from '@mui/material';
import {
    Person as PersonIcon,
    LocalHospital as HospitalIcon,
    AdminPanelSettings as AdminIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';

interface RoleSelectionStepProps {
    selectedRole: string;
    onRoleChange: (role: string) => void;
    error?: string;
}

const roles = [
    {
        value: 'patient',
        label: 'Patient',
        description: 'Access your health records and manage appointments',
        icon: <PersonIcon sx={{ fontSize: 40, color: '#1988C8' }} />,
        color: '#1988C8',
    },
    {
        value: 'doctor',
        label: 'Doctor',
        description: 'Manage patients, create referrals, and view health records',
        icon: <HospitalIcon sx={{ fontSize: 40, color: '#339164' }} />,
        color: '#339164',
    },
    {
        value: 'hospital',
        label: 'Hospital',
        description: 'Register your hospital to join the MediNet network',
        icon: <BusinessIcon sx={{ fontSize: 40, color: '#339164' }} />,
        color: '#339164',
    },
    {
        value: 'super_admin',
        label: 'Super Admin',
        description: 'System administration and user management',
        icon: <AdminIcon sx={{ fontSize: 40, color: '#1988C8' }} />,
        color: '#1988C8',
    },
];

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({
    selectedRole,
    onRoleChange,
    error,
}) => {
    return (
        <Box>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                Choose Your Role
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Select the role that best describes your position in the healthcare system
            </Typography>

            <FormControl component="fieldset" error={!!error} fullWidth>
                <RadioGroup
                    value={selectedRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                    sx={{ gap: 2 }}
                >
                    <Grid container spacing={2}>
                        {roles.map((role) => (
                            <Grid item xs={12} sm={6} key={role.value}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedRole === role.value ? `2px solid ${role.color}` : '2px solid transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: role.color,
                                            boxShadow: 2,
                                        },
                                    }}
                                    onClick={() => onRoleChange(role.value)}
                                >
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Box sx={{ mb: 2 }}>
                                            {role.icon}
                                        </Box>
                                        <Typography variant="h6" gutterBottom>
                                            {role.label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {role.description}
                                        </Typography>
                                        <FormControlLabel
                                            value={role.value}
                                            control={<Radio sx={{ color: role.color }} />}
                                            label=""
                                            sx={{ m: 0 }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </RadioGroup>
                {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
            </FormControl>
        </Box>
    );
};

export default RoleSelectionStep;
