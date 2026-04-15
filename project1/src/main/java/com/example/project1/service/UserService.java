package com.example.project1.service;

import com.example.project1.entity.User;

public interface UserService {
    void join(User user);
    User login(String username, String password);
    User getUserProfile(Long id);
    // 💡 빌드 에러 해결 포인트: 이 선언이 반드시 있어야 합니다.
    void updateUser(User user); 
}