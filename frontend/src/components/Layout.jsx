import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const LayoutContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#F1F5F9'
});

const MainContent = styled(Box)(({ theme, sidebarwidth }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  marginLeft: sidebarwidth,
  minWidth: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const ContentArea = styled(Box)({
  flex: 1,
  padding: '16px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0
});

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <MainContent sidebarwidth={isSidebarOpen ? '256px' : '80px'}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;