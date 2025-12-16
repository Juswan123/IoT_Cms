import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ fontSize: '4rem', color: '#cbd5e1' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Halaman tidak ditemukan.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', textDecoration:'none', color:'white' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;