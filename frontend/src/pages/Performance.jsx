import { useState } from "react"
import { Box, Typography, Card, CardContent, Avatar, Grid, IconButton, useMediaQuery, useTheme } from "@mui/material"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
} from "recharts"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material"

// Create a custom theme with the specified colors
const theme = createTheme({
    palette: {
        primary: {
            main: "#0F172A",
        },
        secondary: {
            main: "#CED1D5",
        },
        background: {
            default: "#F1F5F9",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#0F172A",
            secondary: "#64748B",
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
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
})

// Custom theme colors
const colors = {
    darkBlue: "#0F172A",
    mediumGray: "#CED1D5",
    lightGray: "#F1F5F9",
    green: "#4CAF50",
    yellow: "#FFC107",
    brightYellow: "#FFEB3B",
    lightGray2: "#E0E0E0",
    darkGray: "#424242",
    darkRed: "#5D4037",
}

// Sample data for disposition summary
const dispositionData = [
    { name: "SKIP", value: 20, color: colors.yellow },
    { name: "INTERESTED", value: 15, color: colors.brightYellow },
    { name: "UNREACHABLE", value: 10, color: colors.lightGray2 },
    { name: "CALLBACK", value: 25, color: "#26A69A" },
    { name: "WRONG NUMBER", value: 18, color: colors.darkGray },
    { name: "BUSY", value: 12, color: colors.darkRed },
]

// Sample data for performance graph
const performanceData = [
    { date: "2025-03-30", calls: 1, activeTime: 0 },
    { date: "2025-03-19", calls: 7, activeTime: 2.5 },
    { date: "2025-03-11", calls: 3, activeTime: 3 },
    { date: "2025-03-06", calls: 4, activeTime: 0.5 },
    { date: "2025-03-04", calls: 2, activeTime: 2 },
    { date: "2025-03-03", calls: 1, activeTime: 2.5 },
]

// Sample user data
const users = [
    {
        id: 1,
        name: "Abhishek Kumar",
        title: "Manager",
        email: "packpin.in@gmail.com",
        phone: "+919549890530",
        initials: "AK",
    },
    {
        id: 2,
        name: "John Smith",
        title: "Agent",
        email: "john.smith@gmail.com",
        phone: "+919876543210",
        initials: "JS",
    },
    {
        id: 3,
        name: "Sarah Johnson",
        title: "Agent",
        email: "sarah.j@gmail.com",
        phone: "+917654321098",
        initials: "SJ",
    },
    {
        id: 4,
        name: "Michael Brown",
        title: "Agent",
        email: "michael.b@gmail.com",
        phone: "+918765432109",
        initials: "MB",
    },
]

// Custom tooltip for the performance graph
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    backgroundColor: colors.darkBlue,
                    color: "white",
                    p: 1.5,
                    borderRadius: 1,
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
                }}
            >
                <Typography variant="subtitle2">{label}</Typography>
                <Typography variant="body2">Number of calls: {payload[0].value}</Typography>
                {payload[1] && <Typography variant="body2">Active Time: {payload[1].value} hrs</Typography>}
            </Box>
        )
    }
    return null
}

// Custom tooltip for the pie chart
const PieChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    backgroundColor: colors.darkBlue,
                    color: "white",
                    p: 1.5,
                    borderRadius: 1,
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
                }}
            >
                <Typography variant="subtitle2">{payload[0].name}</Typography>
                <Typography variant="body2">Count: {payload[0].value}</Typography>
                <Typography variant="body2">
                    {payload[0].name === "INTERESTED" || payload[0].name === "CALLBACK" ? "Success" : "Failure"}
                </Typography>
            </Box>
        )
    }
    return null
}

const PerformanceReport = () => {
    const [selectedUser, setSelectedUser] = useState(users[0])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user)
        setDropdownOpen(false)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ p: 3, backgroundColor: colors.lightGray, minHeight: "100vh" }}>
                {/* main bar text */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Performance
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Analyze employee performance metrics and overall progress
                    </Typography>
                </Box>

                {/* User Profile Card with Dropdown */}
                <Card
                    sx={{
                        mb: 3,
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
                        borderRadius: 2,
                        overflow: "visible",
                    }}
                >
                    <Box>
                        {/* Main User Info */}
                        <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "#0F172A",
                                            color: "white",
                                            width: 70,
                                            height: 70,
                                            fontSize: "1.5rem",
                                            mr: 2,
                                        }}
                                    >
                                        {selectedUser.initials}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" component="h2" sx={{ color: colors.darkBlue, fontWeight: "medium" }}>
                                            {selectedUser.name}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {selectedUser.title} | {selectedUser.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedUser.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedUser.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={toggleDropdown}
                                    sx={{
                                        color: colors.darkBlue,
                                        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s",
                                    }}
                                >
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Box>
                        </CardContent>

                        {/* Team Members Dropdown */}
                        {dropdownOpen && (
                            <Box sx={{ px: 2, pb: 2 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: "bold",
                                        color: colors.darkBlue,
                                        mb: 1,
                                    }}
                                >
                                    Team Members
                                </Typography>

                                {users.slice(1).map((user) => (
                                    <Box
                                        key={user.id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            py: 1,
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: colors.lightGray,
                                            },
                                            borderRadius: 1,
                                        }}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: colors.mediumGray,
                                                color: "white",
                                                width: 40,
                                                height: 40,
                                                fontSize: "1rem",
                                                mr: 2,
                                            }}
                                        >
                                            {user.initials}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" sx={{ color: colors.darkBlue }}>
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.title}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Card>

                {/* Charts Section - Updated to make both cards the same width */}
                <Grid container spacing={3}>
                    {/* Disposition Summary */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                mb: 3,
                                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
                                borderRadius: 2,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        mb: 2,
                                        color: colors.darkBlue,
                                        textAlign: "center",
                                        fontWeight: "medium",
                                    }}
                                >
                                    Disposition Summary of Calls
                                </Typography>
                                <Box sx={{ height: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dispositionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {dispositionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<PieChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
                                        {dispositionData.map((entry, index) => (
                                            <Box
                                                key={`legend-${index}`}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mx: 1,
                                                    mb: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        backgroundColor: entry.color,
                                                        mr: 0.5,
                                                    }}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {entry.name}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Performance Graph - Now full width to match Disposition Summary */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
                                borderRadius: 2,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        mb: 2,
                                        color: colors.darkBlue,
                                        textAlign: "center",
                                        fontWeight: "medium",
                                    }}
                                >
                                    Performance Graph
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={performanceData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 0,
                                                bottom: 30,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                angle={-45}
                                                textAnchor="end"
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                                                }}
                                            />
                                            <YAxis allowDecimals={false} />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                                            <Bar name="Number of calls" dataKey="calls" fill={colors.green} radius={[4, 4, 0, 0]} />
                                            <Bar name="Active Time" dataKey="activeTime" fill={colors.yellow} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default PerformanceReport

