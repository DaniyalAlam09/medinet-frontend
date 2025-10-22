import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Autocomplete,
    CircularProgress,
    Chip,
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { hospitalApi } from '../../utils/approvalApi';
import { Hospital } from '../../types/hospital';

interface ProfessionalInfoStepProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    selectedRole: string;
}

const ProfessionalInfoStep: React.FC<ProfessionalInfoStepProps> = ({
    control,
    errors,
    selectedRole,
}) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loadingHospitals, setLoadingHospitals] = useState(false);

    useEffect(() => {
        if (selectedRole === 'doctor') {
            loadHospitals();
        }
    }, [selectedRole]);

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

    // All roles now have professional info step

    return (
        <Box>
            <Grid container spacing={3}>
                {selectedRole === 'doctor' && (
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
                )}

                {selectedRole === 'doctor' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="specialization"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Specialization"
                                        required
                                        error={!!errors.specialization}
                                        helperText={errors.specialization?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="licenseNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Medical License Number"
                                        required
                                        error={!!errors.licenseNumber}
                                        helperText={errors.licenseNumber?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="yearsOfExperience"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth required error={!!errors.yearsOfExperience}>
                                        <InputLabel>Years of Experience</InputLabel>
                                        <Select {...field} label="Years of Experience" value={field.value || ''}>
                                            {Array.from({ length: 50 }, (_, i) => i + 1).map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year} {year === 1 ? 'year' : 'years'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.yearsOfExperience && (
                                            <FormHelperText>{errors.yearsOfExperience.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="qualification"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Qualification"
                                        required
                                        error={!!errors.qualification}
                                        helperText={errors.qualification?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </>
                )}


                {selectedRole === 'patient' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="emergencyContact"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Emergency Contact Name"
                                        required
                                        error={!!errors.emergencyContact}
                                        helperText={errors.emergencyContact?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="emergencyPhone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Emergency Contact Phone"
                                        required
                                        error={!!errors.emergencyPhone}
                                        helperText={errors.emergencyPhone?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="medicalHistory"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Medical History (Optional)"
                                        multiline
                                        rows={3}
                                        error={!!errors.medicalHistory}
                                        helperText={errors.medicalHistory?.message || "Any relevant medical conditions or allergies"}
                                    />
                                )}
                            />
                        </Grid>
                    </>
                )}

                {selectedRole === 'super_admin' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="adminLevel"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth required error={!!errors.adminLevel}>
                                        <InputLabel>Admin Level</InputLabel>
                                        <Select {...field} label="Admin Level" value={field.value || ''}>
                                            <MenuItem value="system">System Administrator</MenuItem>
                                            <MenuItem value="platform">Platform Administrator</MenuItem>
                                            <MenuItem value="support">Support Administrator</MenuItem>
                                        </Select>
                                        {errors.adminLevel && (
                                            <FormHelperText>{errors.adminLevel.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="organization"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Organization"
                                        required
                                        error={!!errors.organization}
                                        helperText={errors.organization?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="responsibilities"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Key Responsibilities"
                                        multiline
                                        rows={3}
                                        required
                                        error={!!errors.responsibilities}
                                        helperText={errors.responsibilities?.message || "Describe your main responsibilities in the system"}
                                    />
                                )}
                            />
                        </Grid>
                    </>
                )}

            </Grid>
        </Box>
    );
};

export default ProfessionalInfoStep;
