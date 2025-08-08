package com.example.edutrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AskAIService {
    @Autowired
    private GeminiService geminiService;

    public String askQuestion(String question){
        String prompt = "You are a helpful AI assistant for an educational platform. "
                        + "Answer this course-related question in 40 words:\n\n"
                        + question;
        return geminiService.generateResponse(prompt);
    }
}
