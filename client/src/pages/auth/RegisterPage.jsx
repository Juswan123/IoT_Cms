import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login');
    } catch (err) {
      alert("Gagal Daftar: " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Daftar Akun Baru</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: 10 }}>
          <label>Nama:</label>
          <input type="text" required style={{ width: '100%', padding: 8 }} 
             onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label>
          <input type="email" required style={{ width: '100%', padding: 8 }} 
             onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password:</label>
          <input type="password" required style={{ width: '100%', padding: 8 }} 
             onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: 'green', color: 'white' }}>
          Daftar
        </button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;