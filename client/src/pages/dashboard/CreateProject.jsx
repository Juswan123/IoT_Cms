import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    authorId: 1 // Hardcode user ID 1 dulu
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Validasi Front-end untuk 2MB
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 2MB.");
      setFile(null);
      e.target.value = null; // Reset input
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gunakan FormData untuk kirim file + text
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('githubUrl', formData.githubUrl);
    data.append('authorId', formData.authorId);
    if (file) {
      data.append('schematic', file);
    }

    try {
      await axios.post('http://localhost:3000/api/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Proyek berhasil diupload!');
      navigate('/'); // Kembali ke dashboard
    } catch (err) {
      console.error(err);
      setError('Gagal upload project.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Upload Proyek IoT Baru</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Judul Proyek:</label><br/>
          <input 
            type="text" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Link GitHub (Code):</label><br/>
          <input 
            type="url" 
            required
            placeholder="https://github.com/username/repo"
            value={formData.githubUrl}
            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Deskripsi:</label><br/>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Upload Skema (Gambar Max 2MB):</label><br/>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white' }}>
          Upload Proyek
        </button>
      </form>
    </div>
  );
};

export default CreateProject;