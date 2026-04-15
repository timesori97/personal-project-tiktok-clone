package com.example.project1.controller;

import com.example.project1.entity.User;
import com.example.project1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody User user) {
        userService.join(user);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> loginData) {
        User user = userService.login(loginData.get("username"), loginData.get("password"));
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.status(401).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getProfile(@PathVariable("id") Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<?> updateProfile(
            @PathVariable("id") Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "bio", defaultValue = "") String bio) {
        
        User user = userService.getUserProfile(id);
        if (user == null) return ResponseEntity.notFound().build();

        // 💡 프로필 이미지 처리
        if (file != null && !file.isEmpty()) {
            // 파일명에 시간을 붙여 중복 및 캐시 방지
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            try {
                File directory = new File("D:/upload/tiktok/");
                if (!directory.exists()) directory.mkdirs(); // 폴더 자동 생성

                file.transferTo(new File(directory, fileName));
                // 💡 DB에 저장할 접근 주소 세팅
                user.setProfileImage("http://localhost:8080/uploads/" + fileName);
            } catch (Exception e) { 
                e.printStackTrace(); 
                return ResponseEntity.status(500).body("이미지 저장 중 오류 발생");
            }
        }

        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        
        user.setBio(bio);
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }
}