package com.example.edutrack.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String idToken;

    public String getIdToken() {
        return idToken;
    }
}
