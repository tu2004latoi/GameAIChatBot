package com.gameai.chatbot.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Collections;

import com.gameai.chatbot.dto.LoginRequest;
import com.gameai.chatbot.dto.RegisterRequest;
import com.gameai.chatbot.entity.User;
import com.gameai.chatbot.service.AuthService;
import com.gameai.chatbot.util.JwtUtils;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest u) {
        if (u.getEmail() == null || u.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email hoặc password không được để trống");
        }

        if (this.authService.authenticate(u.getEmail(), u.getPassword())) {
            try {
                String token = JwtUtils.generateToken(u.getEmail());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest r) {
        if (r.getEmail() == null || r.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email hoặc password không được để trống");
        }
        
        User user = this.authService.register(r.getEmail(), r.getPassword(), r.getFirstName(), r.getLastName(), r.getRank(), r.getPreference());
        if (user != null) {
            return ResponseEntity.ok().body("Đăng ký thành công");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại");
    }
}
