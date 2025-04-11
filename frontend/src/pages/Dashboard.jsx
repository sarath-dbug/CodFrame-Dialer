import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  InputBase,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  Tooltip
} from "@mui/material";
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { 
  styled,
  ThemeProvider,
  createTheme 
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "../components/CircularProgress";
import { useNavigate } from 'react-router-dom';

// Create a custom theme with your color palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#0F172A",
    },
    secondary: {
      main: "#4CAF50",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#CED1D5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0F172A",
          fontSize: "0.875rem",
          padding: "8px 12px",
        },
        arrow: {
          color: "#0F172A",
        },
      },
    },
  },
});

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const StyledSearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 25,
  padding: "2px 15px",
  marginBottom: theme.spacing(3),
  border: "1px solid #CED1D5",
}));

const Dashboard = () => {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [hasCalls, setHasCalls] = useState(true);
  const [callStats, setCallStats] = useState({
    totalCalls: 12,
    successRate: 75
  });

  const navigate = useNavigate();

  // Sample data for members
  const members = [
    {
      id: 1,
      name: "ABHISHEK KUMAR",
      role: "Manager",
      initials: "AB",
      callCount: 0,
      callDuration: "0 mins",
      lastCall: "Last Call: No Call History",
    },
    {
      id: 2,
      name: "SARAH JOHNSON",
      role: "Team Lead",
      initials: "SJ",
      callCount: 2,
      callDuration: "15 mins",
      lastCall: "Last Call: 30 mins ago",
    },
    {
      id: 3,
      name: "MICHAEL CHEN",
      role: "Developer",
      initials: "MC",
      callCount: 1,
      callDuration: "8 mins",
      lastCall: "Last Call: 1 hour ago",
    },
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDateTime = currentDateTime.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Format last updated time
  const lastUpdatedTime = currentDateTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Filter members based on search term
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigate to calls component
  const navigateToCalls = () => {
    navigate('/app/reports/reports');
  };

  // Navigate to agents component
  const navigateToAgents = () => {
    navigate('/app/members');
  };

  // Navigate to attendance component
  const navigateToAttendance = () => {
    navigate('/app/reports/attendance');
  };

  // Navigate to user details component
  const navigateToUserDetails = (userId) => {
    navigate('/app/reports/performance');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: 3,
          backgroundColor: "#F1F5F9",
          minHeight: "100vh",
          color: "#0F172A",
        }}
      >
        {/* Header with Date and Time */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ color: "#0F172A", display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            {formattedDateTime}
          </Typography>
        </Box>

        {/* Dashboard Cards Layout */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left Side - 60% width */}
          <Grid item xs={12} md={7}>
            {/* Top Row - Calls and Agents */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Calls Card */}
              <Grid item xs={12} sm={6}>
                <StyledPaper onClick={navigateToCalls}>
                  <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                    Calls
                  </Typography>
                  <Typography variant="h3" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                    {hasCalls ? callStats.totalCalls : "0"}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="body2" sx={{ color: "#0F172A", opacity: 0.7 }}>
                      Today
                    </Typography>
                  </Box>
                </StyledPaper>
              </Grid>

              {/* Agents Card */}
              <Grid item xs={12} sm={6}>
                <StyledPaper onClick={navigateToAgents}>
                  <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                    Agents
                  </Typography>
                  <Typography variant="h3" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                    0/1
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="body2" sx={{ color: "#0F172A", opacity: 0.7 }}>
                      Active
                    </Typography>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>

            {/* Bottom Row - Attendance (Full Width) */}
            <Grid item xs={12}>
              <StyledPaper onClick={navigateToAttendance}>
                <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                  Attendance
                </Typography>
                <Typography variant="h3" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                  0/1
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="body2" sx={{ color: "#0F172A", opacity: 0.7 }}>
                    Present
                  </Typography>
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>

          {/* Right Side - Call Overview */}
          <Grid item xs={12} md={5}>
            <StyledPaper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                {hasCalls ? "Call Success Rate" : "Calls Overview"}
              </Typography>

              <Box
                sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                {hasCalls ? (
                  <>
                    <CircularProgress 
                      successRate={callStats.successRate} 
                      totalCalls={callStats.totalCalls} 
                    />

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 3 }}>
                      <Tooltip title={`${Math.round((callStats.totalCalls * callStats.successRate) / 100)} successful calls`} arrow>
                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: "#10B981",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: "#10B981" }}>
                            Successful
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Tooltip title={`${callStats.totalCalls - Math.round((callStats.totalCalls * callStats.successRate) / 100)} unsuccessful calls`} arrow>
                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: "#EF4444",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: "#EF4444" }}>
                            Unsuccessful
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <PhoneIcon sx={{ color: "#0F172A", fontSize: 60 }} />
                        <CancelIcon
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: -10,
                            color: "#0F172A",
                            fontSize: 24,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ color: "#0F172A" }}>
                      No Call Today
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#0F172A", opacity: 0.7 }}>
                  Last updated: {lastUpdatedTime}
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <StyledSearchBox>
          <InputBase
            placeholder="Search Member Activity"
            sx={{ ml: 1, flex: 1, color: "#0F172A" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton
            type="button"
            sx={{
              p: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              borderRadius: 25,
              "&:hover": {
                backgroundColor: "#3d8b40",
              },
            }}
          >
            <SearchIcon />
            <Typography sx={{ ml: 0.5, display: { xs: "none", sm: "block" } }}>SEARCH</Typography>
          </IconButton>
        </StyledSearchBox>

        {/* Members Table */}
        <TableContainer component={Paper} sx={{ backgroundColor: "#FFFFFF", boxShadow: "none" }}>
          <Table>
            <TableBody>
              {filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
                <TableRow 
                  key={member.id} 
                  sx={{ 
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "#F1F5F9",
                      cursor: "pointer"
                    }
                  }}
                  onClick={() => navigateToUserDetails(member.id)}
                >
                  <TableCell sx={{ borderBottom: "1px solid #CED1D5" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "#0F172A", mr: 2 }}>{member.initials}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#0F172A" }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#0F172A", opacity: 0.7 }}>
                          ({member.role})
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: "1px solid #CED1D5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PhoneIcon sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#0F172A" }}>
                        {member.callCount}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: "1px solid #CED1D5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <AccessTimeIcon sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#0F172A" }}>
                        {member.callDuration}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: "1px solid #CED1D5" }}>
                    <Typography variant="body2" sx={{ color: "#0F172A", opacity: 0.7 }}>
                      {member.lastCall}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2, color: "#0F172A" }}>
              Rows per page:
            </Typography>
            <FormControl size="small">
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  height: 30,
                  minWidth: 60,
                  backgroundColor: "#FFFFFF",
                  color: "#0F172A",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#CED1D5",
                  },
                }}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#0F172A", mr: 2 }}>
              {page + 1} of {Math.ceil(filteredMembers.length / rowsPerPage)}
            </Typography>
            <IconButton
              disabled={page === 0}
              onClick={(e) => handleChangePage(e, page - 1)}
              sx={{ color: page === 0 ? "#CED1D5" : "#0F172A" }}
            >
              &lt;
            </IconButton>
            <IconButton
              disabled={page >= Math.ceil(filteredMembers.length / rowsPerPage) - 1}
              onClick={(e) => handleChangePage(e, page + 1)}
              sx={{ color: page >= Math.ceil(filteredMembers.length / rowsPerPage) - 1 ? "#CED1D5" : "#0F172A" }}
            >
              &gt;
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;