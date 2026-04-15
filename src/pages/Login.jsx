import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 요청 데이터:", { username, password });

    try {
      const response = await axiosInstance.post('/users/login', { 
        username: username, 
        password: password 
      });
      
      console.log("서버 응답 데이터:", response.data);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('token', 'dummy-token'); 
      
      alert("로그인 성공!");
      navigate('/'); 
      window.location.reload(); 
    } catch (error) {
      console.error("로그인 에러 상세:", error.response || error);
      if (error.response?.status === 403) {
        alert("보안 정책(403) 차단! CSRF 설정을 확인하세요.");
      } else if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 틀렸습니다.");
      } else {
        alert("로그인 중 서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', 
      height: '100vh', padding: '0 40px', backgroundColor: '#000', color: 'white' 
    }}>
      {/* 로고 영역 (포인트) */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>
          TikTok <span style={{ color: '#fe2c55' }}>Clone</span>
        </h1>
        <p style={{ color: '#8a8a8a', marginTop: '10px', fontSize: '14px' }}>계정에 로그인하세요</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          placeholder="아이디" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ 
            padding: '16px', borderRadius: '4px', border: '1px solid #333', 
            backgroundColor: '#121212', color: 'white', fontSize: '15px' 
          }} 
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
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
          로그인
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p style={{ fontSize: '14px', color: '#8a8a8a' }}>
          계정이 없으신가요? 
          <span 
            onClick={() => navigate('/join')} 
            style={{ color: '#fe2c55', fontWeight: 'bold', marginLeft: '8px', cursor: 'pointer' }}
          >
            가입하기
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;