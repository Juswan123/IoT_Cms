import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const HomeDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // State Data
  const [popularProjects, setPopularProjects] = useState([]);
  const [latestProjects, setLatestProjects] = useState([]);
  const [componentsList, setComponentsList] = useState([]); // List untuk dropdown
  
  // State Filter
  const [search, setSearch] = useState('');
  const [filterComponent, setFilterComponent] = useState(''); // ID komponen yg dipilih
  
  const [loading, setLoading] = useState(true);

  // 1. Ambil Daftar Komponen (untuk isi dropdown) sekali saja saat load
  useEffect(() => {
    axios.get('http://localhost:3000/api/projects/components') // Sesuaikan endpoint komponen Anda
      .then(res => setComponentsList(res.data.data))
      .catch(err => console.error("Gagal load komponen", err));
  }, []);

  // 2. Ambil Data Project (Reload jika search atau filterComponent berubah)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // A. Project Populer (Tetap tampil global)
        const resPopular = await axios.get(`http://localhost:3000/api/projects?sortBy=popular&limit=3`);
        setPopularProjects(resPopular.data.data);

        // B. Project Terbaru (Kena Filter & Search)
        // Bangun URL Query secara dinamis
        let queryUrl = `http://localhost:3000/api/projects?limit=12&orderBy=latest`;
        
        if (search) queryUrl += `&search=${search}`;
        if (filterComponent) queryUrl += `&componentId=${filterComponent}`;

        const resLatest = await axios.get(queryUrl);
        setLatestProjects(resLatest.data.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil data", error);
        setLoading(false);
      }
    };

    // Beri sedikit delay (debounce) agar tidak request tiap ketik huruf
    const timeoutId = setTimeout(() => {
        fetchProjects();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, filterComponent]); 


  // --- UI Component: Project Card ---
  const ProjectCard = ({ project, badgeColor = '#e0f2fe', textColor = '#0369a1' }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: '180px', position: 'relative', background: '#f1f5f9' }}>
         <img 
            src={`http://localhost:3000${project.schematicUrl}`} 
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { 
                e.target.onerror = null; // Mencegah loop jika gambar lokal juga hilang
                e.target.src = '/no-image.png'; // Mengambil dari folder client/public
    }} 
        />
         <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
            👁️ {project.views}
         </div>
      </div>
      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
         <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: '1.4' }}>
            <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', color: '#1e293b' }}>
                {project.title}
            </Link>
         </h3>
         <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px', flex: 1 }}>
            {project.description.substring(0, 60)}...
         </p>
         
         {/* List Komponen Kecil */}
         <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {project.components.slice(0, 2).map(rel => (
                <span key={rel.component.id} style={{ background: badgeColor, color: textColor, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                    {rel.component.name}
                </span>
            ))}
            {project.components.length > 2 && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+{project.components.length - 2}</span>}
         </div>

         <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
            Oleh: {project.author?.name}
         </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '60px 20px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Jelajahi Inovasi IoT</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 30px' }}>
          Platform berbagi proyek Arduino dan ESP32.
        </p>
        
        {/* SEARCH BAR & FILTER */}
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Input Pencarian */}
            <input 
                type="text" 
                placeholder="Cari judul proyek..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 2, padding: '15px', borderRadius: '8px', border: 'none', outline: 'none', minWidth: '200px' }}
            />
            
            {/* Dropdown Filter Komponen */}
            <select 
                value={filterComponent}
                onChange={(e) => setFilterComponent(e.target.value)}
                style={{ flex: 1, padding: '15px', borderRadius: '8px', border: 'none', outline: 'none', cursor: 'pointer', minWidth: '150px', color: '#333' }}
            >
                <option value="">Semua Komponen</option>
                {componentsList.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* SECTION POPULER (Hanya muncul jika tidak sedang mencari/filter) */}
        {!search && !filterComponent && (
            <div style={{ marginBottom: '50px' }}>
                <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🔥 Sedang Banyak Dilihat
                </h2>
                <div className="card-grid">
                    {popularProjects.map(proj => (
                        <ProjectCard key={proj.id} project={proj} badgeColor="#fff7ed" textColor="#c2410c" />
                    ))}
                </div>
            </div>
        )}

        {/* SECTION TERBARU (Hasil Filter muncul disini) */}
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {search || filterComponent ? 'Hasil Pencarian' : '📡 Proyek Terbaru'}
                </h2>
                {user && (
                    <Link to="/create" className="btn btn-primary">
                        + Upload Karyamu
                    </Link>
                )}
            </div>
            
            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Sedang memuat data...</p>
            ) : latestProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ color: '#64748b' }}>Tidak ditemukan proyek dengan kata kunci/filter tersebut.</p>
                    <button onClick={() => {setSearch(''); setFilterComponent('');}} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
                        Reset Filter
                    </button>
                </div>
            ) : (
                <div className="card-grid">
                    {latestProjects.map(proj => (
                        <ProjectCard key={proj.id} project={proj} />
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default HomeDashboard;