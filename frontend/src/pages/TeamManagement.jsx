import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../features/authSlice';
import { triggerRefetch } from '../features/teamSlice';
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Avatar,
  Chip,
  Divider,
  Stack
} from "@mui/material";
import {
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  CalendarToday as DateIcon
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: "" });
  const [editTeam, setEditTeam] = useState({ id: null, name: "" });
  const isMobile = useMediaQuery('(max-width:600px)');

  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch()

  const fetchTeams = async () => {
    try {
      const userId = user.id;
      const response = await axios.get(
        `${API_BASE_URL}/api/team/fetchTeamsByUser`,
        {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeams(response.data.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTeams();
    }
  }, [user, token]);

  // Add Team Handlers
  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewTeam({ name: "" });
  };

  const handleAddInputChange = (e) => {
    setNewTeam({ name: e.target.value });
  };

  const handleAddTeam = async () => {
    if (newTeam.name) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/team/addTeam`,
          {
            name: newTeam.name,
            userId: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          handleCloseAddDialog();
          fetchTeams();
        }
        dispatch(triggerRefetch());
      } catch (error) {
        console.error("Error creating team:", error.response?.data?.msg || error.message);
      }
    }
  };

  // Edit Team Handlers
  const handleOpenEditDialog = (team) => {
    setEditTeam({ id: team._id, name: team.name });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditTeam({ id: null, name: "" });
  };

  const handleEditInputChange = (e) => {
    setEditTeam((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleUpdateTeam = async () => {
    if (editTeam.name) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/team/editTeam`,
          {
            name: editTeam.name,
            teamId: editTeam.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          handleCloseEditDialog();
          fetchTeams();
        }
        dispatch(triggerRefetch());
      } catch (error) {
        console.error("Error updating team:", error.response?.data?.msg || error.message);
      }
    }
  };

  // Delete Team Handlers
  const handleOpenDeleteDialog = (id) => {
    setTeamToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTeamToDelete(null);
  };

  const handleDeleteTeam = async () => {
    if (teamToDelete) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/team/deleteTeam/${teamToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          fetchTeams();
        }
        dispatch(triggerRefetch());
      } catch (error) {
        console.error("Error deleting team:", error.response?.data?.msg || error.message);
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>

        {/* main bar text */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Team Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your team and manage roles and responsibilities effectively
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          size={isMobile ? "medium" : "large"}
          sx={{ ml: 'auto' }}
        >
          {isMobile ? "Add" : "Add New Team"}
        </Button>
      </Box>

      {/* Teams Grid */}
      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team._id}>
            <Card elevation={3} sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <GroupIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {team.name}
                  </Typography>
                }
                subheader={`Created: ${new Date(team.createdAt).toLocaleDateString()}`}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={<PersonIcon fontSize="small" />}
                    label={`${team.assignedTo.length} ${team.assignedTo.length === 1 ? 'Agent' : 'Agents'}`}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    icon={<DateIcon fontSize="small" />}
                    label={new Date(team.createdAt).toLocaleDateString()}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>

              <Divider />

              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenEditDialog(team)}
                  color="primary"
                  size="small"
                >
                  {!isMobile && "Edit"}
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleOpenDeleteDialog(team._id)}
                  color="error"
                  size="small"
                >
                  {!isMobile && "Delete"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {teams.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200
          }}
        >
          <GroupIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Teams Found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Get started by creating your first team
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            size="large"
          >
            Create Team
          </Button>
        </Paper>
      )}

      {/* Add Team Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Add New Team</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseAddDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="Team Name"
            variant="outlined"
            value={newTeam.name}
            onChange={handleAddInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddTeam}
            variant="contained"
            disabled={!newTeam.name}
            sx={{ ml: 2 }}
          >
            Create Team
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <EditIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Edit Team</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="Team Name"
            variant="outlined"
            value={editTeam.name}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEditDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTeam}
            variant="contained"
            disabled={!editTeam.name}
            sx={{ ml: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <DeleteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Delete Team</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDeleteDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete this team?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone and will permanently remove the team and its data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTeam}
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;