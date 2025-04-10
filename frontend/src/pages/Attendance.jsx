import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Grid,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import {
  CloudDownload as CloudDownloadIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const colors = {
  darkBlue: "#0F172A",
  lightGray: "#CED1D5",
  paleBlue: "#F1F5F9",
};

const initialMembers = [
  {
    id: 1,
    name: "Abhishek Kumar",
    avatar: "A",
    attendance: {
      "2023-11-01": "present",
      "2023-11-02": "absent",
      "2023-11-03": "present",
      "2023-11-04": "present",
      "2023-11-05": "absent",
      "2023-11-06": "present",
      "2023-11-07": "present",
    },
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "S",
    attendance: {
      "2023-11-01": "present",
      "2023-11-02": "present",
      "2023-11-03": "absent",
      "2023-11-04": "present",
      "2023-11-05": "present",
      "2023-11-06": "absent",
      "2023-11-07": "absent",
    },
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "M",
    attendance: {
      "2023-11-01": "absent",
      "2023-11-02": "present",
      "2023-11-03": "present",
      "2023-11-04": "present",
      "2023-11-05": "absent",
      "2023-11-06": "present",
      "2023-11-07": "absent",
    },
  },
];

const Attendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [startDate, setStartDate] = useState(dayjs("2023-11-01"));
  const [endDate, setEndDate] = useState(dayjs("2023-11-07"));
  const [members] = useState(initialMembers);
  const [filter, setFilter] = useState("All");

  const generateDateArray = () => {
    if (!startDate || !endDate || endDate.isBefore(startDate)) return [];
    const daysDiff = endDate.diff(startDate, "day") + 1;
    return Array.from({ length: daysDiff }, (_, i) =>
      startDate.add(i, "day")
    );
  };

  const dateArray = generateDateArray();

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return { color: "green", icon: "✓", text: "Present" };
      case "absent":
        return { color: "red", icon: "✗", text: "Absent" };
      default:
        return { color: "gray", icon: "-", text: "Not Recorded" };
    }
  };

  const filteredMembers = members.map((member) => {
    if (filter === "All") return member;

    const filteredAttendance = Object.fromEntries(
      Object.entries(member.attendance).filter(([_, status]) =>
        filter === "Present" ? status === "present" : status === "absent"
      )
    );

    return {
      ...member,
      attendance: filteredAttendance,
    };
  });

  return (
    <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
      {/* main bar text */}
      <Paper
        elevation={0}
        sx={{ p: 3, backgroundColor: colors.paleBlue, borderRadius: 0 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: colors.darkBlue, mb: 1 }}
        >
          Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track team productivity and monitor attendance efficiently
        </Typography>
      </Paper>

      <Box sx={{ p: 2, backgroundColor: "white" }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter"
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={7}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarTodayIcon sx={{ color: colors.darkBlue }} />
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  disableFuture
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate}
                  disableFuture
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          <Grid
            item
            xs={12}
            md={1}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              sx={{ bgcolor: "#4ade80", color: "white", width: 40, height: 40 }}
              aria-label="download report"
            >
              <CloudDownloadIcon />
            </IconButton>
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="attendance table">
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.paleBlue }}>
                <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                  Members
                </TableCell>
                {dateArray.map((date) => (
                  <TableCell
                    key={date.toString()}
                    align="center"
                    sx={{ fontWeight: "bold", minWidth: "120px" }}
                  >
                    {date.format("MMM DD")}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#0F172A", color: "white" }}>
                      {member.avatar}
                    </Avatar>
                    {member.name}
                  </TableCell>
                  {dateArray.map((date) => {
                    const dateKey = date.format("YYYY-MM-DD");
                    const status = member.attendance[dateKey];
                    const { color, icon, text } = getStatusDisplay(status);
                    return (
                      <TableCell key={dateKey} align="center" sx={{ color }}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {icon} {!isMobile && text}
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Attendance;