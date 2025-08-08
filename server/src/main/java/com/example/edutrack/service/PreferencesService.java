package com.example.edutrack.service;

import com.example.edutrack.dto.PreferencesDto;
import com.example.edutrack.model.Preferences;
import com.example.edutrack.model.User;
import com.example.edutrack.repo.PreferencesRepository;
import com.example.edutrack.repo.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PreferencesService {
    private final UserRepository userRepo;
    private final PreferencesRepository preferencesRepo;

    public PreferencesService(UserRepository userRepo, PreferencesRepository preferencesRepo ){
        this.userRepo = userRepo;
        this.preferencesRepo = preferencesRepo;
    }

    public void savePreferences(String email, PreferencesDto request){
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Preferences preferences = user.getPreferences();
        if(preferences == null){
            preferences = new Preferences();
            preferences.setUser(user);
        }

        preferences.setSubjects(request.getSubjects());
        preferences.setSkillLevel(request.getSkillLevel());
        preferences.setLearningGoal(request.getLearningGoal());

        preferencesRepo.save(preferences);
    }
}
