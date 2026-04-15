import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoItem from '../components/VideoItem';

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 영상 목록 불러오기 API
  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error("피드 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50vh' }}>로딩 중...</div>;
  if (videos.length === 0) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50vh' }}>첫 영상을 업로드해 보세요!</div>;

  return (
    <div style={{ height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}>
      {videos.map((video) => (
        <div key={video.id} style={{ height: '100%', scrollSnapAlign: 'start' }}>
          <VideoItem video={video} fetchVideos={fetchVideos} />
        </div>
      ))}
    </div>
  );
};

export default Feed;