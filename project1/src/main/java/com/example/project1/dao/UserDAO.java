package com.example.project1.dao;

import com.example.project1.entity.User;
import com.example.project1.mapper.UserMapper;
import lombok.RequiredArgsConstructor; // 💡 추가
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor // 💡 추가
public class UserDAO {

    private final UserMapper userMapper;

    public User selectByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public User selectById(Long id) {
        return userMapper.findById(id);
    }

    public int insertUser(User user) {
        return userMapper.insertUser(user);
    }

    // 💡 빌드 에러 해결 포인트: 매퍼의 updateUser를 호출
    public int updateUser(User user) {
        return userMapper.updateUser(user);
    }
}