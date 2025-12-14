import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi mengambil data dari API Backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/projects');
      setProjects(response.data.data); // Simpan data ke state
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setLoading(false);
    }
  };

  // Jalankan fungsi saat halaman dibuka
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Daftar Proyek IoT</h2>
        <Link to="/create" style={{ padding: '10px 15px', background: 'green', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          + Tambah Proyek
        </Link>
      </div>

      {loading ? (
        <p>Sedang memuat data...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          
          {/* Looping Data Project */}
          {projects.map((project) => (
            <div key={project.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              {/* Gambar Skema */}
              <div style={{ height: '150px', background: '#f0f0f0', overflow: 'hidden' }}>
                 {/* Backend menyimpan path, kita tambah URL server di depannya */}
                <img 
                  src={`http://localhost:3000${project.schematicUrl}`} 
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }} // Fallback jika gambar rusak
                />
              </div>
              
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px' }}>{project.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {project.description.substring(0, 100)}...
                </p>
                <div style={{ marginTop: '10px' }}>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'blue', textDecoration: 'none', fontSize: '14px' }}>
                    Lihat Kode (GitHub)
                  </a>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && <p>Belum ada proyek. Silakan upload dulu.</p>}
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;