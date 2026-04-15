import { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Bookmark, AlertTriangle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import CommentsModal from './CommentsModal';
import '../styles/VideoItem.css';

const VideoItem = ({ video, fetchVideos }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // 브라우저 정책상 음소거로 시작
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  // 1. 영상 상태(좋아요 등) 로드
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axiosInstance.get(`/interactions/like/status?videoId=${video.id}&userId=${currentUserId || ''}`);
        setLikeCount(res.data.count);
        setIsLiked(res.data.isLiked);
        setIsBookmarked(res.data.isBookmarked);
      } catch (err) { console.error("상태 로드 실패", err); }
    };
    fetchStatus();
  }, [video.id, currentUserId]);

  // 2. 자동 재생 로직 (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, { threshold: 0.7 });
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleVideoPress = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.muted = false; // 클릭 시 소리 켬
      setIsMuted(false);
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  // 💡 좋아요 핸들러 (상태 업데이트 포함)
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUserId) return alert("로그인이 필요합니다.");
    try {
      const res = await axiosInstance.post(`/interactions/like/${video.id}?userId=${currentUserId}`);
      setIsLiked(res.data === 1);
      setLikeCount(prev => res.data === 1 ? prev + 1 : prev - 1);
    } catch (err) { console.error(err); }
  };

  // 💡 북마크 핸들러 (상태 업데이트 포함)
  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!currentUserId) return alert("로그인이 필요합니다.");
    try {
      const res = await axiosInstance.post(`/interactions/bookmark/${video.id}?userId=${currentUserId}`);
      setIsBookmarked(res.data === 1);
    } catch (err) { console.error(err); }
  };

  const handleReport = async (e) => {
    e.stopPropagation();
    if (!currentUserId) return alert("로그인이 필요합니다.");
    const reason = window.prompt("신고 사유를 입력해주세요.");
    if (!reason || !reason.trim()) return;
    try {
      await axiosInstance.post('/interactions/report', {
        reporterId: Number(currentUserId),
        targetType: 'VIDEO',
        targetId: Number(video.id),
        reason: reason
      });
      alert("신고가 접수되었습니다.");
    } catch (err) { alert("신고 실패"); }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/videos/${video.id}`);
      if (fetchVideos) fetchVideos();
      else window.location.reload();
    } catch (err) { alert("삭제 실패"); }
  };

  return (
    <div className="video-item-wrapper">
      <video
        ref={videoRef} loop playsInline muted={isMuted} onClick={handleVideoPress}
        src={video.videoUrl} className="full-video-player"
      />
      <div className="video-footer">
        <div className="user-info-row">
          <h3>@{video.writerName || '익명'}</h3>
        </div>
        <p className="video-title">{video.title}</p>
        <p className="video-desc">{video.description}</p>
      </div>

      <div className="video-sidebar">
        <div className="sidebar-btn" onClick={handleLike}>
          <Heart size={35} fill={isLiked ? "#fe2c55" : "none"} color={isLiked ? "#fe2c55" : "white"} />
          <span>{likeCount}</span>
        </div>
        <div className="sidebar-btn" onClick={() => setIsCommentsOpen(true)}>
          <MessageCircle size={35} color="white" />
          <span>댓글</span>
        </div>
        <div className="sidebar-btn" onClick={handleBookmark}>
          <Bookmark size={35} fill={isBookmarked ? "#face15" : "none"} color={isBookmarked ? "#face15" : "white"} />
          <span>저장</span>
        </div>
        <div className="sidebar-btn"><Share2 size={35} color="white" /></div>

        {/* 신고 버튼 */}
        {String(currentUserId) !== String(video.userId) && (
          <div className="sidebar-btn" onClick={handleReport}>
            <AlertTriangle size={32} color="#ffcc00" />
            <span>신고</span>
          </div>
        )}

        {/* 삭제 버튼 */}
        {String(currentUserId) === String(video.userId) && (
          <div className="sidebar-btn" onClick={handleDelete}>
            <Trash2 size={32} color="#ff4444" />
          </div>
        )}
      </div>

      <CommentsModal videoId={video.id} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
    </div>
  );
};

export default VideoItem;