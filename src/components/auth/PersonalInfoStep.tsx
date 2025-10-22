import React from 'react';
import {
    Box,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Typography,
    Chip,
    Autocomplete,
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';

interface PersonalInfoStepProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    selectedRole: string;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
    control,
    errors,
    selectedRole,
}) => {
    // If hospital role, show hospital fields instead of personal fields
    if (selectedRole === 'hospital') {
        return (
            <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Hospital Information
                </Typography>
                <Grid container spacing={3}>
                    {/* Personal Information */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="First Name"
                                    required
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Last Name"
                                    required
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Basic Hospital Information */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Hospital Name"
                                    required
                                    error={!!errors.hospitalName}
                                    helperText={errors.hospitalName?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    required
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalPhone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Hospital Phone"
                                    required
                                    error={!!errors.hospitalPhone}
                                    helperText={errors.hospitalPhone?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalType"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth required error={!!errors.hospitalType}>
                                    <InputLabel>Hospital Type</InputLabel>
                                    <Select {...field} label="Hospital Type" value={field.value || ''}>
                                        <MenuItem value="public">Public</MenuItem>
                                        <MenuItem value="private">Private</MenuItem>
                                        <MenuItem value="non-profit">Non-Profit</MenuItem>
                                        <MenuItem value="government">Government</MenuItem>
                                    </Select>
                                    {errors.hospitalType && (
                                        <FormHelperText>{errors.hospitalType.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalWebsite"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Website URL (Optional)"
                                    error={!!errors.hospitalWebsite}
                                    helperText={errors.hospitalWebsite?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                            Address
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="hospitalAddress"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Street Address"
                                    required
                                    error={!!errors.hospitalAddress}
                                    helperText={errors.hospitalAddress?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalCity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="City"
                                    required
                                    error={!!errors.hospitalCity}
                                    helperText={errors.hospitalCity?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalState"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="State"
                                    required
                                    error={!!errors.hospitalState}
                                    helperText={errors.hospitalState?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalZipCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="ZIP Code"
                                    required
                                    error={!!errors.hospitalZipCode}
                                    helperText={errors.hospitalZipCode?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="hospitalCountry"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Country"
                                    required
                                    defaultValue="USA"
                                    error={!!errors.hospitalCountry}
                                    helperText={errors.hospitalCountry?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Capacity */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                            Capacity
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name="totalBeds"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Total Beds"
                                    type="number"
                                    required
                                    error={!!errors.totalBeds}
                                    helperText={errors.totalBeds?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name="icuBeds"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="ICU Beds"
                                    type="number"
                                    defaultValue={0}
                                    error={!!errors.icuBeds}
                                    helperText={errors.icuBeds?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Controller
                            name="emergencyBeds"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Emergency Beds"
                                    type="number"
                                    defaultValue={0}
                                    error={!!errors.emergencyBeds}
                                    helperText={errors.emergencyBeds?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Specialties and Services */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                            Specialties & Services
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="specialties"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    multiple
                                    options={[
                                        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology',
                                        'General Medicine', 'Emergency Medicine', 'Surgery', 'Radiology',
                                        'Anesthesiology', 'Dermatology', 'Ophthalmology', 'ENT', 'Urology'
                                    ]}
                                    freeSolo
                                    value={field.value || []}
                                    onChange={(_, value) => field.onChange(value)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                                key={option}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Specialties"
                                            placeholder="Select or add specialties"
                                            error={!!errors.specialties}
                                            helperText={errors.specialties?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="services"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    multiple
                                    options={[
                                        'Emergency', 'Surgery', 'ICU', 'Outpatient', 'Laboratory',
                                        'Radiology', 'Pharmacy', 'Physical Therapy', 'Mental Health',
                                        'Maternity', 'Pediatrics', 'Geriatrics', 'Rehabilitation'
                                    ]}
                                    freeSolo
                                    value={field.value || []}
                                    onChange={(_, value) => field.onChange(value)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                                key={option}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Services"
                                            placeholder="Select or add services"
                                            error={!!errors.services}
                                            helperText={errors.services?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="hospitalDescription"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Hospital Description (Optional)"
                                    error={!!errors.hospitalDescription}
                                    helperText={errors.hospitalDescription?.message || "Describe your hospital's mission and services"}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    // For other roles, show personal information fields
    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Personal Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="First Name"
                                required
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Last Name"
                                required
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Email Address"
                                type="email"
                                required
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Phone Number"
                                required
                                error={!!errors.phone}
                                helperText={errors.phone?.message || 'Format: +1234567890'}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/[^+\d]/g, '');
                                    field.onChange(raw);
                                }}
                                placeholder="+1234567890"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                required
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth required error={!!errors.gender}>
                                <InputLabel>Gender</InputLabel>
                                <Select {...field} label="Gender" value={field.value || ''}>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {errors.gender && (
                                    <FormHelperText>{errors.gender.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Address"
                                multiline
                                rows={3}
                                required
                                error={!!errors.address}
                                helperText={errors.address?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PersonalInfoStep;
