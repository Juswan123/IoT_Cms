import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import { AuthContext } from '../../context/AuthContext';

const EditProject = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({ title: '', description: '', githubUrl: '' });
  const [file, setFile] = useState(null); 
  const [previewImage, setPreviewImage] = useState(''); 
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil Data Master Komponen
        const compRes = await axios.get('http://localhost:3000/api/projects/components');
        setAvailableComponents(compRes.data.data || compRes.data);

        // Ambil Data Project
        const projectRes = await axios.get(`http://localhost:3000/api/projects/${id}`);
        const project = projectRes.data.data;

        setFormData({
            title: project.title,
            description: project.description,
            githubUrl: project.githubUrl || ''
        });
        
        if (project.schematicUrl) {
            setPreviewImage(`http://localhost:3000${project.schematicUrl}`);
        }

        if (project.components) {
            const currentIds = project.components.map(c => c.componentId || c.id); 
            setSelectedComponents(currentIds);
        }

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data", err);
        alert("Gagal memuat data project");
        navigate('/'); 
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleCheckboxChange = (compId) => {
    const id = parseInt(compId);
    if (selectedComponents.includes(id)) {
      setSelectedComponents(selectedComponents.filter(item => item !== id));
    } else {
      setSelectedComponents([...selectedComponents, id]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
        setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
        alert("Sesi habis, silakan login kembali");
        return navigate('/login');
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('githubUrl', formData.githubUrl);

    // HANYA kirim file jika user memilih gambar baru
    if (file) {
        data.append('schematic', file);
    }

    // Kirim Components
    if (selectedComponents.length > 0) {
        data.append('componentIds', selectedComponents.join(','));
    } else {
        // Kirim string kosong jika semua dicentang dihapus
        data.append('componentIds', '');
    }

    try {
      await axios.put(`http://localhost:3000/api/projects/${id}`, data, {
        headers: { 
            // Content-Type: multipart/form-data OTOMATIS diurus oleh axios
            'Authorization': `Bearer ${token}` 
        }
      });
      
      alert('Proyek berhasil diperbarui!');
      navigate(`/project/${id}`); // Redirect ke detail
      
    } catch (err) {
      console.error("Error Update:", err.response);
      const msg = err.response?.data?.message || "Gagal mengupdate proyek";
      alert('Error: ' + msg);
    }
  };

  if (loading) return <div className="container" style={{marginTop:'50px'}}>Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px', maxWidth: '800px' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '10px' }}>Edit Proyek</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* JUDUL */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Judul Proyek</label>
            <input 
                type="text" required
                value={formData.title}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          {/* GITHUB */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Link Repository</label>
            <input 
                type="url" required
                value={formData.githubUrl}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
            />
          </div>

          {/* DESKRIPSI */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Deskripsi</label>
            <textarea 
                required rows="6"
                value={formData.description}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* GAMBAR */}
          <div style={{ marginBottom: '25px' }}>
             <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Foto / Skema (Biarkan kosong jika tidak berubah)</label>
             
             {previewImage && (
                 <div style={{ marginBottom: '10px' }}>
                     <img src={previewImage} alt="Preview" style={{ width: '150px', borderRadius: '8px', border: '1px solid #ddd' }} />
                 </div>
             )}

             <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange} 
                style={{ fontSize: '1rem' }} 
             />
          </div>

          {/* PILIH KOMPONEN */}
          <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px' }}>Komponen Utama:</label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
                {availableComponents.map(comp => (
                <label key={comp.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <input 
                    type="checkbox" 
                    value={comp.id}
                    checked={selectedComponents.includes(comp.id)}
                    onChange={() => handleCheckboxChange(comp.id)}
                    style={{ width: '18px', height: '18px', marginRight: '10px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{comp.name}</span>
                </label>
                ))}
            </div>
          </div>

          {/* TOMBOL */}
          <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => navigate(-1)} className="btn" style={{ flex: 1, padding: '15px', background: '#cbd5e1' }}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px' }}>
                💾 Simpan Perubahan
              </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProject;