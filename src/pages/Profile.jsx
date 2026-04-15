import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/Profile.css';

const Profile = () => {
  const [videos, setVideos] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0, totalLikes: 0 });
  const [userInfo, setUserInfo] = useState({});
  const [tab, setTab] = useState('mine');
  const [isEdit, setIsEdit] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [file, setFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const loadData = async () => {
    try {
      const [v, b, s, u, l] = await Promise.all([
        axiosInstance.get(`/videos/user/${userId}`),
        axiosInstance.get(`/interactions/bookmarks/${userId}`),
        axiosInstance.get(`/interactions/stats/${userId}`),
        axiosInstance.get(`/users/${userId}`),
        axiosInstance.get(`/interactions/total-likes/${userId}`)
      ]);
      setVideos(v.data || []);
      setBookmarks(b.data || []);
      setStats({
        followers: s.data.followers || 0,
        following: s.data.following || 0,
        totalLikes: l.data || 0
      });
      // 💡 여기서 profileImage가 담긴 유저 정보를 가져옵니다.
      setUserInfo(u.data || {});
      setEditBio(u.data.bio || '');
    } catch (err) { console.error("데이터 로드 실패:", err); }
  };

  useEffect(() => { if(userId) loadData(); }, [userId]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('bio', editBio);
    if (editPassword) formData.append('password', editPassword);
    if (file) formData.append('file', file);
    
    try {
      await axiosInstance.post(`/users/${userId}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("프로필 수정 완료!");
      setIsEdit(false);
      setFile(null);
      loadData(); // 💡 DB에서 새로운 profileImage 주소를 다시 받아와 화면 갱신
    } catch (err) { alert("수정 실패"); }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-header-top">
        <span>@{userInfo.username || '로딩중...'}</span>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="profile-logout-btn">로그아웃</button>
      </div>

      <div className="profile-info-section">
        <div className="profile-main-row">
          <div className="profile-avatar-container">
            {/* 💡 userInfo.profileImage 값이 있으면 그 사진을 보여줌 */}
            <img 
              src={userInfo.profileImage || 'https://placehold.co/100/262626/FFFFFF?text=USER'} 
              className="profile-avatar-img" 
              alt="profile" 
            />
          </div>
          <div className="profile-stats-row">
            <div className="stat-item"><strong>{stats.following}</strong> 팔로잉</div>
            <div className="stat-item"><strong>{stats.followers}</strong> 팔로워</div>
            <div className="stat-item"><strong>{stats.totalLikes}</strong> 좋아요</div>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ fontSize: '14px', color: '#ccc', whiteSpace: 'pre-wrap' }}>{userInfo.bio || '자기소개가 없습니다.'}</p>
        </div>

        <button className="edit-profile-btn" onClick={() => setIsEdit(!isEdit)}>
          {isEdit ? "닫기" : "프로필 편집"}
        </button>
        
        {isEdit && (
          <div className="edit-form">
            <label style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>프로필 사진 선택</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            <input type="password" placeholder="새 비밀번호 (선택)" value={editPassword} onChange={e => setEditPassword(e.target.value)} />
            <textarea placeholder="자기소개" value={editBio} onChange={e => setEditBio(e.target.value)} />
            <button onClick={handleUpdate} className="save-btn">저장하기</button>
          </div>
        )}
      </div>

      <div className="profile-tabs">
        <div className={`tab-item ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>▦ 게시물</div>
        <div className={`tab-item ${tab === 'bookmark' ? 'active' : ''}`} onClick={() => setTab('bookmark')}>🔖 저장됨</div>
      </div>

      <div className="profile-video-grid">
        {(tab === 'mine' ? videos : bookmarks).map(v => (
          <div key={v.id} className="grid-video-card" onClick={() => setSelectedVideo(v)}>
            <video src={v.videoUrl} muted preload="metadata" />
          </div>
        ))}
        {(tab === 'mine' ? videos : bookmarks).length === 0 && (
          <p className="no-data-msg">데이터가 없습니다.</p>
        )}
      </div>

      {selectedVideo && (
        <div className="profile-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <video src={selectedVideo.videoUrl} controls autoPlay loop />
            <button className="modal-close-x" onClick={() => setSelectedVideo(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;