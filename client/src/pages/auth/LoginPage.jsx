import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Ambil fungsi login dari Context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      // Simpan data user & token ke context
      login(res.data.user, res.data.token);
      
      alert("Login Berhasil!");
      navigate('/'); // Lempar ke Dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Login Gagal");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 15 }}>
          <label>Email:</label>
          <input type="email" required style={{ width: '100%', padding: 8 }} 
             onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Password:</label>
          <input type="password" required style={{ width: '100%', padding: 8 }} 
             onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: 'blue', color: 'white' }}>
          Masuk
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
};

export default LoginPage;