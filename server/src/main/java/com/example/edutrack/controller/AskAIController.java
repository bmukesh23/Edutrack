package com.example.edutrack.controller;


import com.example.edutrack.dto.AskAIDto;
import com.example.edutrack.service.AskAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AskAIController {
    @Autowired
    private AskAIService aiService;

    @PostMapping("/ask-ai")
    public ResponseEntity<?> askAI(@RequestBody AskAIDto dto){
        try {
            String answer = aiService.askQuestion(dto.getQuestion());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("answer", answer));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
