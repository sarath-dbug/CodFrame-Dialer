import { useState } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  ThemeProvider,
  createTheme,
  Snackbar, 
  Alert
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Person, Business, Phone, Lock } from "@mui/icons-material"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice'; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Custom theme based on the provided image
const theme = createTheme({
  palette: {
    primary: {
      main: "#0f1729", 
      light: "#1e2a45",
      dark: "#0a101d",
      contrastText: "#fff",
    },
    secondary: {
      main: "#3a7bfd", 
      light: "#5a93ff",
      dark: "#2a5fd0",
      contrastText: "#fff",
    },
    error: {
      main: "#e53935", 
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f1729",
      secondary: "#546e7a",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          padding: "10px 24px",
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
})

// Validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

const validatePhone = (phone) => {
  // Pattern that enforces exactly 10 digits with optional formatting
  const re = /^(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10; // Change to 9 if needed
};

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    contactNumber: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    contactNumber: '',
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleToggleView = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setErrors({
      firstName: '',
      lastName: '',
      companyName: '',
      contactNumber: '',
      email: '',
      password: '',
    });
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      contactNumber: '',
      email: '',
      password: '',
    });
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const validateField = (name, value) => {
    let errorMsg = '';
    
    switch (name) {
      case 'email':
        if (!value) {
          errorMsg = 'Email is required';
        } else if (!validateEmail(value)) {
          errorMsg = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          errorMsg = 'Password is required';
        } else if (!isLogin && !validatePassword(value)) {
          errorMsg = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        }
        break;
      case 'firstName':
      case 'lastName':
        if (!value && !isLogin) {
          errorMsg = 'This field is required';
        } else if (value.length > 50) {
          errorMsg = 'Must be 50 characters or less';
        }
        break;
      case 'companyName':
        if (!value && !isLogin) {
          errorMsg = 'Company name is required';
        }
        break;
      case 'contactNumber':
        if (!value && !isLogin) {
          errorMsg = 'Contact number is required';
        } else if (!validatePhone(value) && !isLogin) {
          errorMsg = 'Please enter a valid phone number';
        }
        break;
      default:
        break;
    }
    
    return errorMsg;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const errorMsg = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (isLogin && !['email', 'password'].includes(key)) return;
      
      const errorMsg = validateField(key, formData[key]);
      newErrors[key] = errorMsg;
      
      if (errorMsg) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token,
      }));
      
      sessionStorage.setItem('auth', JSON.stringify({
        user: response.data.user,
        token: response.data.token,
      }));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.msg || 'Login failed');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.msg || 'Registration failed');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate the form before submission
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Handle login
        const response = await handleLogin(formData.email, formData.password);
        
        console.log('Login successful:', response);
        setSuccess('Login successful!');
        nav("/app/dashboard");
      } else {
        // Handle registration
        const response = await handleRegister({
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          contactNumber: formData.contactNumber,
          email: formData.email,
          password: formData.password,
        });

        console.log('Registration successful:', response);
        setSuccess('Registration successful! You can now login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('API error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Error/Success Alerts */}
            {error && (
              <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              </Snackbar>
            )}
            {success && (
              <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                  {success}
                </Alert>
              </Snackbar>
            )}

            {/* Logo or Brand Section */}
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: "bold" }}>
                Admin Panel
              </Typography>
            </Box>

            <Typography variant="h5" component="h2" gutterBottom align="center">
              {isLogin ? "Sign In" : "Create Account"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {!isLogin && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="companyName"
                      name="companyName"
                      label="Company Name"
                      autoComplete="organization"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      error={!!errors.companyName}
                      helperText={errors.companyName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="contactNumber"
                      name="contactNumber"
                      label="Contact Number"
                      autoComplete="tel"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      error={!!errors.contactNumber}
                      helperText={errors.contactNumber}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                margin="normal"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                margin="normal"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <MuiLink
                    component="button"
                    variant="body2"
                    onClick={handleToggleView}
                    sx={{ fontWeight: "medium", cursor: "pointer" }}
                    color="secondary"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}