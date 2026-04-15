package com.example.project1.dao;

import com.example.project1.entity.Video;
import com.example.project1.mapper.VideoMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class VideoDAO {

    private final VideoMapper videoMapper;

    public VideoDAO(VideoMapper videoMapper) {
        this.videoMapper = videoMapper;
    }

    // 영상 목록 최신순 조회
    public List<Video> selectAllVideos() {
        return videoMapper.findAll();
    }

    // 영상 상세 정보 조회
    public Video selectVideoById(Long id) {
        return videoMapper.findById(id);
    }

    // 신규 영상 등록
    public int insertVideo(Video video) {
        return videoMapper.insertVideo(video);
    }

    // 영상 삭제 (Soft Delete)
    public int deleteVideo(Long id) {
        return videoMapper.deleteVideo(id);
    }

    // 조회수 증가 로직
    public void updateViewCount(Long id) {
        videoMapper.incrementViewCount(id);
    }
    
    // 검색 결과 조회
    public List<Video> selectVideosByKeyword(String keyword) {
        return videoMapper.searchVideos(keyword);
    }

    // 특정 유저의 영상만 조회 (마이페이지용)
    public List<Video> selectVideosByUserId(Long userId) {
        return videoMapper.findByUserId(userId);
    }
    
}