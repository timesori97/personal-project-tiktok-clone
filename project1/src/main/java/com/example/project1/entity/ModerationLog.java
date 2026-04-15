package com.example.project1.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ModerationLog {
    private Long id;
    private Long adminId;
    private String targetType;
    private Long targetId;
    private String actionTaken;
    private String reason;
    private LocalDateTime createdAt;
}