package com.example.edutrack.controller;

import com.example.edutrack.dto.AssessmentDto;
import com.example.edutrack.service.AssessmentService;
import com.example.edutrack.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class AssessmentController {
    private final AssessmentService assessmentService;
    private final CourseService courseService;

    public AssessmentController(AssessmentService assessmentService, CourseService courseService){
        this.assessmentService = assessmentService;
        this.courseService = courseService;
    }

    @PostMapping("/generate-assessment")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> generateAssessment(@RequestBody Map<String, String> request){
        String email = request.get("email");
//        System.out.println(email);

        List<Map<String, Object>> questions = assessmentService.generateAssessment(email);
        return ResponseEntity.ok(Map.of("questions", questions));
    }

    @PostMapping("/save-assessment")
    public ResponseEntity<?> saveAssessment(@RequestBody AssessmentDto dto){
        try {
//            System.out.println(dto);
            assessmentService.saveAssessment(dto);

            new Thread(() -> {
                try{
                    courseService.generateCourse(dto.getEmail());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Assessment saved"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
