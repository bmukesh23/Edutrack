package com.example.edutrack.service;

import com.example.edutrack.dto.AssessmentDto;
import com.example.edutrack.model.Assessment;
import com.example.edutrack.model.Preferences;
import com.example.edutrack.model.User;
import com.example.edutrack.repo.AssessmentRepository;
import com.example.edutrack.repo.PreferencesRepository;
import com.example.edutrack.repo.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AssessmentService {
    private final PreferencesRepository prefRepo;
    private final UserRepository userRepo;
    private final GeminiService geminiService;
    private final AssessmentRepository assessmentRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AssessmentService(PreferencesRepository prefRepo, UserRepository userRepo, GeminiService geminiService, AssessmentRepository assessmentRepo) {
        this.prefRepo = prefRepo;
        this.userRepo = userRepo;
        this.assessmentRepo = assessmentRepo;
        this.geminiService = geminiService;
    }

    public List<Map<String, Object>> generateAssessment(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Preferences prefs = prefRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Preferences not found for user: " + email));

        String prompt = String.format(
                "Generate a %s level quiz on the topic: %s with 5-10 multiple-choice questions. " +
                        "Return strict JSON array ONLY with questions. " +
                        "Each object in the array must have 'question', 'answer', and 'options'. " +
                        "DO NOT include any wrapper object like 'quiz' or 'title'.",
                prefs.getSkillLevel(), prefs.getSubjects()
        );

        String rawResponse = geminiService.generateResponse(prompt);
        String extractedJson = extractJson(rawResponse);

        try {
            JsonNode root = objectMapper.readTree(extractedJson);
            if (root.isArray()) {
                List<Map<String, Object>> questions = new ArrayList<>();
                for (JsonNode q : root) {
                    Map<String, Object> questionMap = objectMapper.convertValue(q, Map.class);
                    questions.add(questionMap);
                }
                return questions;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return List.of();
    }

    private String extractJson(String text) {
        Pattern pattern = Pattern.compile("\\[.*]", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group() : "[]";
    }

    public void saveAssessment(AssessmentDto dto) throws Exception{
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + dto.getEmail()));

        Preferences prefs = prefRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Preferences not found for user: " + dto.getEmail()));


        Assessment assessment = new Assessment();
        assessment.setEmail(dto.getEmail());
        assessment.setName(dto.getName());
        assessment.setTimeStamp(dto.getTimestamp());
        assessment.setScore(dto.getScore());
        assessment.setTotalQuestions(dto.getTotalQuestions());
        assessment.setSubject(prefs.getSubjects());
        assessment.setLearningGoal(prefs.getLearningGoal());

        assessmentRepo.save(assessment);
    }
}