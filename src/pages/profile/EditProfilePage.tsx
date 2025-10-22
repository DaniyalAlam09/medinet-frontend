import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Avatar,
    Chip,
    Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../utils/api';

type FormValues = any;

const EditProfilePage: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const schema = useMemo(() => {
        const base = {
            firstName: yup.string().required('First name is required'),
            lastName: yup.string().required('Last name is required'),
            phone: yup
                .string()
                .nullable()
                .matches(/^\+?[1-9]\d{7,14}$/,
                    'Enter a valid international phone like +1234567890'),
            dateOfBirth: yup.string().nullable(),
            gender: yup.string().oneOf(['male', 'female', 'other', '']).nullable(),
            address: yup.object().shape({
                street: yup.string().nullable(),
                city: yup.string().nullable(),
                state: yup.string().nullable(),
                zipCode: yup.string().nullable(),
                country: yup.string().nullable(),
            }),
        };

        if (!user) return yup.object(base);

        switch (user.role) {
            case 'doctor':
                return yup.object({
                    ...base,
                    licenseNumber: yup.string().nullable(),
                    specialization: yup.string().nullable(),
                    yearsOfExperience: yup.number().typeError('Must be a number').min(0).nullable(),
                    qualification: yup.string().nullable(),
                });
            case 'hospital':
                return yup.object({
                    ...base,
                    department: yup.string().nullable(),
                    position: yup.string().nullable(),
                });
            case 'patient':
                return yup.object({
                    ...base,
                    emergencyContact: yup.string().nullable(),
                    emergencyPhone: yup.string().nullable(),
                    medicalHistory: yup.string().nullable(),
                });
            case 'super_admin':
                return yup.object({
                    ...base,
                    adminLevel: yup
                        .string()
                        .oneOf(['system', 'platform', 'support'], 'Select a valid admin level')
                        .nullable(),
                    organization: yup.string().nullable(),
                    responsibilities: yup.string().nullable(),
                });
            default:
                return yup.object(base);
        }
    }, [user]);

    const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: user || {},
    });

    useEffect(() => {
        if (user) {
            reset(user as any);
            setPreview(user.profileImage || null);
        }
    }, [user, reset]);

    const onSubmit = async (values: FormValues) => {
        try {
            const { email, role, _id, approvalStatus, approvedAt, approvedBy, isEmailVerified, isActive, createdAt, updatedAt, ...payload } = values;
            const { data } = await authAPI.updateProfile(payload);
            if (data?.success) {
                await refreshUser?.();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await authAPI.uploadProfileImage(file);
            const url = res.data?.url;
            if (url) {
                setPreview(url);
                setValue('profileImage', url);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    const renderRoleFields = () => {
        if (!user) return null;
        switch (user.role) {
            case 'doctor':
                return (
                    <>
                        <Grid item xs={12} md={6}>
                            <Controller name="licenseNumber" control={control} render={({ field }) => (
                                <TextField {...field} label="License Number" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name="specialization" control={control} render={({ field }) => (
                                <TextField {...field} label="Specialization" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name="yearsOfExperience" control={control} render={({ field }) => (
                                <TextField {...field} type="number" label="Years of Experience" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name="qualification" control={control} render={({ field }) => (
                                <TextField {...field} label="Qualification" fullWidth />
                            )} />
                        </Grid>
                    </>
                );
            case 'hospital':
                return (
                    <>
                        <Grid item xs={12} md={6}>
                            <Controller name="department" control={control} render={({ field }) => (
                                <TextField {...field} label="Department" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name="position" control={control} render={({ field }) => (
                                <TextField {...field} label="Position" fullWidth />
                            )} />
                        </Grid>
                    </>
                );
            case 'patient':
                return (
                    <>
                        <Grid item xs={12} md={6}>
                            <Controller name="emergencyContact" control={control} render={({ field }) => (
                                <TextField {...field} label="Emergency Contact" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name="emergencyPhone" control={control} render={({ field }) => (
                                <TextField {...field} label="Emergency Phone" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller name="medicalHistory" control={control} render={({ field }) => (
                                <TextField {...field} label="Medical History" fullWidth multiline minRows={3} />
                            )} />
                        </Grid>
                    </>
                );
            case 'super_admin':
                return (
                    <>
                        <Grid item xs={12} md={6}>
                            <Controller name="adminLevel" control={control} render={({ field }) => (
                                <TextField {...field} select label="Admin Level" fullWidth>
                                    <MenuItem value="system">System</MenuItem>
                                    <MenuItem value="platform">Platform</MenuItem>
                                    <MenuItem value="support">Support</MenuItem>
                                </TextField>
                            )} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller name="organization" control={control} render={({ field }) => (
                                <TextField {...field} label="Organization" fullWidth />
                            )} />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller name="responsibilities" control={control} render={({ field }) => (
                                <TextField {...field} label="Responsibilities" fullWidth multiline minRows={3} />
                            )} />
                        </Grid>
                    </>
                );
            default:
                return null;
        }
    };

    if (!user) return null;

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Edit Profile</Typography>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2} alignItems="center">
                                <Avatar src={preview || undefined} sx={{ width: 120, height: 120 }}>
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </Avatar>
                                <Button variant="outlined" component="label" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                </Button>
                                <Chip label={user.role.replace('_', ' ')} color="primary" variant="outlined" />
                                <Chip label={`Status: ${user.approvalStatus}`} color={user.approvalStatus === 'approved' ? 'success' : 'warning'} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
                                <Grid item xs={12} md={6}>
                                    <Controller name="firstName" control={control} render={({ field }) => (
                                        <TextField {...field} label="First Name" fullWidth required />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="lastName" control={control} render={({ field }) => (
                                        <TextField {...field} label="Last Name" fullWidth required />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField value={user.email} label="Email" fullWidth disabled />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="phone" control={control} render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Phone"
                                            fullWidth
                                            onChange={(e) => {
                                                // Keep only + and digits; no spaces or symbols
                                                const raw = e.target.value.replace(/[^+\d]/g, '');
                                                field.onChange(raw);
                                            }}
                                            placeholder="+1234567890"
                                        />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="dateOfBirth" control={control} render={({ field }) => (
                                        <TextField {...field} type="date" label="Date of Birth" fullWidth InputLabelProps={{ shrink: true }} />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="gender" control={control} render={({ field }) => (
                                        <TextField {...field} select label="Gender" fullWidth>
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                        </TextField>
                                    )} />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Controller name="address.street" control={control} render={({ field }) => (
                                        <TextField {...field} label="Street" fullWidth />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="address.city" control={control} render={({ field }) => (
                                        <TextField {...field} label="City" fullWidth />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="address.state" control={control} render={({ field }) => (
                                        <TextField {...field} label="State" fullWidth />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="address.zipCode" control={control} render={({ field }) => (
                                        <TextField {...field} label="Zip Code" fullWidth />
                                    )} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name="address.country" control={control} render={({ field }) => (
                                        <TextField {...field} label="Country" fullWidth />
                                    )} />
                                </Grid>

                                {renderRoleFields()}

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button variant="outlined" onClick={() => reset(user as any)}>Reset</Button>
                                        <Button variant="contained" type="submit" disabled={isSubmitting}>Save Changes</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditProfilePage;


