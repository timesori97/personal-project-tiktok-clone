import React, { useState, useEffect, useRef, useCallback } from 'react'; // 💡 useCallback 추가
import axiosInstance from '../api/axiosInstance';
import '../styles/CommentsModal.css';

const CommentsModal = ({ videoId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const userId = localStorage.getItem('userId');
  const scrollRef = useRef(null);

  // 💡 useCallback으로 감싸서 함수를 메모이제이션합니다. (ESLint 경고 해결 포인트)
  const fetchComments = useCallback(async () => {
    if (!videoId) return;
    try {
      const res = await axiosInstance.get(`/interactions/comments/${videoId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("댓글 로드 실패", err);
    }
  }, [videoId]); // videoId가 변경될 때만 함수가 새로 생성됨

  // 💡 이제 fetchComments를 의존성 배열에 넣어도 안전합니다.
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  const handleSend = async () => {
    if (!newComment.trim() || !userId) return;
    try {
      await axiosInstance.post(`/interactions/comments/${videoId}`, { 
        userId: Number(userId), 
        content: newComment 
      });
      setNewComment("");
      fetchComments(); // 작성 후 다시 불러오기
    } catch (err) {
      alert("댓글 작성 실패");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-modal-overlay" onClick={onClose}>
      <div className="comment-modal-container" onClick={e => e.stopPropagation()}>
        
        {/* 💡 헤더: 틱톡 스타일 제목과 닫기 버튼 */}
        <div className="comment-modal-header">
          <span className="comment-count">{comments.length}개의 댓글</span>
          <button className="comment-close-x" onClick={onClose}>&times;</button>
        </div>

        {/* 💡 댓글 리스트 영역 */}
        <div className="comment-scroll-area" ref={scrollRef}>
          {comments.map((c, i) => (
            <div key={i} className="tiktok-comment-item">
              <div className="comment-avatar">
                {/* 프로필 이미지가 없으면 기본 아이콘 */}
                {c.profileImage ? <img src={c.profileImage} alt="p" /> : "👤"}
              </div>
              <div className="comment-content-box">
                <span className="comment-author">@{c.username}</span>
                <p className="comment-text-main">{c.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="empty-comment">첫 댓글을 남겨보세요!</div>
          )}
        </div>

        {/* 💡 하단 고정 입력창: 틱톡 스타일 */}
        <div className="comment-input-wrapper">
          <input 
            className="tiktok-input"
            value={newComment} 
            onChange={e => setNewComment(e.target.value)} 
            placeholder="댓글 추가..." 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
          />
          <button 
            className={`comment-post-btn ${newComment.trim() ? 'active' : ''}`}
            onClick={handleSend} 
            disabled={!newComment.trim()}
          >
            게시
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;