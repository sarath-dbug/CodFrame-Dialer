import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Divider
} from '@mui/material';
import {
  Person,
  Lock,
  Apps,
  SwapHoriz,
  ViewList,
  Message,
  CloudQueue,
  ChevronRight
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/DL-Icon.png';

const colors = {
  darkBlue: "#0F172A",
  lightGray: "#CED1D5",
  paleBlue: "#F1F5F9",
};

// Custom theme with the provided colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#0F172A',
    },
    secondary: {
      main: '#CED1D5',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F1F5F9',
          },
        },
      },
    },
  },
});

// Settings menu items with routes
const menuItems = [
  { text: 'General', icon: <Person />, path: '/settings/general' },
  { text: 'Change Password', icon: <Lock />, path: '/app/settings/change-password' },
  { text: 'Default Dialer', icon: <Apps />, path: '/settings/default-dialer' },
  { text: 'Custom Status / Disposition', icon: <SwapHoriz />, path: '/settings/custom-status' },
  { text: 'Custom Fields', icon: <ViewList />, path: '/settings/custom-fields' },
  { text: 'Message Templates', icon: <Message />, path: '/settings/message-templates' },
  { text: 'Storage', icon: <CloudQueue />, path: '/settings/storage' },
];

function Settings() {
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  return (
    <ThemeProvider theme={theme}>
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
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customize your preferences and manage application configurations
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <Box
              component="img"
              src={logoIcon}
              alt="App Logo"
              sx={{
                height: 50,
                width: 50,
                objectFit: 'contain'
              }}
            />
            <Typography variant="subtitle1" color="text.primary">
              Dialer Enterprise v1.0
            </Typography>
          </Box>

          <Divider />

          <List sx={{ py: 0 }}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton 
                    sx={{ py: 2 }}
                    onClick={() => handleMenuItemClick(item.path)}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: 500
                      }}
                    />
                    <ChevronRight color="action" />
                  </ListItemButton>
                </ListItem>
                {index < menuItems.length - 1 && (
                  <Divider variant="fullWidth" component="li" sx={{ margin: 0 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Settings;