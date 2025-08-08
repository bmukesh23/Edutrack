package com.example.edutrack.controller;

import com.example.edutrack.dto.PreferencesDto;
import com.example.edutrack.service.PreferencesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PreferencesController {
    private final PreferencesService preferencesService;

    public PreferencesController(PreferencesService preferencesService){
        this.preferencesService = preferencesService;
    }

    @PostMapping("save-preferences")
    public ResponseEntity<String> savePreferences(@RequestBody PreferencesDto request, @AuthenticationPrincipal String email){
        preferencesService.savePreferences(email, request);
        return ResponseEntity.status(201).body("Preferences saved successfully");
    }
}
