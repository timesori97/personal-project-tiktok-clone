package com.example.project1.controller;

import com.example.project1.entity.Video;
import com.example.project1.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class VideoController {

    private final VideoService videoService;

    // 1. 메인 피드: 전체 영상 목록 가져오기
    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        List<Video> videos = videoService.getAllVideos();
        return ResponseEntity.ok(videos);
    }

    // 2. 영상 상세 보기
    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideo(@PathVariable Long id) {
        Video video = videoService.getVideoById(id);
        return video != null ? ResponseEntity.ok(video) : ResponseEntity.notFound().build();
    }

    // 3. 틱톡 영상 업로드 (Form-data 방식)
    @PostMapping("/upload")
    public ResponseEntity<Video> uploadVideo(
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) {
        
        try {
            Video uploadedVideo = videoService.uploadVideo(userId, title, description, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedVideo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 4. 영상 삭제
    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteVideo(@PathVariable("id") Long id) { // 👈 ("id") 추가!
    System.out.println("삭제 요청 도착! ID: " + id);
    videoService.deleteVideo(id);
    return ResponseEntity.ok().build();
}

// 💡 [추가] 5. 검색 기능 (키워드로 영상 찾기)
    @GetMapping("/search")
    public ResponseEntity<List<Video>> searchVideos(@RequestParam("keyword") String keyword) {
        List<Video> results = videoService.searchVideos(keyword);
        return ResponseEntity.ok(results);
    }

    // 💡 [추가] 6. 유저별 영상 조회 (마이페이지용)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Video>> getUserVideos(@PathVariable("userId") Long userId) { // 👈 ("userId") 필수!
    List<Video> userVideos = videoService.getVideosByUserId(userId);
    return ResponseEntity.ok(userVideos);
}
}