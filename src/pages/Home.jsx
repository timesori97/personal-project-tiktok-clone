import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import VideoItem from '../components/VideoItem';

const Home = () => {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get('/videos');
      setVideos(response.data);
    } catch (error) {
      console.error("비디오를 불러오는데 실패했습니다.", error);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  return (
    <div style={{ 
      height: 'calc(100vh - 60px)', /* 💡 하단바 공간 확보 */
      overflowY: 'scroll', 
      scrollSnapType: 'y mandatory',
      scrollbarWidth: 'none',
      backgroundColor: '#000'
    }}>
      {videos.map((video) => (
        <div key={video.id} style={{ height: '100%', scrollSnapAlign: 'start' }}>
          <VideoItem video={video} fetchVideos={fetchVideos} />
        </div>
      ))}
      {videos.length === 0 && (
        <div style={{ color: '#888', textAlign: 'center', marginTop: '40vh', fontWeight: 'bold' }}>
          첫 영상을 업로드해 보세요!
        </div>
      )}
    </div>
  );
};

export default Home;