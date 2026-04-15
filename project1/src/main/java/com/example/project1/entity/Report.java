package com.example.project1.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Report {
    private Long id;
    private Long reporterId;
    private String targetType; // USER, VIDEO, COMMENT
    private Long targetId;
    private String reason;
    private String status;     // PENDING, RESOLVED, REJECTED
    private LocalDateTime createdAt;
}