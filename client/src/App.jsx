import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import Halaman
import CreateProject from './pages/dashboard/CreateProject';
import HomeDashboard from './pages/dashboard/HomeDashboard'; // <-- Import baru

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ padding: '15px', background: '#333', color: 'white', marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontWeight: 'bold' }}>
            IoT CMS
          </Link>
        </nav>
        
        <Routes>
          {/* Panggil HomeDashboard di route utama */}
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/create" element={<CreateProject />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;