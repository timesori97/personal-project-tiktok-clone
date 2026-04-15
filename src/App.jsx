import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Join from './pages/Join';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  // 현재 로그인한 사용자의 역할을 가져옵니다.
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black', position: 'relative', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          
          {/* 관리자 경로 */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={userRole === 'ROLE_ADMIN' ? <Admin /> : <AdminLogin />} 
          />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;