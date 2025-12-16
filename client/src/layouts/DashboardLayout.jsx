import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">📡 IoT CMS</Link>
          <div className="nav-links" style={{display:'flex', gap: 15, alignItems:'center'}}>
            <Link to="/">Beranda</Link>
            {user ? (
              <>
                <Link to="/profile">Profil Saya</Link>
                <button onClick={logout} className="btn-logout">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{color:'white'}}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* KONTEN HALAMAN (ANAKNYA) */}
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>

      {/* FOOTER SEDERHANA */}
      <footer style={{ textAlign: 'center', padding: '20px', background: '#f1f5f9', marginTop: '40px', color: '#64748b' }}>
        &copy; {new Date().getFullYear()} IoT CMS Project
      </footer>
    </div>
  );
};

export default DashboardLayout;