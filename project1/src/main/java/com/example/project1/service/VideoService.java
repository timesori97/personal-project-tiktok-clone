package com.example.project1.service;

import com.example.project1.entity.Video;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface VideoService {
    // 영상 업로드 (파일 저장 + DB 기록)
    Video uploadVideo(Long userId, String title, String description, MultipartFile videoFile);
    
    // 전체 영상 목록 조회
    List<Video> getAllVideos();
    
    // 특정 영상 상세 조회
    Video getVideoById(Long id);
    
    // 영상 삭제 (파일 삭제 + Soft Delete)
    void deleteVideo(Long id);

    // 💡 인터페이스에 추가 (에러 해결 포인트)
    List<Video> searchVideos(String keyword);
    List<Video> getVideosByUserId(Long userId);

}