package com.example.project1.mapper;

import com.example.project1.entity.Video;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VideoMapper {
    // 영상 전체 목록 (최신순)
    List<Video> findAll();
    
    // 특정 영상 상세 조회
    Video findById(Long id);
    
    // 영상 업로드
    int insertVideo(Video video);
    
    // 영상 삭제 (Soft Delete)
    int deleteVideo(Long id);
    
    // 조회수 증가
    void incrementViewCount(Long id);

    List<Video> searchVideos(@Param("keyword") String keyword);

    List<Video> findByUserId(@Param("userId") Long userId);
}