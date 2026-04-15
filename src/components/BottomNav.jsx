import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = localStorage.getItem('userId');

  const handleNav = (path) => {
    // 업로드와 프로필은 로그인 체크, 홈과 검색은 바로 이동
    if ((path === '/upload' || path === '/profile') && !currentUserId) {
      alert("로그인이 필요합니다.");
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  // 로그인, 회원가입, 관리자 페이지에서는 하단바를 숨김
  if (location.pathname === '/login' || location.pathname === '/join' || location.pathname.startsWith('/admin')) return null;

  return (
    <div style={{ 
      position: 'fixed', bottom: 0, width: '100%', height: '60px', 
      backgroundColor: 'rgba(0, 0, 0, 0.85)', 
      backdropFilter: 'blur(10px)', 
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', 
      borderTop: '0.5px solid #333', zIndex: 1000 
    }}>
      {/* 1. 홈 버튼 */}
      <button 
        onClick={() => handleNav('/')} 
        style={{ background: 'none', color: location.pathname === '/' ? '#fff' : '#888', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
      >
        홈
      </button>

      {/* 💡 2. 검색 버튼 추가 (New!) */}
      <button 
        onClick={() => handleNav('/search')} 
        style={{ 
          background: 'none', 
          color: location.pathname === '/search' ? '#fff' : '#888', 
          border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' 
        }}
      >
        검색
      </button>
      
      {/* 3. 업로드 버튼 (그라데이션 포인트) */}
      <button 
        onClick={() => handleNav('/upload')} 
        style={{ 
          background: 'linear-gradient(45deg, #00f2fe, #4facfe, #fe2c55)', 
          color: 'white', border: 'none', borderRadius: '12px', 
          padding: '8px 20px', fontWeight: '800', cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(254, 44, 85, 0.3)'
        }}
      >
        + 업로드
      </button>
      
      {/* 4. 프로필 버튼 */}
      <button 
        onClick={() => handleNav('/profile')} 
        style={{ background: 'none', color: location.pathname === '/profile' ? '#fff' : '#888', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
      >
        프로필
      </button>
    </div>
  );
};

export default BottomNav;