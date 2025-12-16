import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({ title: '', description: '', githubUrl: '' });
  const [file, setFile] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil daftar komponen untuk checkbox
    // Pastikan route ini benar dan public (atau tambahkan header auth jika protected)
    axios.get('http://localhost:3000/api/projects/components') 
      .then(res => {
          // Sesuaikan struktur response: res.data.data atau res.data
          const data = res.data.data || res.data; 
          setAvailableComponents(data);
          setLoading(false);
      })
      .catch(err => {
          console.error("Gagal ambil komponen", err);
          setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (compId) => {
    // Pastikan ID berupa number agar cocok dengan backend
    const id = parseInt(compId); 
    if (selectedComponents.includes(id)) {
      setSelectedComponents(selectedComponents.filter(item => item !== id));
    } else {
      setSelectedComponents([...selectedComponents, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
        alert("Anda harus login terlebih dahulu");
        return navigate('/login');
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('githubUrl', formData.githubUrl);
    
    // Pastikan nama field 'schematic' SAMA dengan di backend: upload.single('schematic')
    if (file) {
        data.append('schematic', file);
    } else {
        alert("Mohon upload gambar skema!");
        return;
    }

    // Kirim array ID sebagai string "1,2,3" agar mudah diparsing middleware backend
    if (selectedComponents.length > 0) {
        data.append('componentIds', selectedComponents.join(','));
    }

    try {
      // DEBUG: Cek isi FormData di console sebelum dikirim
      // for (let pair of data.entries()) { console.log(pair[0]+ ', ' + pair[1]); }

      await axios.post('http://localhost:3000/api/projects', data, {
        headers: { 
            // PENTING: Jangan set Content-Type manual untuk FormData!
            // Biarkan Axios yang mengaturnya otomatis (termasuk boundary).
            'Authorization': `Bearer ${token}` 
        }
      });
      
      alert('Proyek berhasil diupload!');
      navigate('/');
      
    } catch (err) {
      console.error("Error Detail:", err.response); // Lihat console untuk detail error
      const msg = err.response?.data?.message || err.message || "Gagal upload";
      alert('Gagal upload: ' + msg);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px', maxWidth: '800px' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '10px' }}>Upload Proyek Baru</h2>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Bagikan inovasi IoT Anda kepada dunia.</p>

        <form onSubmit={handleSubmit}>
          
          {/* JUDUL */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Judul Proyek</label>
            <input 
                type="text" required placeholder="Contoh: Smart Garden System"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          {/* GITHUB */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Link Repository (GitHub)</label>
            <input 
                type="url" required placeholder="https://github.com/username/repo"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
            />
          </div>

          {/* DESKRIPSI */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Deskripsi Lengkap</label>
            <textarea 
                required rows="6" placeholder="Jelaskan cara kerja alat, fitur, dan tujuannya..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontFamily: 'inherit' }}
                onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* GAMBAR */}
          <div style={{ marginBottom: '25px' }}>
             <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Foto / Skema Rangkaian</label>
             <input 
                type="file" 
                accept="image/*" // Filter hanya gambar di window explorer
                required 
                onChange={e => setFile(e.target.files[0])} 
                style={{ fontSize: '1rem' }} 
             />
             <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '5px' }}>Format: JPG, PNG. Maks 5MB.</p>
          </div>

          {/* PILIH KOMPONEN */}
          <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px', color: '#334155' }}>Komponen Utama:</label>
            
            {loading ? <p>Memuat daftar komponen...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                    {availableComponents.length > 0 ? availableComponents.map(comp => (
                    <label key={comp.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <input 
                        type="checkbox" 
                        value={comp.id}
                        checked={selectedComponents.includes(comp.id)}
                        onChange={() => handleCheckboxChange(comp.id)}
                        style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: '#2563eb' }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>{comp.name}</span>
                    </label>
                    )) : <p>Tidak ada komponen tersedia.</p>}
                </div>
            )}
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '15px' }}>
                *Pilih komponen yang wajib ada di proyek ini.
            </p>
          </div>

          {/* TOMBOL SUBMIT */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
            🚀 Publikasikan Proyek
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateProject;