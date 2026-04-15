import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Join = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users/join', formData);
      alert("회원가입 완료! 로그인 해주세요.");
      navigate('/login');
    } catch (error) {
      alert("회원가입 실패 (중복된 아이디 또는 이메일)");
    }
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', 
      height: '100vh', padding: '0 40px', backgroundColor: '#000', color: 'white' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900' }}>가입하기</h1>
        <p style={{ color: '#8a8a8a', marginTop: '10px', fontSize: '14px' }}>새로운 크리에이터가 되어보세요</p>
      </div>

      <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          placeholder="사용할 아이디" 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
          required 
          style={{ 
            padding: '16px', borderRadius: '4px', border: '1px solid #333', 
            backgroundColor: '#121212', color: 'white', fontSize: '15px' 
          }} 
        />
        <input 
          type="email" 
          placeholder="이메일 주소" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
          style={{ 
            padding: '16px', borderRadius: '4px', border: '1px solid #333', 
            backgroundColor: '#121212', color: 'white', fontSize: '15px' 
          }} 
        />
        <input 
          type="password" 
          placeholder="비밀번호 설정" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
          style={{ 
            padding: '16px', borderRadius: '4px', border: '1px solid #333', 
            backgroundColor: '#121212', color: 'white', fontSize: '15px' 
          }} 
        />
        <button 
          type="submit" 
          style={{ 
            padding: '16px', borderRadius: '4px', backgroundColor: '#fe2c55', 
            color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer',
            fontSize: '16px', marginTop: '10px'
          }}
        >
          동의하고 가입하기
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <span 
          onClick={() => navigate('/login')} 
          style={{ fontSize: '14px', color: '#8a8a8a', cursor: 'pointer' }}
        >
          이미 계정이 있으신가요? <strong style={{ color: '#fe2c55' }}>로그인</strong>
        </span>
      </div>
    </div>
  );
};

export default Join;