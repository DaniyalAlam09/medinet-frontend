import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Divider,
    Autocomplete,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, RegisterData } from '../../types/auth';
import { hospitalApi } from '../../utils/approvalApi';
import { Hospital } from '../../types/hospital';

const schema = yup.object({
    firstName: yup
        .string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters'),
    lastName: yup
        .string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters'),
    email: yup
        .string()
        .email('Please provide a valid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    role: yup
        .string()
        .oneOf(['super_admin', 'hospital', 'doctor', 'patient'], 'Invalid role selected')
        .required('Role is required'),
    phone: yup
        .string()
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number'),
    dateOfBirth: yup
        .string()
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date (YYYY-MM-DD)'),
    gender: yup
        .string()
        .oneOf(['male', 'female', 'other'], 'Invalid gender selected')
        .when('role', {
            is: (role: string) => role === 'hospital',
            then: (schema) => schema.optional(),
            otherwise: (schema) => schema.optional(),
        }),
    address: yup.object({
        street: yup.string().max(100, 'Street address must not exceed 100 characters').optional(),
        city: yup.string().max(50, 'City must not exceed 50 characters').optional(),
        state: yup.string().max(50, 'State must not exceed 50 characters').optional(),
        zipCode: yup.string().max(10, 'Zip code must not exceed 10 characters').optional(),
        country: yup.string().max(50, 'Country must not exceed 50 characters').optional(),
    }).optional(),
    hospitalId: yup
        .string()
        .when('role', {
            is: (role: string) => role === 'doctor',
            then: (schema) => schema.required('Hospital ID is required for doctors'),
            otherwise: (schema) => schema.optional(),
        }),
    licenseNumber: yup
        .string()
        .when('role', {
            is: 'doctor',
            then: (schema) => schema
                .required('License number is required for doctors')
                .min(5, 'License number must be at least 5 characters')
                .max(20, 'License number must not exceed 20 characters'),
            otherwise: (schema) => schema.optional(),
        }),
    specialization: yup
        .string()
        .when('role', {
            is: 'doctor',
            then: (schema) => schema
                .required('Specialization is required for doctors')
                .min(2, 'Specialization must be at least 2 characters')
                .max(100, 'Specialization must not exceed 100 characters'),
            otherwise: (schema) => schema.optional(),
        }),
    yearsOfExperience: yup
        .number()
        .when('role', {
            is: 'doctor',
            then: (schema) => schema
                .required('Years of experience is required for doctors')
                .min(0, 'Years of experience must be at least 0')
                .max(50, 'Years of experience must not exceed 50'),
            otherwise: (schema) => schema.optional(),
        }),
});

type RegisterFormData = yup.InferType<typeof schema>;

const RegisterPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'patient',
            address: {},
        },
    });

    const watchedRole = watch('role');
    console.log("errors", errors)
    // Load hospitals when component mounts
    useEffect(() => {
        const loadHospitals = async () => {
            try {
                setLoadingHospitals(true);
                const response = await hospitalApi.getApprovedHospitals();
                setHospitals(response.data);
            } catch (error) {
                console.error('Error loading hospitals:', error);
            } finally {
                setLoadingHospitals(false);
            }
        };

        loadHospitals();
    }, []);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            // Convert form data to RegisterData format
            const registerData: RegisterData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                role: data.role,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                address: data.address,
                hospitalId: data.hospitalId,
                licenseNumber: data.licenseNumber,
                specialization: data.specialization,
                yearsOfExperience: data.yearsOfExperience,
            };
            await registerUser(registerData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const roles: { value: UserRole; label: string }[] = [
        { value: 'patient', label: 'Patient' },
        { value: 'doctor', label: 'Doctor' },
        { value: 'hospital', label: 'Hospital Administrator' },
    ];

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Box textAlign="center" mb={3}>
                        <Typography component="h1" variant="h4" gutterBottom>
                            Create Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join MediNet and start managing healthcare better
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate>
                        <Grid container spacing={2}>
                            {/* Basic Information */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Basic Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('firstName')}
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="given-name"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('lastName')}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('email')}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('phone')}
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    name="phone"
                                    autoComplete="tel"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('dateOfBirth')}
                                    fullWidth
                                    id="dateOfBirth"
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.gender}>
                                            <InputLabel id="gender-label">Gender</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="gender-label"
                                                id="gender"
                                                label="Gender"
                                            >
                                                {genders.map((gender) => (
                                                    <MenuItem key={gender.value} value={gender.value}>
                                                        {gender.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.gender && (
                                                <FormHelperText error>{errors.gender.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            {/* Address Information */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Address Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    {...register('address.street')}
                                    fullWidth
                                    id="street"
                                    label="Street Address"
                                    name="address.street"
                                    error={!!errors.address?.street}
                                    helperText={errors.address?.street?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('address.city')}
                                    fullWidth
                                    id="city"
                                    label="City"
                                    name="address.city"
                                    error={!!errors.address?.city}
                                    helperText={errors.address?.city?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('address.state')}
                                    fullWidth
                                    id="state"
                                    label="State/Province"
                                    name="address.state"
                                    error={!!errors.address?.state}
                                    helperText={errors.address?.state?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('address.zipCode')}
                                    fullWidth
                                    id="zipCode"
                                    label="ZIP/Postal Code"
                                    name="address.zipCode"
                                    error={!!errors.address?.zipCode}
                                    helperText={errors.address?.zipCode?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('address.country')}
                                    fullWidth
                                    id="country"
                                    label="Country"
                                    name="address.country"
                                    error={!!errors.address?.country}
                                    helperText={errors.address?.country?.message}
                                />
                            </Grid>

                            {/* Role and Authentication */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Role and Authentication
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.role}>
                                            <InputLabel id="role-label">Role</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="role-label"
                                                id="role"
                                                label="Role"
                                            >
                                                {roles.map((role) => (
                                                    <MenuItem key={role.value} value={role.value}>
                                                        {role.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.role && (
                                                <FormHelperText error>{errors.role.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            {/* Hospital Information - Required for doctor only */}
                            {watchedRole === 'doctor' && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Hospital Information
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Controller
                                            name="hospitalId"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={hospitals}
                                                    getOptionLabel={(option) =>
                                                        typeof option === 'string' ? option : `${option.name} - ${option.address.city}, ${option.address.state}`
                                                    }
                                                    isOptionEqualToValue={(option, value) =>
                                                        typeof option === 'string' ? option === value : option._id === value?._id
                                                    }
                                                    loading={loadingHospitals}
                                                    value={hospitals.find(h => h._id === field.value) || null}
                                                    onChange={(_, value) => {
                                                        field.onChange(value?._id || '');
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            required
                                                            fullWidth
                                                            label="Select Hospital"
                                                            error={!!errors.hospitalId}
                                                            helperText={errors.hospitalId?.message || "Select the hospital you'll be associated with"}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <>
                                                                        {loadingHospitals ? <CircularProgress color="inherit" size={20} /> : null}
                                                                        {params.InputProps.endAdornment}
                                                                    </>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* Hospital Admin Information */}
                            {watchedRole === 'hospital' && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Administrator Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            You will be linked to your hospital after registration and approval.
                                        </Typography>
                                    </Grid>
                                </>
                            )}

                            {/* Doctor-specific Information */}
                            {watchedRole === 'doctor' && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Professional Information
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            {...register('licenseNumber')}
                                            required
                                            fullWidth
                                            id="licenseNumber"
                                            label="License Number"
                                            name="licenseNumber"
                                            error={!!errors.licenseNumber}
                                            helperText={errors.licenseNumber?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            {...register('specialization')}
                                            required
                                            fullWidth
                                            id="specialization"
                                            label="Specialization"
                                            name="specialization"
                                            error={!!errors.specialization}
                                            helperText={errors.specialization?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            {...register('yearsOfExperience')}
                                            required
                                            fullWidth
                                            id="yearsOfExperience"
                                            label="Years of Experience"
                                            name="yearsOfExperience"
                                            type="number"
                                            inputProps={{ min: 0, max: 50 }}
                                            error={!!errors.yearsOfExperience}
                                            helperText={errors.yearsOfExperience?.message}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* Password Information */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Password
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('password')}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message || "Must contain uppercase, lowercase, and number"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register('confirmPassword')}
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle confirm password visibility"
                                                    onClick={handleToggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
                        </Button>
                        <Box textAlign="center">
                            <Link component={RouterLink} to="/login" variant="body2">
                                Already have an account? Sign In
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterPage;
