import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // Ambil token, logout, dan status loading autentikasi
  const { token, logout, loading: authLoading } = useContext(AuthContext);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- AMBIL DATA PROFIL ---
  useEffect(() => {
    // 1. Jika AuthContext masih loading (masih cari token di localStorage), kita tunggu dulu.
    if (authLoading) return;

    // 2. Jika selesai loading tapi token tidak ada, tendang ke Login
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
        
        // 3. DETEKSI ERROR 401/403 (Token Basi/Salah)
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
             alert("Sesi Anda telah berakhir. Silakan login kembali.");
             logout(); // Hapus token & redirect ke login
        } else {
             setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [token, authLoading, navigate, logout]);

  // --- FUNGSI HAPUS PROJECT ---
  const handleDelete = async (projectId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus proyek ini secara permanen?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update State: Hapus kartu project dari layar tanpa refresh
      setProfile(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      }));

      alert("Proyek berhasil dihapus.");
    } catch (err) {
      alert("Gagal menghapus: " + (err.response?.data?.message || "Error"));
    }
  };

  // --- TAMPILAN LOADING ---
  if (authLoading || loading) return <div className="container" style={{paddingTop: 50, textAlign:'center'}}>Memuat data...</div>;
  if (!profile) return <div className="container" style={{paddingTop: 50, textAlign:'center'}}>Gagal memuat profil.</div>;

  // --- TAMPILAN UTAMA ---
  return (
    <div className="container" style={{ marginTop: '40px' }}>
      
      {/* Layout Grid: Kiri (User), Kanan (Projects) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px',
        alignItems: 'start'
      }}>

        {/* BAGIAN 1: KARTU PROFIL (SIDEBAR) */}
        <div className="card" style={{ padding: '30px', textAlign: 'center', position: 'sticky', top: '100px' }}>
          <div style={{ 
            width: '100px', height: '100px', margin: '0 auto 20px', 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', 
            color: 'white', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '3rem', fontWeight: 'bold' 
          }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{profile.name}</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>{profile.email}</p>
          
          <div style={{ display: 'inline-block', padding: '5px 15px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>
            Role: {profile.role}
          </div>

          <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
             <div>
                <strong style={{ fontSize: '1.25rem', display: 'block' }}>{profile.projects.length}</strong>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Project</span>
             </div>
          </div>

          <button onClick={logout} className="btn-logout" style={{ marginTop: 20, width: '100%' }}>
            Keluar (Logout)
          </button>
        </div>


        {/* BAGIAN 2: DAFTAR PROJECT (GRID) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Proyek Saya</h2>
            <Link to="/create" className="btn btn-primary" style={{ fontSize: '0.9rem', textDecoration:'none', color:'white' }}>
              + Tambah Baru
            </Link>
          </div>

          {profile.projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', marginBottom: '15px' }}>Anda belum mengupload proyek apapun.</p>
              <Link to="/create" className="btn btn-primary" style={{textDecoration:'none', color:'white'}}>Mulai Upload Sekarang</Link>
            </div>
          ) : (
            <div className="card-grid">
              {profile.projects.map(proj => (
                <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Gambar */}
                  <div style={{ height: '160px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    <img 
                      src={`http://localhost:3000${proj.schematicUrl}`} 
                      alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { 
                        e.target.onerror = null; // Mencegah loop jika gambar lokal juga hilang
                        e.target.src = '/no-image.png'; // Mengambil dari folder client/public
                    }}
                    />
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      👁️ {proj.views}
                    </div>
                  </div>

                  {/* Konten */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.4' }}>
                      <Link to={`/project/${proj.id}`} style={{ textDecoration: 'none', color: '#1e293b' }}>
                        {proj.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px', flex: 1 }}>
                        Dibuat: {new Date(proj.createdAt).toLocaleDateString()}
                    </p>

                    {/* Tombol Aksi (Edit & Delete) */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        to={`/edit/${proj.id}`} 
                        className="btn btn-warning" 
                        style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', textDecoration: 'none' }}
                      >
                        ✏️ Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(proj.id)} 
                        className="btn btn-danger" 
                        style={{ flex: 1, fontSize: '0.875rem' }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;