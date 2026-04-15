package com.example.project1.mapper;

import com.example.project1.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User findByUsername(String username);
    User findById(Long id);
    int insertUser(User user);
    int updateUser(User user);
}