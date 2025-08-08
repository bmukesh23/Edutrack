package com.example.edutrack.controller;

import com.example.edutrack.dto.AuthRequest;
import com.example.edutrack.dto.UserDto;
import com.example.edutrack.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to EduTrack API");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth")
    public ResponseEntity<Map<String, String>> authenticateUser(@RequestBody AuthRequest request){
        String jwtToken = authService.authenticate(request.getIdToken());
        return ResponseEntity.ok(Map.of("token", jwtToken));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getUserInfo(){
        return ResponseEntity.ok(authService.getUserInfo());
    }

}
