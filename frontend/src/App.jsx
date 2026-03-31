import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import BookingWizard from './pages/BookingWizard';
import Facilities from './pages/Facilities';
import Complaints from './pages/Complaints';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
           <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/support" element={<Complaints />} />

            {/* Admin Dedicated Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Security Dedicated Routes */}
            <Route element={<ProtectedRoute allowedRoles={['security']} />}>
              <Route path="/security" element={<SecurityDashboard />} />
            </Route>

            {/* General Authenticated Modules */}
            <Route element={<ProtectedRoute />}>
              <Route path="/rooms" element={<BookingWizard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
