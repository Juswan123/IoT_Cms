import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: '#f8fafc' 
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
           <h1 style={{ color: '#2563eb' }}>📡 IoT CMS</h1>
           <p style={{ color: '#64748b' }}>Masuk untuk mengelola proyek</p>
        </div>
        
        {/* Render Halaman Login/Register disini */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;