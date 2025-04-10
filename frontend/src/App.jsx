import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import PageNotFound from "./components/PageNotFound";
import TeamManagement from "./pages/TeamManagement";
import AuthPages from './pages/Auth-Pages'
import { Provider } from 'react-redux';
import { store } from './app/store';
import ProtectedRoute from './components/ProtectedRoute';
import Members from "./pages/Members";
import ContactManagement from "./pages/ContactManagement";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Performance from "./pages/Performance";
import ChangePassword from "./pages/ChangePassword";
import UserProfile from "./pages/UserProfile";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AuthPages />} />
          <Route path="/login" element={<AuthPages />} />

          {/* Protected routes */}
          <Route path="/app" element={<ProtectedRoute> <Layout /></ProtectedRoute>}  >
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/contacts" element={<ContactManagement />} />
            <Route path="/app/members" element={<Members />} />
            <Route path="/app/reports/attendance" element={<Attendance />} />
            <Route path="/app/reports/reports" element={<Reports />} />
            <Route path="/app/reports/performance" element={<Performance />} />
            <Route path="/app/user-profile" element={<UserProfile />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/settings/change-password" element={<ChangePassword />} />
            <Route path="/app/teams" element={<TeamManagement />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;