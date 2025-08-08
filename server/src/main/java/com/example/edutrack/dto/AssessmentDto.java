package com.example.edutrack.dto;

import lombok.Data;

@Data
public class AssessmentDto {
    private String email;
    private String name;
    private String timestamp;
    private int score;
    private int totalQuestions;

    public String getEmail(){
        return email;
    }

    public String getName() {
        return name;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public int getScore() {
        return score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }
}
