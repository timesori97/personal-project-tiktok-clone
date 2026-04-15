package com.example.project1.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Notification {
    private Long id;
    private Long userId;
    private String type;       // LIKE, COMMENT, FOLLOW, SYSTEM
    private Long senderId;
    private Long targetId;
    private String message;
    private String isRead;     // 'Y', 'N'
    private LocalDateTime createdAt;
}