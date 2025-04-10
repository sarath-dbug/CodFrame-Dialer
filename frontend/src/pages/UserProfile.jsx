import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    Divider,
    InputAdornment,
    ThemeProvider,
    createTheme,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import {
    Person,
    Email,
    Phone,
    Business,
    Edit,
    Save,
    Cancel,
} from "@mui/icons-material";
import { selectCurrentUser, setCredentials, clearCredentials, selectCurrentToken } from "../features/authSlice";

// Theme configuration
const theme = createTheme({
    palette: {
        primary: {
            main: "#0F172A",
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
            default: "#F1F5F9",
            paper: "#ffffff",
        },
        text: {
            primary: "#0F172A",
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
                    maxWidth: "100%",
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
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserProfile() {
    const currentUser = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        contactNumber: "",
    });

    // Update profileData when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setProfileData({
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                email: currentUser.email || "",
                companyName: currentUser.companyName || "",
                contactNumber: currentUser.contactNumber || "",
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/auth/profile`,
                {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    companyName: profileData.companyName,
                    contactNumber: profileData.contactNumber,
                    userId: currentUser.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch(setCredentials({
                user: response.data,
                token: token
            }));

            setProfileData(response.data);

            setSuccess(response.data.message || "Profile updated successfully!");
            setEditMode(false);
        } catch (err) {
            let errorMessage = "Failed to update profile";

            if (err.response) {
                // Server responded with error status
                if (err.response.status === 401) {
                    errorMessage = "Session expired. Please login again.";
                    dispatch(clearCredentials());
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                // Request was made but no response
                errorMessage = "Network error. Please check your connection.";
            } else {
                // Other errors
                errorMessage = err.message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setError(null);
        setSuccess(null);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        // Reset to original user data
        setProfileData({
            firstName: currentUser?.firstName || "",
            lastName: currentUser?.lastName || "",
            email: currentUser?.email || "",
            companyName: currentUser?.companyName || "",
            contactNumber: currentUser?.contactNumber || "",
        });
    };

    if (!currentUser) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

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
                    {/* Error/Success Alerts */}
                    <Snackbar
                        open={!!error}
                        autoHideDuration={6000}
                        onClose={handleCloseAlert}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: "100%" }}>
                            {error}
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={!!success}
                        autoHideDuration={6000}
                        onClose={handleCloseAlert}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
                            {success}
                        </Alert>
                    </Snackbar>

                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 2,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            color="primary"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                                fontWeight: "bold",
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            User Profile
                        </Typography>

                        <Grid container spacing={4} sx={{ px: { xs: 2, md: 3 } }}>
                            <Grid item xs={12}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h5" gutterBottom color="primary">
                                        Personal Information
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
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
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
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
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                value={profileData.email}
                                                disabled={true}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Email color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Company Name"
                                                name="companyName"
                                                value={profileData.companyName}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
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
                                                fullWidth
                                                label="Contact Number"
                                                name="contactNumber"
                                                value={profileData.contactNumber}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
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
                                </Box>
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                mt: 4,
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                px: { xs: 2, md: 3 }
                            }}
                        >
                            {!editMode ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Edit />}
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Save />}
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                                Saving...
                                            </>
                                        ) : "Save Changes"}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Cancel />}
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}