import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  CardActions,
  CardHeader,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material"
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  FileDownload as ExportIcon,
  Edit as EditIcon,
  VpnKey as PasswordIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as RoleIcon,
  Close
} from "@mui/icons-material";
import ListIcon from '@mui/icons-material/List';
import { useSelector } from "react-redux"
import { selectCurrentToken, selectCurrentUser } from '../features/authSlice';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    success: { main: "#4caf50" },
    background: { default: "#f5f7fa" },
  },
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_MEMBERS = 5; // Maximum allowed members

const MembersManagement = () => {
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [teams, setTeams] = useState([])
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    teams: [],
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    phone: false,
    role: false,
    teams: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    new: false,
    confirm: false,
  });

  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{3,30}$/;
    return re.test(username);
  };

  // Fetch all members
  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/member/fetchAllMembers`)
      console.log(response.data);
      setMembers(response.data)
    } catch (error) {
      console.error("Error fetching members:", error)
      showSnackbar("Failed to fetch members", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/team/fetchTeamsByUser`, {
        params: {
          userId: user.id
        },
      })
      setTeams(response.data.data.map(team => ({
        id: team._id,
        name: team.name
      })));
    } catch (error) {
      console.error("Error fetching teams:", error)
      showSnackbar("Failed to fetch teams", "error")
    }
  }

  useEffect(() => {
    fetchMembers();
    fetchTeams();
  }, [])

  // Helper function to show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Handle opening the add dialog
  const handleOpenAddDialog = () => {
    if (members.length >= MAX_MEMBERS) {
      showSnackbar(`Maximum of ${MAX_MEMBERS} members reached`, "error");
      return;
    }

    setNewMember({
      name: "",
      role: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      teams: [],
    })
    setValidationErrors({
      name: false,
      email: false,
      username: false,
      password: false,
      phone: false,
      role: false,
      teams: false,
    });
    setSelectedMember(null)
    setOpenAddDialog(true)
  }

  // Handle closing the add dialog
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
  }

  // Handle opening the password change dialog
  const handleOpenPasswordDialog = (member) => {
    setSelectedMember(member)
    setPasswords({
      current: "",
      new: "",
      confirm: "",
    })
    setPasswordErrors({
      new: false,
      confirm: false,
    })
    setOpenPasswordDialog(true)
  }

  // Handle closing the password change dialog
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false)
  }

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (member) => {
    setSelectedMember(member)
    setOpenDeleteDialog(true)
  }

  // Handle closing the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  // Handle input change for new member form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate based on field
    let isValid = true;
    switch (name) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'password':
        isValid = validatePassword(value);
        break;
      case 'phone':
        isValid = validatePhone(value);
        break;
      case 'username':
        isValid = validateUsername(value);
        break;
      case 'name':
      case 'role':
        isValid = value.trim() !== '';
        break;
      default:
        break;
    }

    setValidationErrors({
      ...validationErrors,
      [name]: !isValid,
    });

    setNewMember(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input change for password change form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    // Validate password
    const isValid = name === 'new' ? validatePassword(value) : true;
    
    setPasswordErrors({
      ...passwordErrors,
      [name]: !isValid,
    });

    setPasswords({
      ...passwords,
      [name]: value,
    });
  }

  // Handle multi-select change for teams and lists
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    
    setValidationErrors({
      ...validationErrors,
      [name]: value.length === 0,
    });

    setNewMember({
      ...newMember,
      [name]: value,
    });
  }

  // Handle adding or editing a member
  const handleAddOrEditMember = async () => {
    // If this is a new member (not editing), check the limit
    if (!selectedMember && members.length >= MAX_MEMBERS) {
      showSnackbar(`Maximum of ${MAX_MEMBERS} members reached`, "error");
      return;
    }

    // Validate all fields
    const errors = {
      name: !newMember.name.trim(),
      email: !validateEmail(newMember.email),
      username: !validateUsername(newMember.username),
      password: !selectedMember && !validatePassword(newMember.password),
      phone: !validatePhone(newMember.phone),
      role: !newMember.role,
      teams: newMember.teams.length === 0,
    };

    setValidationErrors(errors);

    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      showSnackbar("Please correct the highlighted fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (selectedMember) {
        // Update existing member
        const updateData = {
          name: newMember.name,
          phone: newMember.phone,
        };
        const response = await axios.put(
          `${API_BASE_URL}/api/member/updateMember/${selectedMember._id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchMembers();
        showSnackbar("Member updated successfully");
      } else {
        // Create new member
        const memberData = {
          name: newMember.name,
          email: newMember.email,
          userId: newMember.username,
          role: newMember.role,
          team: newMember.teams,
          phone: newMember.phone,
          password: newMember.password
        };
        const response = await axios.post(
          `${API_BASE_URL}/api/member/addMember`,
          memberData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchMembers();
        showSnackbar("Member added successfully");
      }
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error saving member:", error);
      showSnackbar(error.response?.data?.msg || "Failed to save member", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a member
  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/member/deleteMember/${selectedMember.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(members.filter(member => member.id !== selectedMember.id));
      showSnackbar("Member deleted successfully");
      handleCloseDeleteDialog();
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      showSnackbar(error.response?.data?.msg || "Failed to delete member", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle changing a member's password
  const handleChangePassword = async () => {
    if (!selectedMember) return;

    if (passwords.new !== passwords.confirm) {
      showSnackbar("New passwords don't match", "error");
      setPasswordErrors({
        new: true,
        confirm: true,
      });
      return;
    }

    if (!validatePassword(passwords.new)) {
      showSnackbar("Password must be at least 8 characters", "error");
      setPasswordErrors({
        new: true,
        confirm: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/member/changePassword`,
        {
          newPassword: passwords.new,
          userId: selectedMember.userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSnackbar("Password changed successfully");
      handleClosePasswordDialog();
    } catch (error) {
      console.error("Error changing password:", error);
      showSnackbar(error.response?.data?.msg || "Failed to change password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a member
  const handleEditMember = (member) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      role: member.role,
      username: member.userId || "",
      email: member.email,
      password: "",
      phone: member.phone || "",
      teams: member.team || [],
    });
    setValidationErrors({
      name: false,
      email: false,
      username: false,
      password: false,
      phone: false,
      role: false,
      teams: false,
    });
    setOpenAddDialog(true);
  };

  // Handle exporting a member's data
  const handleExportMembers = () => {
    if (members.length === 0) {
      showSnackbar('No members to export', 'warning');
      return;
    }

    try {
      // Transform data for CSV
      const fields = ['Name', 'Email', 'User ID', 'Role', 'Teams', 'Phone'];
      const data = members.map(member => ({
        Name: member.name,
        Email: member.email,
        'User ID': member.userId,
        Role: member.role,
        Teams: member.team?.join(', ') || '',
        Phone: member.phone || ''
      }));

      // Convert to CSV
      let csv = fields.join(',') + '\n';
      data.forEach(row => {
        csv += Object.values(row).map(value =>
          `"${value?.toString().replace(/"/g, '""')}"`
        ).join(',') + '\n';
      });

      // Create download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'members_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      showSnackbar('Failed to export members', 'error');
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Static Roles data for dropdowns
  const roles = ['Team Manager', 'Sub Manager', 'Agent'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Box sx={{ p: 3 }}>

            {/* main bar text */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Team Members
                <Typography 
                  component="span" 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ ml: 2 }}
                >
                  ({members.length}/{MAX_MEMBERS})
                </Typography>
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your team members and their permissions
              </Typography>
            </Box>

            {/* Search and Actions Bar */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 3,
              alignItems: { xs: 'stretch', md: 'center' }
            }}>
              <TextField
                placeholder="Search members..."
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  maxWidth: { md: 400 },
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: { xs: 'flex-end', md: 'flex-start' },
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                  sx={{ borderRadius: 2 }}
                  disabled={members.length >= MAX_MEMBERS}
                >
                  Add Member
                  {members.length >= MAX_MEMBERS && (
                    <Tooltip title={`Maximum of ${MAX_MEMBERS} members reached`}>
                      <span style={{ marginLeft: '8px' }}>
                        ({MAX_MEMBERS}/{MAX_MEMBERS})
                      </span>
                    </Tooltip>
                  )}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={handleExportMembers}
                  disabled={isLoading || members.length === 0}
                  sx={{ borderRadius: 2 }}
                >
                  Export
                </Button>
              </Box>
            </Box>

            {/* Members Grid */}
            {isLoading && members.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                <CircularProgress size={60} />
              </Box>
            ) : filteredMembers.length === 0 ? (
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                borderRadius: 2
              }}>
                <GroupIcon color="disabled" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {searchQuery ? 'No matching members found' : 'No members available'}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  {searchQuery ? 'Try a different search term' : `Add your first team member (max ${MAX_MEMBERS})`}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                  size="large"
                  sx={{ borderRadius: 2 }}
                  disabled={members.length >= MAX_MEMBERS}
                >
                  Add Member
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredMembers.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member._id}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                            {getInitials(member.name)}
                          </Avatar>
                        }
                        title={
                          <Typography variant="h6" fontWeight="bold" noWrap>
                            {member.name}
                          </Typography>
                        }
                        subheader={
                          <Chip
                            label={member.role}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        }
                        sx={{ pb: 1 }}
                      />

                      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon color="disabled" sx={{ mr: 1.5, fontSize: 20 }} />
                            <Typography variant="body2" noWrap>
                              {member.email}
                            </Typography>
                          </Box>

                          {member.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon color="disabled" sx={{ mr: 1.5, fontSize: 20 }} />
                              <Typography variant="body2">
                                {member.phone}
                              </Typography>
                            </Box>
                          )}

                          {member.team?.length > 0 && (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <GroupIcon color="disabled" sx={{ mr: 1.5, fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Teams
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 3.5 }}>
                                {member.team.map((team, index) => (
                                  <Chip
                                    key={index}
                                    label={team}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {member.lists?.length > 0 && (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <ListIcon color="disabled" sx={{ mr: 1.5, fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Lists
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 3.5 }}>
                                {member.lists.map((list, index) => (
                                  <Chip
                                    key={index}
                                    label={list}
                                    size="small"
                                    variant="outlined"
                                    onDelete={() => { }}
                                    deleteIcon={<Close fontSize="small" />}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>

                      <Divider />

                      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                        <Tooltip title="Change Password">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenPasswordDialog(member)}
                          >
                            <PasswordIcon />
                          </IconButton>
                        </Tooltip>

                        <Box>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteDialog(member)}
                              sx={{ mr: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditMember(member)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Add/Edit Member Dialog */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="md">
              <DialogTitle>
                {selectedMember ? "Edit Member" : "Add New Member"}
                <IconButton
                  aria-label="close"
                  onClick={handleCloseAddDialog}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name"
                      label="Name"
                      fullWidth
                      value={newMember.name}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                      disabled={isLoading}
                      error={validationErrors.name}
                      helperText={validationErrors.name ? "Name is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      fullWidth
                      value={newMember.email}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                      disabled={!!selectedMember || isLoading}
                      error={validationErrors.email}
                      helperText={validationErrors.email ? "Please enter a valid email" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="username"
                      label="User ID"
                      fullWidth
                      value={newMember.username}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                      disabled={!!selectedMember || isLoading}
                      error={validationErrors.username}
                      helperText={validationErrors.username ? "3-30 characters, letters, numbers and underscores only" : ""}
                    />
                  </Grid>
                  {!selectedMember && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={newMember.password}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        disabled={isLoading}
                        error={validationErrors.password}
                        helperText={validationErrors.password ? "Password must be at least 8 characters" : ""}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" required error={validationErrors.role}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={newMember.role}
                        onChange={handleInputChange}
                        label="Role"
                        disabled={!!selectedMember || isLoading}
                        inputProps={{
                          readOnly: !!selectedMember,
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.role && (
                        <Typography variant="caption" color="error">
                          Role is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phone"
                      label="Phone"
                      fullWidth
                      value={newMember.phone}
                      onChange={handleInputChange}
                      margin="normal"
                      disabled={isLoading}
                      error={validationErrors.phone}
                      helperText={validationErrors.phone ? "Please enter a valid phone number (10-15 digits)" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" required error={validationErrors.teams}>
                      <InputLabel>Teams</InputLabel>
                      <Select
                        name="teams"
                        multiple
                        value={newMember.teams}
                        onChange={handleMultiSelectChange}
                        label="Teams"
                        disabled={!!selectedMember || isLoading}
                        inputProps={{
                          readOnly: !!selectedMember,
                        }}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((teamId) => {
                              const team = teams.find(t => t.id === teamId);
                              return <Chip key={teamId} label={team?.name || teamId} />;
                            })}
                          </Box>
                        )}
                      >
                        {teams.map((team) => (
                          <MenuItem key={team.id} value={team.id}>
                            {team.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.teams && (
                        <Typography variant="caption" color="error">
                          At least one team is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddDialog}>Cancel</Button>
                <Button
                  onClick={handleAddOrEditMember}
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : selectedMember ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} fullWidth maxWidth="sm">
              <DialogTitle>
                Change Password
                <IconButton
                  aria-label="close"
                  onClick={handleClosePasswordDialog}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <TextField
                  name="new"
                  label="New Password"
                  type="password"
                  fullWidth
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  error={passwordErrors.new}
                  helperText={passwordErrors.new ? "Password must be at least 8 characters" : ""}
                />
                <TextField
                  name="confirm"
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  margin="normal"
                  required
                  error={passwordErrors.confirm}
                  helperText={passwordErrors.confirm ? "Passwords must match" : ""}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                <Button
                  onClick={handleChangePassword}
                  variant="contained"
                  color="primary"
                  disabled={isLoading || !passwords.new || passwords.new !== passwords.confirm || passwordErrors.new}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Change Password"}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete {selectedMember?.name}?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button
                  onClick={handleDeleteMember}
                  color="error"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Delete"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}

export default MembersManagement