package com.example.project1.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer duration;
    private Long viewCount;
    private String deletedYn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // JOIN 결과를 담기 위한 필드
    private String writerName; 
    private String writerProfileImage;
}