import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/projects/${id}`);
        setProject(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Proyek tidak ditemukan");
        navigate('/');
      }
    };
    fetchProject();
  }, [id, navigate]);

  // Fungsi Hapus (Copas dari Dashboard, biar bisa hapus dari sini juga)
  const handleDelete = async () => {
    if (window.confirm("Yakin ingin menghapus proyek ini secara permanen?")) {
      try {
        await axios.delete(`http://localhost:3000/api/projects/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Proyek berhasil dihapus!");
        navigate('/');
      } catch (err) {
        alert("Gagal hapus: " + (err.response?.data?.message || "Error"));
      }
    }
  };

  if (loading) return <p style={{textAlign:'center', marginTop: 50}}>Memuat detail...</p>;
  if (!project) return null;

  // Cek apakah user adalah pemilik atau admin
  const isOwnerOrAdmin = user && (user.id === project.authorId || user.role === 'ADMIN');

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      
      {/* Header: Tombol Kembali & Judul */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>&larr; Kembali ke Dashboard</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: '2rem' }}>{project.title}</h1>
        
        {/* Tombol Aksi (Edit/Delete) hanya untuk Pemilik/Admin */}
        {isOwnerOrAdmin && (
            <div>
                <Link to={`/edit/${project.id}`} style={{ padding: '8px 15px', background: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px', marginRight: 10, fontWeight: 'bold' }}>
                    Edit
                </Link>
                <button onClick={handleDelete} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Hapus
                </button>
            </div>
        )}
      </div>

      {/* Gambar Besar */}
      <div style={{ width: '100%', height: '400px', background: '#eee', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
        <img 
            src={`http://localhost:3000${project.schematicUrl}`} 
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#333' }}
            onError={(e) => { 
              e.target.onerror = null; // Mencegah loop jika gambar lokal juga hilang
              e.target.src = '/no-image.png'; // Mengambil dari folder client/public
            }}
        />
      </div>

      {/* Info Meta */}
      <div style={{ display: 'flex', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee', color: '#555' }}>
        <span>👤 <strong>Author:</strong> {project.author?.name}</span>
        <span>📅 <strong>Dibuat:</strong> {new Date(project.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Komponen */}
      <div style={{ margin: '20px 0' }}>
        <h3>Komponen yang Digunakan:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {project.components.map(rel => (
                <span key={rel.component.id} style={{ background: '#e0f2fe', color: '#0369a1', padding: '5px 12px', borderRadius: '20px', fontWeight: '500' }}>
                    🔧 {rel.component.name}
                </span>
            ))}
        </div>
      </div>

      {/* Deskripsi & Link */}
      <div style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#333' }}>
        <h3>Deskripsi Proyek:</h3>
        <p style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
      </div>

      {project.githubUrl && (
        <div style={{ marginTop: 30, padding: 20, background: '#f9fafb', borderRadius: 8, textAlign: 'center' }}>
            <p>Tertarik dengan kodenya?</p>
            <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '10px 20px', background: '#24292f', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                Lihat Repository di GitHub
            </a>
        </div>
      )}

    </div>
  );
};

export default ProjectDetail;