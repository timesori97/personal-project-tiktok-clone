package com.example.project1.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VideoComment {
    private Long id;
    private Long userId;
    private Long videoId;
    private String content;
    private String deletedYn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String username; // 댓글 작성자 이름 표시용
}