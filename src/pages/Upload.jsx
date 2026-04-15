import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("영상과 제목은 필수입니다.");

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("로그인이 필요합니다.");
      return navigate('/login');
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      await axiosInstance.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("업로드 성공!");
      navigate('/');
    } catch (error) {
      alert("업로드 실패");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', color: 'white', height: 'calc(100vh - 60px)', backgroundColor: '#000', overflowY: 'auto' }}>
      <h2 style={{ textAlign: 'center', fontWeight: '800', marginBottom: '30px' }}>새 영상 업로드</h2>
      
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
        
        {/* 💡 세련된 점선 업로드 박스 */}
        <div 
          onClick={() => fileInputRef.current.click()} 
          style={{ 
            border: '2px dashed #444', padding: '60px 20px', textAlign: 'center', 
            borderRadius: '16px', cursor: 'pointer', backgroundColor: '#111',
            transition: 'border-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#fe2c55'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#444'}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>☁️</div>
          {file ? <p style={{ color: '#00f2fe', fontWeight: 'bold', margin: 0 }}>{file.name}</p> : <p style={{ color: '#888', margin: 0, fontWeight: 'bold' }}>클릭하여 영상을 선택하세요</p>}
        </div>
        <input type="file" accept="video/*" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
        
        <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: '16px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', fontSize: '15px', outline: 'none' }} 
        />
        <textarea placeholder="설명을 입력하세요 (선택)" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
          style={{ padding: '16px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: 'white', fontSize: '15px', resize: 'none', outline: 'none' }} 
        />
        
        <button type="submit" disabled={isUploading} 
          style={{ 
            padding: '16px', borderRadius: '8px', border: 'none', 
            backgroundColor: isUploading ? '#444' : '#fe2c55', color: 'white', 
            fontWeight: 'bold', fontSize: '16px', cursor: isUploading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}>
          {isUploading ? '업로드 진행 중...' : '게시하기'}
        </button>
      </form>
    </div>
  );
};

export default Upload;