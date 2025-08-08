package com.example.edutrack.dto;

import lombok.Data;

@Data
public class AskAIDto {
    private String question;

    public String getQuestion() {
        return question;
    }
    public void setQuestion(String question) {
        this.question = question;
    }
}
