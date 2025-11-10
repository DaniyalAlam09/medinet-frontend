import React, { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import RoleSelectionStep from '../../components/auth/RoleSelectionStep';
import PersonalInfoStep from '../../components/auth/PersonalInfoStep';
import ProfessionalInfoStep from '../../components/auth/ProfessionalInfoStep';
import PasswordStep from '../../components/auth/PasswordStep';
import { authAPI } from '../../utils/api';
import { hospitalApi } from '../../utils/approvalApi';
import { RegisterData } from '../../types/auth';

const getSteps = (role: string) => {
    if (role === 'hospital') {
        return ['Role', 'Hospital Info', 'Password'];
    }
    return ['Role', 'Personal Info', 'Professional Info', 'Password'];
};

const createValidationSchema = (selectedRole: string) => {
    const baseSchema = {
        role: yup.string().required('Please select a role'),
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        phone: yup
            .string()
            .required('Phone number is required')
            .matches(/^\+?[1-9]\d{7,14}$/, 'Enter a valid international phone like +1234567890'),
        dateOfBirth: yup.string().required('Date of birth is required'),
        address: yup.string().required('Address is required'),
        password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required'),
    };

    // Add role-specific validations
    if (selectedRole === 'doctor') {
        return yup.object({
            ...baseSchema,
            gender: yup.string().required('Gender is required'),
            practiceType: yup.string().oneOf(['own_clinic', 'hospital'], 'Please select a practice type').required('Practice type is required'),
            hospitalId: yup.string().when('practiceType', {
                is: 'hospital',
                then: (schema) => schema.required('Hospital selection is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
            clinicName: yup.string().when('practiceType', {
                is: 'own_clinic',
                then: (schema) => schema.required('Clinic name is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
            clinicAddress: yup.object().when('practiceType', {
                is: 'own_clinic',
                then: (schema) => schema.shape({
                    street: yup.string().required('Street address is required'),
                    city: yup.string().required('City is required'),
                    state: yup.string().required('State is required'),
                    zipCode: yup.string().required('ZIP code is required'),
                    country: yup.string().required('Country is required'),
                }),
                otherwise: (schema) => schema.notRequired(),
            }),
            specialization: yup.string().required('Specialization is required'),
            licenseNumber: yup.string().required('Medical license number is required'),
            yearsOfExperience: yup.number().required('Years of experience is required'),
            qualification: yup.string().required('Qualification is required'),
        });
    }


    if (selectedRole === 'patient') {
        return yup.object({
            ...baseSchema,
            gender: yup.string().required('Gender is required'),
            emergencyContact: yup.string().required('Emergency contact name is required'),
            emergencyPhone: yup.string().required('Emergency contact phone is required'),
            medicalHistory: yup.string().optional(),
        });
    }

    if (selectedRole === 'super_admin') {
        return yup.object({
            ...baseSchema,
            adminLevel: yup.string().required('Admin level is required'),
            organization: yup.string().required('Organization is required'),
            responsibilities: yup.string().required('Responsibilities are required'),
        });
    }

    if (selectedRole === 'hospital') {
        return yup.object({
            role: yup.string().required('Please select a role'),
            firstName: yup.string().required('First name is required'),
            lastName: yup.string().required('Last name is required'),
            email: yup.string().email('Please provide a valid email').required('Email is required'),
            password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
            hospitalName: yup.string().required('Hospital name is required'),
            hospitalPhone: yup.string().required('Hospital phone is required'),
            hospitalType: yup.string().required('Hospital type is required'),
            hospitalWebsite: yup.string().url('Please provide a valid website URL').optional(),
            hospitalAddress: yup.string().required('Hospital address is required'),
            hospitalCity: yup.string().required('Hospital city is required'),
            hospitalState: yup.string().required('Hospital state is required'),
            hospitalZipCode: yup.string().required('Hospital ZIP code is required'),
            hospitalCountry: yup.string().required('Hospital country is required'),
            totalBeds: yup.number().min(1, 'Total beds must be at least 1').required('Total beds is required'),
            icuBeds: yup.number().min(0, 'ICU beds cannot be negative').default(0),
            emergencyBeds: yup.number().min(0, 'Emergency beds cannot be negative').default(0),
            specialties: yup.array().of(yup.string()).optional(),
            services: yup.array().of(yup.string()).optional(),
            hospitalDescription: yup.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
        });
    }

    return yup.object(baseSchema);
};

const StepperRegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedRole, setSelectedRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validationSchema = useMemo(() => createValidationSchema(selectedRole), [selectedRole]);
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        reset,
        getValues,
        setValue,
    } = useForm<any>({
        resolver: yupResolver(validationSchema as any),
        mode: 'onChange',
        defaultValues: {
            role: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            hospitalPhone: '',
            dateOfBirth: '',
            address: '',
            gender: '',
            hospitalName: '',
            hospitalType: '',
            hospitalWebsite: '',
            hospitalAddress: '',
            hospitalCity: '',
            hospitalState: '',
            hospitalZipCode: '',
            hospitalCountry: '',
            totalBeds: 0,
            icuBeds: 0,
            emergencyBeds: 0,
            specialties: [],
            services: [],
            hospitalDescription: '',
            practiceType: '',
            hospitalId: '',
            clinicName: '',
            clinicAddress: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'USA',
            },
            clinicPhone: '',
            clinicEmail: '',
            clinicWebsite: '',
            clinicDescription: '',
            specialization: '',
            licenseNumber: '',
            yearsOfExperience: 0,
            qualification: '',
            emergencyContact: '',
            emergencyPhone: '',
            medicalHistory: '',
            adminLevel: '',
            organization: '',
            responsibilities: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleNext = async () => {
        const fieldsToValidate = getFieldsForStep(activeStep);
        const isValid = await trigger(fieldsToValidate as any);

        if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getFieldsForStep = (step: number): string[] => {
        switch (step) {
            case 0:
                return ['role'];
            case 1:
                if (selectedRole === 'hospital') {
                    return ['firstName', 'lastName', 'email', 'hospitalName', 'hospitalPhone', 'hospitalType', 'hospitalWebsite', 'hospitalAddress', 'hospitalCity', 'hospitalState', 'hospitalZipCode', 'hospitalCountry', 'totalBeds', 'icuBeds', 'emergencyBeds', 'specialties', 'services', 'hospitalDescription'];
                }
                const personalFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address', 'gender'];
                return personalFields;
            case 2:
                if (selectedRole === 'doctor') {
                    const fields = ['practiceType', 'specialization', 'licenseNumber', 'yearsOfExperience', 'qualification'];
                    // Add conditional fields based on practiceType
                    const practiceType = getValues('practiceType');
                    if (practiceType === 'hospital') {
                        fields.push('hospitalId');
                    } else if (practiceType === 'own_clinic') {
                        fields.push('clinicName', 'clinicAddress.street', 'clinicAddress.city', 'clinicAddress.state', 'clinicAddress.zipCode', 'clinicAddress.country');
                    }
                    return fields;
                }
                if (selectedRole === 'patient') {
                    return ['emergencyContact', 'emergencyPhone', 'medicalHistory'];
                }
                if (selectedRole === 'super_admin') {
                    return ['adminLevel', 'organization', 'responsibilities'];
                }
                if (selectedRole === 'hospital') {
                    return []; // Hospital fields are in step 1, no step 2 needed
                }
                return [];
            case 3:
                return ['password', 'confirmPassword'];
            default:
                return [];
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            if (selectedRole === 'hospital') {
                // Handle hospital registration
                const hospitalData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    phone: data.hospitalPhone,
                    name: data.hospitalName,
                    address: {
                        street: data.hospitalAddress,
                        city: data.hospitalCity,
                        state: data.hospitalState,
                        zipCode: data.hospitalZipCode,
                        country: data.hospitalCountry,
                    },
                    type: data.hospitalType,
                    specialties: data.specialties || [],
                    capacity: {
                        beds: data.totalBeds,
                        icuBeds: data.icuBeds || 0,
                        emergencyBeds: data.emergencyBeds || 0,
                    },
                    services: data.services || [],
                    website: data.hospitalWebsite,
                    description: data.hospitalDescription,
                };

                await hospitalApi.registerHospital(hospitalData);
                toast.success('Hospital registered successfully! Please login to complete your administrator registration.');
                navigate('/login', {
                    state: {
                        message: 'Hospital registered successfully! Please login to complete your administrator registration.'
                    }
                });
            } else {
                // Handle user registration
                let registerData: any = {
                    ...data,
                    role: selectedRole as 'patient' | 'doctor' | 'super_admin',
                };

                // For doctors, format clinic data if own_clinic
                if (selectedRole === 'doctor' && data.practiceType === 'own_clinic') {
                    registerData.clinicAddress = data.clinicAddress;
                }

                await authAPI.register(registerData);
                toast.success('Registration successful! Please check your email for verification.');
                navigate('/login');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step: number) => {
        // Adjust step numbers based on role
        let actualStep = step;
        if (selectedRole === 'hospital') {
            // Hospital: Role -> Hospital Info -> Password (skip professional info)
            if (step === 2) actualStep = 3; // Skip step 2, move password to step 2
        }

        switch (actualStep) {
            case 0:
                return (
                    <RoleSelectionStep
                        selectedRole={selectedRole}
                        onRoleChange={(role) => {
                            setSelectedRole(role);
                            reset({ role });
                        }}
                        error={errors.role?.message as string}
                    />
                );
            case 1:
                return (
                    <PersonalInfoStep
                        control={control}
                        errors={errors}
                        selectedRole={selectedRole}
                    />
                );
            case 2:
                if (selectedRole === 'hospital') {
                    // For hospital, step 2 is password
                    return (
                        <PasswordStep
                            control={control}
                            errors={errors}
                            showPassword={showPassword}
                            showConfirmPassword={showConfirmPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    );
                }
                return (
                    <ProfessionalInfoStep
                        control={control}
                        errors={errors}
                        selectedRole={selectedRole}
                    />
                );
            case 3:
                return (
                    <PasswordStep
                        control={control}
                        errors={errors}
                        showPassword={showPassword}
                        showConfirmPassword={showConfirmPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                );
            default:
                return null;
        }
    };

    const isStepOptional = (_step: number) => {
        return false; // No steps are optional now
    };

    const canProceed = () => {
        if (activeStep === 0) return selectedRole !== '';
        return true;
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1988C8 0%, #339164 100%)',
                p: 2,
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    maxWidth: 800,
                    width: '100%',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, color: '#1988C8' }}>
                    Create Account
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {getSteps(selectedRole).map((label, index) => (
                        <Step key={label}>
                            <StepLabel optional={isStepOptional(index) && <Typography variant="caption">Optional</Typography>}>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mb: 4 }}>
                    {renderStepContent(activeStep)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === getSteps(selectedRole).length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                            sx={{
                                backgroundColor: '#1988C8',
                                '&:hover': { backgroundColor: '#1976D2' },
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!canProceed()}
                            sx={{
                                backgroundColor: '#1988C8',
                                '&:hover': { backgroundColor: '#1976D2' },
                            }}
                        >
                            Next
                        </Button>
                    )}
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Button
                            variant="text"
                            onClick={() => navigate('/login')}
                            sx={{ color: '#1988C8', textTransform: 'none' }}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default StepperRegisterPage;
