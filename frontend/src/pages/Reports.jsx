import { useState, useEffect } from "react"
import {
    AppBar,
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material"
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    CalendarToday as CalendarTodayIcon,
    FileDownload as FileDownloadIcon,
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon,
    Phone as PhoneIcon,
} from "@mui/icons-material"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { format } from "date-fns"

// Original mock data
const originalDispositionData = [
    { name: "SKIP", value: 35, color: "#F9D949" },
    { name: "CALLBACK", value: 20, color: "#00A896" },
    { name: "WRONG NUMBER", value: 15, color: "#333333" },
    { name: "BUSY", value: 15, color: "#5E2129" },
    { name: "INTERESTED", value: 10, color: "#F9D949" },
    { name: "UNREACHABLE", value: 5, color: "#CED1D5" },
]

const originalCallSummaryData = [{ name: "Abhishek Kumar", value: 18 }]

const originalContactRatioData = [
    { name: "Connected Calls", value: 1, color: "#4ADE80" },
    { name: "Not Connected Calls", value: 4, color: "#FF6B8B" },
]

const originalCallsData = [
    {
        id: 1,
        name: "Cammy",
        phone: "+919566378195",
        date: "2025-03-19",
        time: "01:02 PM",
        duration: "7s",
        durationColor: "#4ADE80",
        timeSpent: "54s",
        dialer: "Phone Dialer",
        calledBy: "Abhishek Kumar",
        disposition: "INTERESTED",
        remarks: "Interested",
        notes: "Follow",
        list: "Loan",
        team: "packpin",
        template: "",
        recording: "Missing",
    },
    {
        id: 2,
        name: "Willard",
        phone: "+919723039197",
        date: "2025-03-19",
        time: "10:40 AM",
        duration: "0s",
        durationColor: "#FF6B8B",
        timeSpent: "12 mins",
        dialer: "Phone Dialer",
        calledBy: "Abhishek Kumar",
        disposition: "UNREACHABLE",
        remarks: "Interested",
        notes: "Follow",
        list: "Loan",
        team: "packpin",
        template: "",
        recording: "Missing",
    },
    {
        id: 3,
        name: "John",
        phone: "+919898989898",
        date: "2025-03-19",
        time: "10:40 AM",
        duration: "0s",
        durationColor: "#FF6B8B",
        timeSpent: "0s",
        dialer: "Phone Dialer",
        calledBy: "Abhishek Kumar",
        disposition: "SKIP",
        remarks: "Interested",
        notes: "Follow",
        list: "Default",
        team: "packpin",
        template: "",
        recording: "Missing",
    },
    {
        id: 4,
        name: "Darzen",
        phone: "+919898989898",
        date: "2025-03-19",
        time: "10:40 AM",
        duration: "0s",
        durationColor: "#FF6B8B",
        timeSpent: "0s",
        dialer: "Phone Dialer",
        calledBy: "Abhishek Kumar",
        disposition: "SKIP",
        remarks: "Interested",
        notes: "Follow",
        list: "Default",
        team: "packpin",
        template: "",
        recording: "Missing",
    },
    {
        id: 5,
        name: "Rocky",
        phone: "9891560190",
        date: "2025-03-30",
        time: "06:45 PM",
        duration: "0s",
        durationColor: "#FF6B8B",
        timeSpent: "0s",
        dialer: "Phone Dialer",
        calledBy: "Abhishek Kumar",
        disposition: "SKIP",
        remarks: "Interested",
        notes: "Follow",
        list: "Default",
        team: "packpin",
        template: "",
        recording: "Missing",
    },
]

// Lists, members, and dispositions data
const listsData = ["All Lists", "Default", "Loan", "Marketing"]
const membersData = ["All Members", "Abhishek Kumar", "John Doe", "Jane Smith"]
const dispositionsData = ["All Dispos", "SKIP", "CALLBACK", "WRONG NUMBER", "BUSY", "INTERESTED", "UNREACHABLE"]

const ReportsDashboard = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [hoveredChart, setHoveredChart] = useState(null)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterField, setFilterField] = useState("name")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter states
    const [selectedList, setSelectedList] = useState("All Lists")
    const [selectedMember, setSelectedMember] = useState("All Members")
    const [selectedDisposition, setSelectedDisposition] = useState("All Dispos")

    // Date range state
    const [startDate, setStartDate] = useState(dayjs("2025-03-01"))
    const [endDate, setEndDate] = useState(dayjs("2025-03-31"))

    // Data states
    const [callsData, setCallsData] = useState(originalCallsData)
    const [filteredData, setFilteredData] = useState(originalCallsData)
    const [dispositionData, setDispositionData] = useState(originalDispositionData)
    const [callSummaryData, setCallSummaryData] = useState(originalCallSummaryData)
    const [contactRatioData, setContactRatioData] = useState(originalContactRatioData)

    const totalPages = Math.ceil(filteredData.length / rowsPerPage)

    // Custom theme colors
    const colors = {
        primary: "#0F172A",
        secondary: "#CED1D5",
        background: "#F1F5F9",
        success: "#4ADE80",
        error: "#FF6B8B",
    }

    const handleChartHover = (chartName) => {
        setHoveredChart(chartName)
    }

    const handleChartLeave = () => {
        setHoveredChart(null)
    }

    const getDispositionCount = (name) => {
        return dispositionData.find((item) => item.name === name)?.value || 0
    }

    const getContactRatioCount = (name) => {
        return contactRatioData.find((item) => item.name === name)?.value || 0
    }

    const getCallSummaryCount = () => {
        return callSummaryData.reduce((sum, item) => sum + item.value, 0)
    }

    // Handle pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    // Filter data based on all criteria
    const filterData = () => {
        let filtered = [...originalCallsData]

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = dayjs(item.date)
                return (
                    itemDate.isSame(startDate) ||
                    itemDate.isSame(endDate) ||
                    (itemDate.isAfter(startDate) && itemDate.isBefore(endDate))
                )
            })
        }

        // Filter by list
        if (selectedList !== "All Lists") {
            filtered = filtered.filter((item) => item.list === selectedList)
        }

        // Filter by member (calledBy)
        if (selectedMember !== "All Members") {
            filtered = filtered.filter((item) => item.calledBy === selectedMember)
        }

        // Filter by disposition
        if (selectedDisposition !== "All Dispos") {
            filtered = filtered.filter((item) => item.disposition === selectedDisposition)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((row) => {
                const fieldValue = String(row[filterField] || "").toLowerCase()
                return fieldValue.includes(searchTerm.toLowerCase())
            })
        }

        return filtered
    }

    // Update chart data based on filtered data
    const updateChartData = (filteredData) => {
        // Update disposition data
        const dispositionCounts = {}
        filteredData.forEach((item) => {
            if (!dispositionCounts[item.disposition]) {
                dispositionCounts[item.disposition] = 0
            }
            dispositionCounts[item.disposition]++
        })

        const newDispositionData = originalDispositionData.map((item) => ({
            ...item,
            value: dispositionCounts[item.name] || 0,
        }))

        // Update call summary data
        const callerCounts = {}
        filteredData.forEach((item) => {
            if (!callerCounts[item.calledBy]) {
                callerCounts[item.calledBy] = 0
            }
            callerCounts[item.calledBy]++
        })

        const newCallSummaryData = Object.keys(callerCounts).map((name) => ({
            name,
            value: callerCounts[name],
        }))

        // Update contact ratio data
        const connectedCalls = filteredData.filter((item) => item.duration !== "0s").length
        const notConnectedCalls = filteredData.length - connectedCalls

        const newContactRatioData = [
            { name: "Connected Calls", value: connectedCalls, color: "#4ADE80" },
            { name: "Not Connected Calls", value: notConnectedCalls, color: "#FF6B8B" },
        ]

        setDispositionData(newDispositionData)
        setCallSummaryData(newCallSummaryData.length > 0 ? newCallSummaryData : [{ name: "No Data", value: 0 }])
        setContactRatioData(newContactRatioData)
    }

    // Apply filters and update data
    const applyFilters = () => {
        const filtered = filterData()
        setFilteredData(filtered)
        updateChartData(filtered)
        setCurrentPage(1)
    }

    // Handle generate button click
    const handleGenerate = () => {
        applyFilters()
    }

    // Calculate pagination data
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    // Effect to filter data when search term changes
    useEffect(() => {
        applyFilters()
    }, [searchTerm])

    // Initial data load
    useEffect(() => {
        setFilteredData(originalCallsData)
    }, [])

    return (
        <Box sx={{ bgcolor: colors.background, minHeight: "100vh" }}>
            <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
                {/* main bar text */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Reports
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        View and analyze key performance and activity reports
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        Filter
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <Select
                                    value={selectedList}
                                    onChange={(e) => setSelectedList(e.target.value)}
                                    displayEmpty
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        bgcolor: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.secondary,
                                        },
                                    }}
                                >
                                    {listsData.map((list) => (
                                        <MenuItem key={list} value={list}>
                                            {list}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <Select
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                    displayEmpty
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        bgcolor: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.secondary,
                                        },
                                    }}
                                >
                                    {membersData.map((member) => (
                                        <MenuItem key={member} value={member}>
                                            {member}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <Select
                                    value={selectedDisposition}
                                    onChange={(e) => setSelectedDisposition(e.target.value)}
                                    displayEmpty
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        bgcolor: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.secondary,
                                        },
                                    }}
                                >
                                    {dispositionsData.map((dispo) => (
                                        <MenuItem key={dispo} value={dispo}>
                                            {dispo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    {/* Start Date Picker */}
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarTodayIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { bgcolor: "#fff" },
                                                }}
                                            />
                                        )}
                                    />

                                    {/* End Date Picker */}
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarTodayIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { bgcolor: "#fff" },
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleGenerate}
                                sx={{
                                    bgcolor: colors.primary,
                                    color: "#fff",
                                    "&:hover": {
                                        bgcolor: "#1A2542"
                                    },
                                }}
                            >
                                GENERATE
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Grid container spacing={3}>
                    {/* Disposition Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={0}
                            sx={{ p: 3, height: "100%", position: "relative" }}
                            onMouseEnter={() => handleChartHover("disposition")}
                            onMouseLeave={handleChartLeave}
                        >
                            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
                                Disposition Summary
                            </Typography>

                            <Box sx={{ height: 250, position: "relative" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dispositionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {dispositionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        {hoveredChart === "disposition" && (
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "4px 8px",
                                                    fontSize: "12px",
                                                }}
                                                formatter={(value, name) => [`${name}: ${value}`, ""]}
                                            />
                                        )}
                                    </PieChart>
                                </ResponsiveContainer>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                        {dispositionData.reduce((sum, item) => sum + item.value, 0)}
                                    </Typography>
                                    <Typography variant="body2">Total</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mt: 2 }}>
                                {dispositionData.map((item, index) => (
                                    <Box key={index} sx={{ display: "flex", alignItems: "center", mr: 2, mb: 1 }}>
                                        <Box sx={{ width: 12, height: 12, bgcolor: item.color, mr: 1 }} />
                                        <Typography variant="caption">{item.name}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Call Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={0}
                            sx={{ p: 3, height: "100%" }}
                            onMouseEnter={() => handleChartHover("callSummary")}
                            onMouseLeave={handleChartLeave}
                        >
                            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
                                Call Summary
                            </Typography>

                            <Box sx={{ height: 250, position: "relative" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={callSummaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Bar dataKey="value" fill={colors.success} />
                                        {hoveredChart === "callSummary" && (
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "4px 8px",
                                                    fontSize: "12px",
                                                }}
                                                formatter={(value) => [value, "Calls"]}
                                            />
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "10%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        textAlign: "center",
                                        bgcolor: "rgba(255,255,255,0.8)",
                                        p: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                        {getCallSummaryCount()}
                                    </Typography>
                                    <Typography variant="body2">Total Calls</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Contact Ratio */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={0}
                            sx={{ p: 3, height: "100%" }}
                            onMouseEnter={() => handleChartHover("contactRatio")}
                            onMouseLeave={handleChartLeave}
                        >
                            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
                                Contact Ratio
                            </Typography>

                            <Box sx={{ height: 250, position: "relative" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={contactRatioData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {contactRatioData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        {hoveredChart === "contactRatio" && (
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "4px 8px",
                                                    fontSize: "12px",
                                                }}
                                                formatter={(value, name) => [`${name}: ${value}`, ""]}
                                            />
                                        )}
                                    </PieChart>
                                </ResponsiveContainer>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                        {contactRatioData.reduce((sum, item) => sum + item.value, 0)}
                                    </Typography>
                                    <Typography variant="body2">Total</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                                {contactRatioData.map((item, index) => (
                                    <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Box sx={{ width: 12, height: 12, bgcolor: item.color, mr: 1 }} />
                                        <Typography variant="caption">
                                            {item.name} ({item.value})
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Table Section */}
                <Paper elevation={0} sx={{ mt: 4, p: 2 }}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search..."
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.secondary,
                                        },
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <Select
                                    value={filterField}
                                    onChange={(e) => setFilterField(e.target.value)}
                                    displayEmpty
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.secondary,
                                        },
                                    }}
                                >
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="phone">Phone</MenuItem>
                                    <MenuItem value="disposition">Disposition</MenuItem>
                                    <MenuItem value="list">List</MenuItem>
                                    <MenuItem value="team">Team</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={applyFilters}
                                sx={{
                                    bgcolor: colors.success,
                                    color: "#fff",
                                    "&:hover": {
                                        bgcolor: "#3AAC70",
                                    },
                                }}
                            >
                                SEARCH
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                sx={{
                                    bgcolor: colors.primary,
                                    color: "#fff",
                                    "&:hover": {
                                        bgcolor: "#1A2542",
                                    },
                                }}
                            >
                                EXPORT
                            </Button>
                        </Grid>
                    </Grid>

                    <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Time Spent</TableCell>
                                    <TableCell>Dialer</TableCell>
                                    <TableCell>Called/Received By</TableCell>
                                    <TableCell>Disposition</TableCell>
                                    <TableCell>Remarks</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>List</TableCell>
                                    <TableCell>Team</TableCell>
                                    <TableCell>Template</TableCell>
                                    <TableCell>Recording</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                {row.phone}
                                                <IconButton size="small" sx={{ ml: 1 }}>
                                                    <PhoneIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.time}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    bgcolor: row.durationColor,
                                                    color: "#fff",
                                                    borderRadius: "4px",
                                                    px: 1,
                                                    display: "inline-block",
                                                    minWidth: "30px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {row.duration}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{row.timeSpent}</TableCell>
                                        <TableCell>{row.dialer}</TableCell>
                                        <TableCell>{row.calledBy}</TableCell>
                                        <TableCell>{row.disposition}</TableCell>
                                        <TableCell>{row.remarks}</TableCell>
                                        <TableCell>{row.notes}</TableCell>
                                        <TableCell>{row.list}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.template}</TableCell>
                                        <TableCell sx={{ color: colors.error }}>{row.recording}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                Rows per page:
                            </Typography>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 70 }}>
                                <Select
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(e.target.value)}
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: colors.secondary,
                                        },
                                    }}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                {currentPage}/{totalPages} of {filteredData.length}
                            </Typography>
                            <IconButton size="small" onClick={handlePrevPage} disabled={currentPage === 1}>
                                <NavigateBeforeIcon />
                            </IconButton>
                            <IconButton size="small" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                <NavigateNextIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default ReportsDashboard