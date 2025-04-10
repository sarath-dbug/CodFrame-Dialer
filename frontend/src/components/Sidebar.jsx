import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
  styled
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  GroupWork as TeamIcon,
  Person as MemberIcon,
  Contacts as ContactIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Business as OrganizationIcon,
  TableChart as MasterIcon,
  EventNote as AttendanceIcon,
  TrendingUp as PerformanceIcon
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { selectCurrentToken, selectCurrentUser, clearCredentials } from '../features/authSlice';
import { setCurrentTeam, clearCurrentTeam } from '../features/teamSlice';

import logoFull from '../assets/DL-logo.png';
import logoIcon from '../assets/DL-Icon.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Styled components with enhanced color theme
const SidebarContainer = styled(Box)({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: '#0F172A',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.3s ease',
});

const StyledNavLink = styled(NavLink)({
  width: '100%',
  textDecoration: 'none',
  color: '#CED1D5',
  '&.active': {
    backgroundColor: 'rgba(241, 245, 249, 0.9)',
    color: '#0F172A',
    borderLeft: '4px solid #EF4444',
    borderRadius: '4px',
    '& .MuiListItemIcon-root': {
      color: '#0F172A',
    },
    '&:hover': {
      backgroundColor: 'rgba(241, 245, 249, 0.92)',
      color: '#0F172A',
      '& .MuiListItemIcon-root': {
        color: '#0F172A',
      }
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(206, 209, 213, 0.1)',
    color: '#FFFFFF',
    '& .MuiListItemIcon-root': {
      color: '#FFFFFF',
    }
  }
});

function Sidebar({ isSidebarOpen }) {
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const currentTeam = useSelector(state => state.team.currentTeam);
  const refetchFlag = useSelector(state => state.team.refetchFlag);
  const [selectedTeam, setSelectedTeam] = useState(currentTeam);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const userId = user?.id;
      if (!userId) return;

      const response = await axios.get(`${API_BASE_URL}/api/team/fetchTeamsByUser`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeams(response.data.data);

      if (response.data.data?.length > 0) {
        let teamToSelect = currentTeam;

        if (currentTeam && !response.data.data.some(t => t._id === currentTeam._id)) {
          teamToSelect = null;
        }

        if (!teamToSelect) {
          teamToSelect = response.data.data[0];
          dispatch(setCurrentTeam(teamToSelect));
        }

        setSelectedTeam(teamToSelect);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user, token, currentTeam, refetchFlag]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(clearCurrentTeam());
    sessionStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <SidebarContainer sx={{ width: isSidebarOpen ? 260 : 80 }}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Sidebar Header with Logo */}
        <Box sx={{
          p: 2,
          display: 'flex',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(206, 209, 213, 0.1)',
          height: 80,
          pl: isSidebarOpen ? 3 : 0, 
        }}>
          {isSidebarOpen ? (
            <Box
              component="img"
              src={logoFull}
              alt="Admin Portal Logo"
              sx={{
                height: 30,
                width: 'auto',
                objectFit: 'contain',
                ml: 1 
              }}
            />
          ) : (
            <Box
              component="img"
              src={logoIcon}
              alt="AP"
              sx={{
                height: 30,
                width: 30, 
                objectFit: 'contain'
              }}
            />
          )}
        </Box>

        {/* Rest of your sidebar content remains the same */}
        <List sx={{ px: 1.5, mt: 1.5 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={(e) => {
                e.preventDefault();
                setTeamDropdownOpen(!teamDropdownOpen);
              }}
              sx={{
                mb: 1.5,
                py: 2,
                px: 2.5,
                color: '#CED1D5',
                backgroundColor: 'rgba(206, 209, 213, 0.1)',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(206, 209, 213, 0.2)',
                  color: '#FFFFFF'
                },
                ...(selectedTeam && {
                  borderLeft: '4px solid #EF4444'
                })
              }}
            >
              {isSidebarOpen && (
                <>
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    <OrganizationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedTeam?.name || "Select Team"}
                      </Typography>
                    }
                    sx={{ flexGrow: 1 }}
                  />
                  {teams.length > 0 && (
                    teamDropdownOpen ?
                      <ArrowUpIcon sx={{ fontSize: 16 }} /> :
                      <ArrowDownIcon sx={{ fontSize: 16 }} />
                  )}
                </>
              )}
              {!isSidebarOpen && <OrganizationIcon sx={{ mx: 'auto' }} />}
            </ListItemButton>
          </ListItem>

          {/* Team Dropdown */}
          <Collapse in={isSidebarOpen && teamDropdownOpen && teams.length > 0}>
            <Paper sx={{
              ml: 2.5,
              mt: 1,
              backgroundColor: 'rgba(206, 209, 213, 0.1)',
              color: '#CED1D5',
              backdropFilter: 'blur(10px)'
            }}>
              {teams.map(team => (
                <MenuItem
                  key={team._id}
                  onClick={() => {
                    setSelectedTeam(team);
                    dispatch(setCurrentTeam(team));
                    setTeamDropdownOpen(false);
                  }}
                  sx={{
                    py: 1,
                    px: 2,
                    fontSize: '0.8rem',
                    '&:hover': {
                      backgroundColor: 'rgba(206, 209, 213, 0.2)',
                      color: '#FFFFFF'
                    },
                    ...(selectedTeam?._id === team._id && {
                      backgroundColor: 'rgba(206, 209, 213, 0.15)',
                      fontWeight: 600
                    })
                  }}
                >
                  {team.name}
                </MenuItem>
              ))}
            </Paper>
          </Collapse>

          {/* Menu Items */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <StyledNavLink to="/app/dashboard">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: 'inherit',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                }}>
                  <DashboardIcon />
                </ListItemIcon>
                {isSidebarOpen && <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                />}
              </ListItemButton>
            </StyledNavLink>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <StyledNavLink to="/app/contacts">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: 'inherit',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                }}>
                  <ContactIcon />
                </ListItemIcon>
                {isSidebarOpen && <ListItemText
                  primary="CRM"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                />}
              </ListItemButton>
            </StyledNavLink>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <StyledNavLink to="/app/members">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: 'inherit',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                }}>
                  <MemberIcon />
                </ListItemIcon>
                {isSidebarOpen && <ListItemText
                  primary="Members"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                />}
              </ListItemButton>
            </StyledNavLink>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <StyledNavLink to="/app/teams">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: 'inherit',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                }}>
                  <TeamIcon />
                </ListItemIcon>
                {isSidebarOpen && <ListItemText
                  primary="Teams"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                />}
              </ListItemButton>
            </StyledNavLink>
          </ListItem>

          {/* Reports and Analytics Dropdown */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <Box sx={{ width: '100%' }}>
              <ListItemButton
                onClick={() => setReportsDropdownOpen(!reportsDropdownOpen)}
                sx={{
                  py: 1.5,
                  color: '#CED1D5',
                  '&:hover': {
                    backgroundColor: 'rgba(206, 209, 213, 0.1)',
                    color: '#FFFFFF',
                    '& .MuiListItemIcon-root': {
                      color: '#FFFFFF',
                    }
                  }
                }}
              >
                {isSidebarOpen ? (
                  <>
                    <ListItemIcon sx={{
                      minWidth: 40,
                      color: 'inherit',
                      justifyContent: 'flex-start'
                    }}>
                      <ReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Reports and Analytics"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                    {reportsDropdownOpen ?
                      <ArrowUpIcon sx={{ fontSize: 16 }} /> :
                      <ArrowDownIcon sx={{ fontSize: 16 }} />
                    }
                  </>
                ) : (
                  <ReportIcon sx={{ mx: 'auto' }} />
                )}
              </ListItemButton>

              <Collapse in={isSidebarOpen && reportsDropdownOpen}>
                <List sx={{ pl: 4 }}>
                  <ListItem disablePadding>
                    <StyledNavLink to="/app/reports/reports">
                      <ListItemButton sx={{ py: 1 }}>
                        <ListItemIcon sx={{
                          minWidth: 40,
                          color: 'inherit',
                          justifyContent: 'flex-start'
                        }}>
                          <MasterIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Master"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItemButton>
                    </StyledNavLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <StyledNavLink to="/app/reports/attendance">
                      <ListItemButton sx={{ py: 1 }}>
                        <ListItemIcon sx={{
                          minWidth: 40,
                          color: 'inherit',
                          justifyContent: 'flex-start'
                        }}>
                          <AttendanceIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Attendance"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItemButton>
                    </StyledNavLink>
                  </ListItem>
                  <ListItem disablePadding>
                    <StyledNavLink to="/app/reports/performance">
                      <ListItemButton sx={{ py: 1 }}>
                        <ListItemIcon sx={{
                          minWidth: 40,
                          color: 'inherit',
                          justifyContent: 'flex-start'
                        }}>
                          <PerformanceIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Performance"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItemButton>
                    </StyledNavLink>
                  </ListItem>
                </List>
              </Collapse>
            </Box>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <StyledNavLink to="/app/settings">
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: 'inherit',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                }}>
                  <SettingsIcon />
                </ListItemIcon>
                {isSidebarOpen && <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                />}
              </ListItemButton>
            </StyledNavLink>
          </ListItem>
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{
        p: 2,
        borderTop: '1px solid rgba(206, 209, 213, 0.1)',
      }}>
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutIcon sx={{
            color: 'inherit',
            ml: isSidebarOpen ? 0 : '6px'
          }} />}
          sx={{
            py: 1.5,
            color: '#CED1D5',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            '&:hover': {
              backgroundColor: 'rgba(206, 209, 213, 0.2)',
              color: '#FFFFFF'
            }
          }}
        >
          {isSidebarOpen && (
            <Typography variant="body2" sx={{
              fontWeight: 500,
              ml: 1.5
            }}>
              Log Out
            </Typography>
          )}
        </Button>
      </Box>
    </SidebarContainer>
  );
}

export default Sidebar;