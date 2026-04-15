package com.example.project1.service;

import com.example.project1.dao.UserDAO;
import com.example.project1.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void join(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        userDAO.insertUser(user);
    }

    @Override
    public User login(String username, String password) {
    User user = userDAO.selectByUsername(username);
    
    if (user == null) {
        System.out.println("❌ [로그인 실패] 유저를 찾을 수 없음: " + username);
        return null;
    }

    // 💡 디버깅용 로그 추가
    System.out.println("🔍 입력된 비밀번호: " + password);
    System.out.println("🔍 DB에 저장된 해시: " + user.getPassword());

    boolean isMatch = passwordEncoder.matches(password, user.getPassword());
    System.out.println("✅ 일치 여부: " + isMatch);

    if (isMatch) return user;
    return null;
}

    @Override
    public User getUserProfile(Long id) {
        return userDAO.selectById(id);
    }

    // 💡 빌드 에러 해결 포인트: @Override를 붙여서 구현합니다.
    @Override
    public void updateUser(User user) {
        userDAO.updateUser(user);
    }
}