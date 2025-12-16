import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    // Kalau tidak ada token, paksa pindah ke Login
    return <Navigate to="/login" replace />;
  }

  // Kalau aman, boleh lanjut buka halaman
  return children;
};

export default ProtectedRoute;