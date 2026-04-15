package com.example.project1.controller;

import com.example.project1.mapper.InteractionMapper;
import com.example.project1.entity.Video;
import com.example.project1.entity.VideoComment;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InteractionController {
    private final InteractionMapper mapper;

    // 1. 좋아요 토글 (확실한 파라미터 명시)
    @PostMapping("/like/{videoId}")
    public int toggleLike(
            @PathVariable("videoId") Long videoId, 
            @RequestParam("userId") Long userId) {
        System.out.println("좋아요 요청 - Video: " + videoId + ", User: " + userId);
        
        if (mapper.checkLiked(userId, videoId) > 0) {
            mapper.deleteLike(userId, videoId);
            return 0; // 취소됨
        }
        mapper.insertLike(userId, videoId);
        return 1; // 성공함
    }

    // 2. 좋아요/북마크 상태 조회
    @GetMapping("/like/status")
    public Map<String, Object> getLikeStatus(
            @RequestParam("videoId") Long videoId, 
            @RequestParam(value = "userId", required = false) Long userId) {
        
        int count = mapper.countLikes(videoId);
        boolean isLiked = (userId != null) && (mapper.checkLiked(userId, videoId) > 0);
        boolean isBookmarked = (userId != null) && (mapper.checkBookmarked(userId, videoId) > 0);
        
        return Map.of("count", count, "isLiked", isLiked, "isBookmarked", isBookmarked);
    }

    // 3. 북마크 토글
    @PostMapping("/bookmark/{videoId}")
    public int toggleBookmark(
            @PathVariable("videoId") Long videoId, 
            @RequestParam("userId") Long userId) {
        System.out.println("북마크 요청 - Video: " + videoId + ", User: " + userId);
        
        if (mapper.checkBookmarked(userId, videoId) > 0) {
            mapper.deleteBookmark(userId, videoId);
            return 0; // 취소됨
        }
        mapper.insertBookmark(userId, videoId);
        return 1; // 성공함
    }

    // 4. 북마크 목록 조회
    @GetMapping("/bookmarks/{userId}")
    public List<Video> getBookmarks(@PathVariable("userId") Long userId) {
        return mapper.getBookmarkedVideos(userId);
    }

    // 5. 팔로우 토글
    @PostMapping("/follow/{followingId}")
    public int toggleFollow(
            @PathVariable("followingId") Long followingId, 
            @RequestParam("followerId") Long followerId) {
        if (mapper.checkFollow(followerId, followingId) > 0) {
            mapper.deleteFollow(followerId, followingId);
            return 0;
        }
        mapper.insertFollow(followerId, followingId);
        return 1;
    }

    // 6. 팔로워/팔로잉 숫자 조회
    @GetMapping("/stats/{userId}")
    public Map<String, Integer> getUserStats(@PathVariable("userId") Long userId) {
        return Map.of(
            "followers", mapper.countFollowers(userId),
            "following", mapper.countFollowing(userId)
        );
    }

    // 7. 총 받은 좋아요 수 (프로필용)
    @GetMapping("/total-likes/{userId}")
    public int getTotalLikes(@PathVariable("userId") Long userId) {
        return mapper.getTotalLikesReceived(userId);
    }

    // 8. 댓글 목록 조회
    @GetMapping("/comments/{videoId}")
    public List<VideoComment> getComments(@PathVariable("videoId") Long videoId) {
        return mapper.getComments(videoId);
    }

    // 9. 댓글 추가
    @PostMapping("/comments/{videoId}")
    public void addComment(@PathVariable("videoId") Long videoId, @RequestBody Map<String, Object> body) {
        mapper.insertComment(
            Long.valueOf(body.get("userId").toString()), 
            videoId, 
            body.get("content").toString()
        );
    }

    // 10. 신고 접수 (Body 데이터 처리 방식 통일)
    @PostMapping("/report")
    public void report(@RequestBody Map<String, Object> body) {
        try {
            mapper.insertReport(
                Long.valueOf(body.get("reporterId").toString()),
                body.get("targetType").toString(),
                Long.valueOf(body.get("targetId").toString()),
                body.get("reason").toString()
            );
            System.out.println("신고 접수 성공: " + body.get("targetId"));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 처리 중 서버 에러");
        }
    }
}