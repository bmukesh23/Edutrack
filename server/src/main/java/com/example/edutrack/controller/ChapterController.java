package com.example.edutrack.controller;

import com.example.edutrack.dto.CourseDetailsDto;
import com.example.edutrack.dto.QuizDto;
import com.example.edutrack.service.ChapterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChapterController {
    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<?> getCourseWithChapters(@PathVariable Long id){
       try{
           CourseDetailsDto response = chapterService.getCourseDetails(id);
           return ResponseEntity.ok(response);
       } catch (RuntimeException e) {
           return ResponseEntity.status(404).body("Course not found for ID: " + id);
       }
    }

    @GetMapping("/get-quiz/{id}")
    public ResponseEntity<?> getQuiz(@PathVariable Long id) {
        try {
            QuizDto quiz = chapterService.generateQuiz(id);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating quiz: " + e.getMessage());
        }
    }
}
