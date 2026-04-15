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
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String profileImage;
    private String bio;
    private String role;      // ROLE_USER, ROLE_ADMIN
    private String deletedYn; // 'Y', 'N'
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}