package com.example.project1.service;

import com.example.project1.dao.VideoDAO;
import com.example.project1.entity.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoDAO videoDAO;

    // application.properties의 D:/upload/tiktok/ 경로를 가져옴
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    @Transactional
    public Video uploadVideo(Long userId, String title, String description, MultipartFile videoFile) {
        // 1. 파일 검증
        String contentType = java.util.Optional.ofNullable(videoFile.getContentType()).orElse("");
        if (videoFile.isEmpty() || !contentType.startsWith("video/")) {
            throw new RuntimeException("올바른 영상 파일이 아닙니다.");
        }

        // 2. 저장 폴더 생성 및 경로 정규화
        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        // 3. 고유 파일명 생성
        String originalName = videoFile.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalName;
        
        // 4. [수정 포인트] 경로와 파일명 사이에 구분자가 확실히 들어가도록 설정
        // uploadDir 끝에 /가 있든 없든 File 객체가 알아서 경로를 잡아줍니다.
        File saveFile = new File(folder, fileName);

        try {
            // 5. 실제 파일 저장
            videoFile.transferTo(saveFile);

            // 6. DB에 저장할 가상 URL (WebConfig의 /uploads/** 와 매칭)
            String videoUrl = "http://localhost:8080/uploads/" + fileName;
            String thumbnailUrl = "https://placehold.co/150x200/000000/FFFFFF?text=No+Thumbnail";

            Video video = Video.builder()
                    .userId(userId)
                    .title(title)
                    .description(description)
                    .videoUrl(videoUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .duration(60) 
                    .build();

            // 7. Oracle DB 저장
            videoDAO.insertVideo(video);
            return video;

        } catch (Exception e) {
            throw new RuntimeException("영상 업로드 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public List<Video> getAllVideos() {
        return videoDAO.selectAllVideos();
    }

    @Override
    @Transactional
    public Video getVideoById(Long id) {
        videoDAO.updateViewCount(id);
        return videoDAO.selectVideoById(id);
    }

    @Override
    @Transactional
    public void deleteVideo(Long id) {
        Video video = videoDAO.selectVideoById(id);
        if (video != null) {
            videoDAO.deleteVideo(id);
        }
    }

    @Override
public List<Video> searchVideos(String keyword) {
    // Controller -> Service -> DAO -> Mapper 순서 준수
    return videoDAO.selectVideosByKeyword(keyword);
}

@Override
public List<Video> getVideosByUserId(Long userId) {
    return videoDAO.selectVideosByUserId(userId);
}
    
}