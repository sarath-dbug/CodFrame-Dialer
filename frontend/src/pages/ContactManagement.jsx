import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  TablePagination
} from "@mui/material";
import {
  Search,
  Add,
  CloudUpload,
  Edit,
  Delete,
  RemoveCircle,
  Refresh,
  GetApp,
  People,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../features/authSlice";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

const CRMComponent = () => {
  const themes = useTheme();
  const isMobile = useMediaQuery(themes.breakpoints.down("sm"));

  // Data from redux
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const { currentTeam } = useSelector((state) => state.team);

  // States for various dialogs
  const [selectedList, setSelectedList] = useState("");
  const [currentList, setCurrentList] = useState(null);
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openImportContacts, setOpenImportContacts] = useState(false);
  const [openNewList, setOpenNewList] = useState(false);
  const [openEditList, setOpenEditList] = useState(false);
  const [openRemoveList, setOpenRemoveList] = useState(false);
  const [openEmptyList, setOpenEmptyList] = useState(false);
  const [openAssignMembers, setOpenAssignMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [assignMembers, setAssignMembers] = useState([]);
  const [tempAssignMembers, setTempAssignMembers] = useState([]);
  const [assigningContacts, setAssigningContacts] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removingMember, setRemovingMember] = useState(false);
  const [lists, setLists] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [editListName, setEditListName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // States for form data
  const [newContact, setNewContact] = useState({
    number: "",
    secondaryNumber: "",
    name: "",
    companyName: "",
    email: "",
    dealValue: "",
    leadScore: "",
    disposition: "NEW",
    address: "",
    extra: "",
    remarks: "",
    note: "",
  });

  // States for table data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDisposition, setSelectedDisposition] = useState("All Dispositions");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch all members
  const fetchMembers = useCallback(async () => {
    if (!currentTeam?._id) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/member/fetchAllMembersInTeam?teamId=${currentTeam._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMembers(response.data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      showSnackbar("Failed to load members", "error");
    }
  }, [currentTeam?._id, token]);

  // Fetch all lists
  const fetchLists = useCallback(async () => {
    if (!currentTeam?._id) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/lists/fetchListsByTeam`, {
        params: { teamId: currentTeam._id },
        headers: { Authorization: `Bearer ${token}` }
      });

      const listsData = response.data.data;
      setLists(listsData);

      if (listsData.length > 0) {
        const firstList = listsData[0];
        setSelectedList(firstList.name);
        setCurrentList(firstList);
        
        // Set assigned members for the first list
        if (firstList.assignedTo) {
          setAssignMembers([firstList.assignedTo]);
          setTempAssignMembers([firstList.assignedTo]);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showSnackbar("Failed to load lists", "error");
    }
  }, [currentTeam?._id, token]);

  // Fetch all list contacts
  const fetchContacts = useCallback(async () => {
    if (!currentList?._id) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/contacts/fetchAllListContacts`,
        {
          params: { listId: currentList._id },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setContacts(response.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showSnackbar(
        error.response?.data?.msg || "Failed to load contacts",
        "error"
      );
      setContacts([]);
    }
  }, [currentList?._id, token]);

  useEffect(() => {
    fetchMembers();
    fetchLists();
  }, [fetchMembers, fetchLists]);

  useEffect(() => {
    if (currentList) {
      fetchContacts();
    }
  }, [currentList, fetchContacts]);

  // Handle list selection change
  const handleListChange = (event) => {
    const selectedListName = event.target.value;
    const list = lists.find(list => list.name === selectedListName);
    if (list) {
      setSelectedList(selectedListName);
      setCurrentList(list);
      setAssignMembers(list.assignedTo ? [list.assignedTo] : []);
      setTempAssignMembers(list.assignedTo ? [list.assignedTo] : []);
    }
  };

  // Handle add contact
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  const handleAddContact = async () => {
    if (!currentList?._id) {
      showSnackbar("Please select a list first", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/contacts/addContact`,
        {
          ...newContact,
          listId: currentList._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setContacts([...contacts, response.data.contact]);
      setNewContact({
        number: "",
        secondaryNumber: "",
        name: "",
        companyName: "",
        email: "",
        dealValue: "",
        leadScore: "",
        disposition: "NEW",
        address: "",
        extra: "",
        remarks: "",
        note: "",
      });

      setOpenAddContact(false);
      showSnackbar("Contact added successfully!");
    } catch (error) {
      console.error('Error adding contact:', error);
      showSnackbar(
        error.response?.data?.msg || "Failed to add contact",
        "error"
      );
    }
  };

  // Handle CSV file upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentList?._id) {
      showSnackbar("Please select both a file and a list", "error");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('listId', currentList._id);
    formData.append('countryCode', 'IN');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/contacts/addContacts-csv`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setOpenImportContacts(false);
      
      if (response.data.addedCount === 0) {
        showSnackbar(
          `No new contacts added. ${response.data.duplicatesSkipped} duplicates found.`,
          "info"
        );
      } else {
        showSnackbar(
          `Successfully added ${response.data.addedCount} contacts.`,
          "success"
        );
      }
      
      fetchContacts();
    } catch (error) {
      console.error('Error uploading file:', error);
      showSnackbar(
        error.response?.data?.msg || "Error uploading file",
        "error"
      );
    }
  };

  // Handle new list creation
  const handleCreateNewList = async () => {
    if (!newListName.trim()) {
      showSnackbar("List name cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/lists/addList`,
        {
          name: newListName,
          teamId: currentTeam._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLists([...lists, response.data.list]);
      setNewListName("");
      setOpenNewList(false);
      showSnackbar("List created successfully!");
      fetchLists();
    } catch (error) {
      console.error("Error creating list:", error);
      showSnackbar(error.response?.data?.msg || "Error creating list", "error");
    }
  };

  // Handle edit list
  const handleEditList = async () => {
    if (!editListName.trim()) {
      showSnackbar("List name cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/lists/updateList/${currentList._id}`,
        { name: editListName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setLists(lists.map(list =>
        list._id === currentList._id ? response.data.list : list
      ));
      setCurrentList(response.data.list);
      setSelectedList(response.data.list.name);
      setEditListName("");
      setOpenEditList(false);

      showSnackbar("List updated successfully!");
    } catch (error) {
      console.error("Error updating list:", error);
      showSnackbar(
        error.response?.data?.msg || "Error updating list",
        "error"
      );
    }
  };

  // Handle remove list
  const handleRemoveList = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/lists/deleteList/${currentList._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedLists = lists.filter((list) => list._id !== currentList._id);
      setLists(updatedLists);
      
      if (updatedLists.length > 0) {
        setSelectedList(updatedLists[0].name);
        setCurrentList(updatedLists[0]);
      } else {
        setSelectedList("");
        setCurrentList(null);
      }
      
      setOpenRemoveList(false);
      showSnackbar("List removed successfully!");
    } catch (error) {
      console.error("Error removing list:", error);
      showSnackbar(
        error.response?.data?.msg || "Failed to remove list",
        "error"
      );
    }
  };

  // Handle empty list
  const handleEmptyList = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/lists/emptyList/${currentList._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpenEmptyList(false);
      showSnackbar(response.data.msg || "List emptied successfully!");
      fetchContacts();
    } catch (error) {
      console.error("Error emptying list:", error);
      showSnackbar(
        error.response?.data?.msg || "Failed to empty list",
        "error"
      );
    }
  };

  // Handle Assign members
  const handleMemberToggle = (memberId) => {
    // If member is already assigned, unassign them
    if (assignMembers.includes(memberId)) {
      setAssignMembers(assignMembers.filter(id => id !== memberId));
    } else {
      // Otherwise assign the new member (only one allowed)
      setAssignMembers([memberId]);
    }
  };

  const handleAssignContacts = async () => {
    if (assignMembers.length === 0) {
      showSnackbar("Please select at least one member", "error");
      return;
    }

    try {
      setAssigningContacts(true);
      const memberId = assignMembers[0];
      const listId = currentList._id;

      const response = await axios.post(
        `${API_BASE_URL}/api/contacts/assignContactsFromList`,
        { memberId, listId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      showSnackbar(response.data.msg || "Successfully assigned list");
      setOpenAssignMembers(false);
      setTempAssignMembers(assignMembers);
      fetchLists();
    } catch (error) {
      console.error("Error assigning contacts:", error);
      showSnackbar(error.response?.data?.msg || "Failed to assign contacts", "error");
    } finally {
      setAssigningContacts(false);
    }
  };

  // Handle remove Assign members
  const handleRemoveAssignment = async () => {
    if (!memberToRemove || !currentList._id) return;

    try {
      setRemovingMember(true);

      await axios.put(
        `${API_BASE_URL}/api/contacts/removeAssignmentFromList`,
        {
          listId: currentList._id,
          memberId: memberToRemove._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setMemberToRemove(null);
      setAssignMembers([]);
      setTempAssignMembers([]);
      showSnackbar("Member removed from assignment successfully");
      fetchLists();
    } catch (error) {
      console.error("Error removing assignment:", error);
      showSnackbar(error.response?.data?.msg || "Failed to remove assignment", "error");
    } finally {
      setRemovingMember(false);
    }
  };

  // Handle exporting contacts to CSV
  const exportContactsToCSV = () => {
    if (contacts.length === 0) {
      showSnackbar('No contacts to export', 'warning');
      return;
    }

    try {
      const fields = [
        'Phone', 
        'Name', 
        'Company Name', 
        'Email', 
        'Disposition',
        'Address',
        'Extra',
        'Remarks',
        'Note'
      ];

      const data = contacts.map(contact => ({
        'Phone': contact.number || '',
        'Name': contact.name || '',
        'Company Name': contact.companyName || '',
        'Email': contact.email || '',
        'Disposition': contact.disposition || '',
        'Address': contact.address || '',
        'Extra': contact.extra || '',
        'Remarks': contact.remarks || '',
        'Note': contact.note || ''
      }));

      let csv = fields.join(',') + '\n';
      data.forEach(row => {
        csv += fields.map(field => 
          `"${row[field]?.toString().replace(/"/g, '""') || ''}"`
        ).join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedList}_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSnackbar('Contacts exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      showSnackbar('Failed to export contacts', 'error');
    }
  };

  // Update edit label field with currentList
  useEffect(() => {
    if (openEditList && currentList) {
      setEditListName(currentList.name);
    }
  }, [openEditList, currentList]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter contacts based on search and disposition
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === "" ||
      (contact.number && contact.number.includes(searchQuery)) ||
      (contact.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDisposition = 
      selectedDisposition === "All Dispositions" || 
      contact.disposition === selectedDisposition;

    return matchesSearch && matchesDisposition;
  });

  // Get current page of contacts
  const currentContacts = filteredContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "#F1F5F9",
          minHeight: "100vh",
          padding: 2,
          color: "#0F172A",
        }}
      >
        <Paper elevation={1} sx={{ p: 3, mb: 2, bgcolor: "white" }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", mb: 3 }}>
            CRM
          </Typography>

          {/* List selector */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Choose Lists :
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedList}
                  onChange={handleListChange}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#CED1D5",
                    },
                  }}
                >
                  {lists.map((list) => (
                    <MenuItem key={list._id} value={list.name}>
                      {list.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Buttons */}
          <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpenAddContact(true)}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Add Contact
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => setOpenImportContacts(true)}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Import Contacts
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpenNewList(true)}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  New List
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setOpenEditList(true)}
                disabled={!currentList}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Edit List
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={() => setOpenRemoveList(true)}
                disabled={!currentList}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Remove List
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<RemoveCircle />}
                onClick={() => setOpenEmptyList(true)}
                disabled={!currentList}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Empty List
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchContacts}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Refresh
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={exportContactsToCSV}
                disabled={contacts.length === 0}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Export List
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={4} sm={3} md={1.5}>
              <Button
                variant="outlined"
                startIcon={<People />}
                onClick={() => setOpenAssignMembers(true)}
                disabled={!currentList}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  p: 1,
                  height: "100%",
                  "&:hover": {
                    borderColor: "#0F172A",
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant={isMobile ? "caption" : "body2"} sx={{ mt: isMobile ? 0.5 : 1, textAlign: "center" }}>
                  Assign Members
                </Typography>
              </Button>
            </Grid>
          </Grid>

          {/* Disposition selector & Search bar */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedDisposition}
                  onChange={(e) => setSelectedDisposition(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#CED1D5",
                    },
                  }}
                >
                  <MenuItem value="All Dispositions">All Dispositions</MenuItem>
                  <MenuItem value="SKIP">SKIP</MenuItem>
                  <MenuItem value="CONTACTED">INCOMING</MenuItem>
                  <MenuItem value="QUALIFIED">CALLBACK</MenuItem>
                  <MenuItem value="NEW">NEW</MenuItem>
                  <MenuItem value="WRONG NUMBER">WRONG NUMBER</MenuItem>
                  <MenuItem value="INTERESTED">INTERESTED</MenuItem>
                  <MenuItem value="UNREACHABLE">UNREACHABLE</MenuItem>
                  <MenuItem value="NOT INTERESTED">NOT INTERESTED</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                size="small"
                placeholder="Phone / Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        sx={{ bgcolor: "#4CAF50", color: "white", "&:hover": { bgcolor: "#388E3C" } }}
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#CED1D5",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* table */}
          <TableContainer component={Paper} sx={{ mb: 2, overflowX: "auto" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#F1F5F9" }}>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>Secondary Phone</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Disposition</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Extra</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Total Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentContacts.length > 0 ? (
                  currentContacts.map((contact) => (
                    <TableRow key={contact._id || contact.id} hover>
                      <TableCell>{contact.number}</TableCell>
                      <TableCell>{contact.secondaryNumber}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.companyName}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.disposition}
                          size="small"
                          sx={{
                            bgcolor: "#4CAF50",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell>{contact.address}</TableCell>
                      <TableCell>{contact.extra}</TableCell>
                      <TableCell>{contact.remarks}</TableCell>
                      <TableCell>{contact.note}</TableCell>
                      <TableCell>{contact.totalDuration || "00:00:00"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No contacts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredContacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Assignments */}
          <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" component="h2">
                Assignments
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2, flexWrap: "wrap", gap: 1 }}>
              {tempAssignMembers.length > 0 ? (
                tempAssignMembers.map((memberId) => {
                  const member = members.find((m) => m._id === memberId);
                  return (
                    <Chip
                      key={memberId}
                      label={member?.name || "Unknown Member"}
                      onDelete={() => setMemberToRemove(member)}
                      sx={{ mr: 1, bgcolor: "#F1F5F9" }}
                    />
                  );
                })
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No members assigned
                </Typography>
              )}

              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={() => setOpenAssignMembers(true)}
                disabled={!currentList}
                sx={{
                  bgcolor: "#0F172A",
                  color: "white",
                  fontWeight: "medium",
                  boxShadow: "0 4px 6px rgba(15, 23, 42, 0.1)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#1E293B",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 8px rgba(15, 23, 42, 0.2)",
                  },
                  ml: 1
                }}
              >
                Assign
              </Button>
            </Box>
          </Paper>
        </Paper>

        {/* Add Contact Dialog */}
        <Dialog open={openAddContact} onClose={() => setOpenAddContact(false)} fullWidth maxWidth="md">
          <DialogTitle>Add Contact</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="number"
                  value={newContact.number}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secondary Number"
                  name="secondaryNumber"
                  value={newContact.secondaryNumber}
                  onChange={handleContactInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={newContact.name}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={newContact.companyName}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newContact.email}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Deal Value"
                  name="dealValue"
                  type="number"
                  value={newContact.dealValue}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lead Score"
                  name="leadScore"
                  type="number"
                  value={newContact.leadScore}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="disposition-label">Disposition</InputLabel>
                  <Select
                    labelId="disposition-label"
                    id="disposition"
                    name="disposition"
                    value={newContact.disposition}
                    onChange={handleContactInputChange}
                    label="Disposition"
                    required
                  >
                    <MenuItem value="SKIP">SKIP</MenuItem>
                    <MenuItem value="CONTACTED">INCOMING</MenuItem>
                    <MenuItem value="QUALIFIED">CALLBACK</MenuItem>
                    <MenuItem value="NEW">NEW</MenuItem>
                    <MenuItem value="WRONG NUMBER">WRONG NUMBER</MenuItem>
                    <MenuItem value="INTERESTED">INTERESTED</MenuItem>
                    <MenuItem value="UNREACHABLE">UNREACHABLE</MenuItem>
                    <MenuItem value="NOT INTERESTED">NOT INTERESTED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={newContact.address}
                  onChange={handleContactInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Extra"
                  name="extra"
                  value={newContact.extra}
                  onChange={handleContactInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={newContact.remarks}
                  onChange={handleContactInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  name="note"
                  value={newContact.note}
                  onChange={handleContactInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenAddContact(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              variant="contained"
              sx={{
                bgcolor: "#0F172A",
                color: "white",
                fontWeight: "medium",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#1E293B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              Add Contact
            </Button>
          </DialogActions>
        </Dialog>

        {/* Import Contacts Dialog */}
        <Dialog open={openImportContacts} onClose={() => setOpenImportContacts(false)} fullWidth maxWidth="sm">
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  width: "100%",
                  height: 100,
                  borderStyle: "dashed",
                  borderColor: "#CED1D5",
                  color: "#0F172A",
                }}
              >
                {selectedFile ? selectedFile.name : 'Upload File'}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                />
              </Button>
            </Box>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Select List</InputLabel>
              <Select
                label="Select List"
                value={selectedList}
                onChange={handleListChange}
              >
                {lists.map((list) => (
                  <MenuItem key={list._id} value={list.name}>
                    {list.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenImportContacts(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile}
              sx={{
                bgcolor: "#0F172A",
                color: "white",
                fontWeight: "medium",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#1E293B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              Import
            </Button>
          </DialogActions>
        </Dialog>

        {/* New List Dialog */}
        <Dialog open={openNewList} onClose={() => setOpenNewList(false)} fullWidth maxWidth="xs">
          <DialogTitle>Create New List</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              required
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenNewList(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewList}
              variant="contained"
              disabled={!newListName.trim()}
              sx={{
                bgcolor: "#0F172A",
                color: "white",
                fontWeight: "medium",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#1E293B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit List Dialog */}
        <Dialog open={openEditList} onClose={() => setOpenEditList(false)} fullWidth maxWidth="xs">
          <DialogTitle>Edit List</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="New List Name"
              value={editListName}
              onChange={(e) => setEditListName(e.target.value)}
              required
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEditList(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditList}
              variant="contained"
              disabled={!editListName.trim()}
              sx={{
                bgcolor: "#0F172A",
                color: "white",
                fontWeight: "medium",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#1E293B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove List Dialog */}
        <Dialog open={openRemoveList} onClose={() => setOpenRemoveList(false)} fullWidth maxWidth="xs">
          <DialogTitle>Remove List</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">Are you sure you want to remove the list "{selectedList}"?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenRemoveList(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRemoveList} variant="contained" color="error">
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        {/* Empty List Dialog */}
        <Dialog open={openEmptyList} onClose={() => setOpenEmptyList(false)} fullWidth maxWidth="xs">
          <DialogTitle>Empty List</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              Are you sure you want to empty the list "{selectedList}"? This will remove all contacts from this list.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEmptyList(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEmptyList} variant="contained" color="error">
              Empty
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Members Dialog */}
        <Dialog
          open={openAssignMembers}
          onClose={() => setOpenAssignMembers(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Assign Members</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Selected Members:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {assignMembers.map((memberId) => {
                  const member = members.find((m) => m._id === memberId);
                  return (
                    <Chip
                      key={memberId}
                      label={member?.name || memberId}
                      onDelete={() => handleMemberToggle(memberId)}
                      sx={{ bgcolor: "#F1F5F9" }}
                    />
                  );
                })}
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Available Members:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {members
                .filter((m) => !assignMembers.includes(m._id))
                .map((member) => (
                  <Button
                    key={member._id}
                    variant="outlined"
                    onClick={() => handleMemberToggle(member._id)}
                    startIcon={<Add />}
                    sx={{
                      justifyContent: "flex-start",
                      borderColor: "#CED1D5",
                      color: "#0F172A",
                    }}
                  >
                    {member.name}
                  </Button>
                ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenAssignMembers(false)}
              sx={{
                color: "#0F172A",
                fontWeight: "medium",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAssignContacts}
              disabled={assigningContacts || assignMembers.length === 0}
              sx={{
                bgcolor: "#0F172A",
                color: "white",
                fontWeight: "medium",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#1E293B",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px rgba(15, 23, 42, 0.2)",
                },
              }}
            >
              {assigningContacts ? "Assigning..." : "Assign"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove Confirmation Dialog */}
        <Dialog
          open={!!memberToRemove}
          onClose={() => setMemberToRemove(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove "{memberToRemove?.name}" from assignment?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setMemberToRemove(null)}
              sx={{ color: "#0F172A" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveAssignment}
              color="error"
              variant="contained"
              disabled={removingMember}
            >
              {removingMember ? "Removing..." : "Remove"}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Box>
    </ThemeProvider>
  );
};

export default CRMComponent;