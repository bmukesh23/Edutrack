package com.example.edutrack.controller;


import com.example.edutrack.model.Course;
import com.example.edutrack.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/get-courses")
    public ResponseEntity<?> getCourses(){
        List<Course> courses = courseService.getCourses();
        return ResponseEntity.ok(Map.of("courses", courses));
    }
}
