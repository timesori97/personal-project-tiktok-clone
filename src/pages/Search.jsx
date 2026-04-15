import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import '../styles/Search.css';

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null); // 💡 클릭된 영상 저장용 상태

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim().length > 0) {
      try {
        const res = await axiosInstance.get(`/videos/search?keyword=${value}`);
        setResults(res.data || []);
      } catch (err) {
        console.error("검색 중 오류 발생:", err);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-page">
      <div className="search-input-wrapper">
        <input 
          className="search-input"
          type="text" 
          placeholder="제목이나 설명으로 검색..." 
          value={keyword}
          onChange={handleSearch}
          autoFocus
        />
      </div>

      <div className="search-results-grid">
        {results.map((video) => (
          /* 💡 클릭 시 selectedVideo 상태 업데이트 */
          <div key={video.id} className="search-item" onClick={() => setSelectedVideo(video)}>
            <video 
              src={video.videoUrl} 
              muted 
              playsInline 
              preload="metadata" 
            />
            <div className="search-item-title">
              {video.title}
            </div>
          </div>
        ))}
        {results.length === 0 && keyword.trim() !== "" && (
          <p className="no-results">검색 결과가 없습니다. 😅</p>
        )}
      </div>

      {/* 💡 [신규] 검색 결과 재생 모달 (Profile.jsx와 동일한 로직) */}
      {selectedVideo && (
        <div className="search-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="search-modal-content" onClick={e => e.stopPropagation()}>
            <video src={selectedVideo.videoUrl} controls autoPlay loop />
            <button className="search-modal-close" onClick={() => setSelectedVideo(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;