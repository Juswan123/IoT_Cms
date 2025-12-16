import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import HomeDashboard from '../pages/dashboard/HomeDashboard';
import ProfilePage from '../pages/dashboard/ProfilePage';
import CreateProject from '../pages/dashboard/CreateProject';
import EditProject from '../pages/dashboard/EditProject';
import ProjectDetail from '../pages/dashboard/ProjectDetail';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protection
import ProtectedRoute from '../components/ProtectedRoute'; // Pastikan path ini benar sesuai struktur Anda

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Rute Dashboard (Punya Navbar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        
        {/* Rute yang butuh Login (Protected) */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
      </Route>

      {/* 2. Rute Auth (Tampilan Khusus) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 3. 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;