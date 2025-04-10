import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    Paper,
    IconButton,
    InputAdornment,
    createTheme,
    ThemeProvider,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../features/authSlice';

// Custom theme using only the specified colors
const theme = createTheme({
    palette: {
        primary: {
            main: '#0F172A',       // Dark blue (primary color)
            contrastText: '#FFFFFF' // White text for better contrast
        },
        secondary: {
            main: '#CED1D5',       // Light gray (secondary color)
            contrastText: '#0F172A' // Dark text for contrast
        },
        background: {
            default: '#F1F5F9',    // Very light gray (background)
            paper: '#FFFFFF'        // White for paper components
        },
        text: {
            primary: '#0F172A',    // Dark text
            secondary: '#64748B'    // Slightly lighter text for secondary elements
        },
        error: {
            main: '#FF6B8B'        // Keeping a visible error color (not in your palette but needed)
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F1F5F9',
                    borderRadius: 4,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#CED1D5',
                        },
                        '&:hover fieldset': {
                            borderColor: '#0F172A',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#0F172A',
                            borderWidth: 1
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#64748B',
                        '&.Mui-focused': {
                            color: '#0F172A'
                        }
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    borderRadius: 8,
                    '&:hover': {
                        backgroundColor: '#1E293B',
                        boxShadow: 'none'
                    },
                    '&:disabled': {
                        backgroundColor: '#CED1D5',
                        color: '#94A3B8'
                    }
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid #CED1D5',
                    borderRadius: 12,
                    boxShadow: '0px 4px 6px rgba(15, 23, 42, 0.05)',
                    padding: '32px'
                }
            }
        }
    },
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChangePassword = () => {
    const [values, setValues] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
    });

    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);


    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setErrors({ ...errors, [prop]: '' });
    };

    const handleClickShowPassword = (prop) => () => {
        setValues({ ...values, [prop]: !values[prop] });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        };

        if (!values.oldPassword) {
            newErrors.oldPassword = 'Old password is required';
            valid = false;
        }

        if (!values.newPassword) {
            newErrors.newPassword = 'New password is required';
            valid = false;
        } else if (values.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
            valid = false;
        }

        if (!values.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
            valid = false;
        } else if (values.newPassword !== values.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError('');
        setSubmitSuccess(false);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/auth/change-password`,
                {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    userId: user.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSubmitSuccess(true);
            setValues({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                showOldPassword: false,
                showNewPassword: false,
                showConfirmPassword: false,
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to change password';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    padding: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Paper>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <LockIcon
                                sx={{
                                    fontSize: 64,
                                    padding: 1,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(15, 23, 42, 0.05)',
                                    color: 'primary.main',
                                    mb: 2
                                }}
                            />
                            <Typography
                                variant="h5"
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                }}
                            >
                                Change Password
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Old Password"
                                    type={values.showOldPassword ? 'text' : 'password'}
                                    value={values.oldPassword}
                                    onChange={handleChange('oldPassword')}
                                    error={Boolean(errors.oldPassword)}
                                    helperText={errors.oldPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword('showOldPassword')}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {values.showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="New Password"
                                    type={values.showNewPassword ? 'text' : 'password'}
                                    value={values.newPassword}
                                    onChange={handleChange('newPassword')}
                                    error={Boolean(errors.newPassword)}
                                    helperText={errors.newPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword('showNewPassword')}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {values.showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Confirm New Password"
                                    type={values.showConfirmPassword ? 'text' : 'password'}
                                    value={values.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    error={Boolean(errors.confirmPassword)}
                                    helperText={errors.confirmPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword('showConfirmPassword')}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        Changing...
                                    </>
                                ) : 'Change Password'}
                            </Button>
                        </form>
                    </Paper>
                </Container>

                {/* Success and Error Snackbars */}
                <Snackbar
                    open={!!submitError}
                    autoHideDuration={6000}
                    onClose={() => setSubmitError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={submitSuccess}
                    autoHideDuration={6000}
                    onClose={() => setSubmitSuccess(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                        Password changed successfully!
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default ChangePassword;