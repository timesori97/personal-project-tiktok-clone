import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/users/login', { username, password });
      if (res.data.role === 'ROLE_ADMIN') {
        localStorage.setItem('role', 'ROLE_ADMIN');
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('username', res.data.username);
        alert("관리자 권한이 확인되었습니다.");
        window.location.href = '/admin'; 
      } else {
        alert("관리자 권한이 없습니다. (현재 권한: " + res.data.role + ")");
      }
    } catch (err) { alert("로그인 실패: 아이디나 비밀번호를 확인하세요."); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#050505', color: 'white' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px', marginBottom: '10px' }}>🛡️ SYSTEM ADMIN</h2>
      <p style={{ color: '#666', marginBottom: '40px', fontSize: '13px' }}>AUTHORIZED PERSONNEL ONLY</p>
      
      <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '320px' }}>
        <input 
          placeholder="Admin ID" 
          onChange={e => setUsername(e.target.value)} 
          style={{ padding: '16px', background: '#111', color: 'white', border: '1px solid #333', borderRadius: '6px', outline: 'none', fontSize: '15px' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
          style={{ padding: '16px', background: '#111', color: 'white', border: '1px solid #333', borderRadius: '6px', outline: 'none', fontSize: '15px' }} 
        />
        <button type="submit" style={{ padding: '16px', background: '#fe2c55', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
          인증 및 접속
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;