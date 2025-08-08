package com.example.edutrack.service;


import com.example.edutrack.model.Assessment;
import com.example.edutrack.model.Chapter;
import com.example.edutrack.model.Course;
import com.example.edutrack.repo.AssessmentRepository;
import com.example.edutrack.repo.CourseRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CourseService {
    private final CourseRepository courseRepo;
    private final AssessmentRepository assessmentRepo;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CourseService(CourseRepository courseRepo, AssessmentRepository assessmentRepo, GeminiService geminiService) {
        this.courseRepo = courseRepo;
        this.assessmentRepo = assessmentRepo;
        this.geminiService = geminiService;
    }

    public void generateCourse(String email) {
        Assessment latest = assessmentRepo.findFirstByEmailOrderByTimestampDesc(email).orElseThrow(() -> new RuntimeException("No assessments found for user: " + email));

        String subject = latest.getSubject();
        String goal = latest.getLearningGoal();
        int score = latest.getScore();
        int total = latest.getTotalQuestions();

        double scoreRatio = total == 0 ? 0 : (double) score/total;

        String difficulty;
        if (scoreRatio < 0.4) {
            difficulty = "Beginner";
        } else if (scoreRatio < 0.75) {
            difficulty = "Intermediate";
        } else {
            difficulty = "Advanced";
        }

        String prompt = String.format(
                "Generate a study material for %s %s. " +
                        "The level of difficulty should be %s. " +
                        "Provide a summary of the course, a list of chapters with summaries. " +
                        "Format it strictly in JSON with a 'course' object containing 'difficulty', 'category', 'course_title', 'course_summary', and 'chapters' object with 'chapter_title', 'chapter_summary'.",
                subject, goal, difficulty
        );

        String rawResponse = geminiService.generateResponse(prompt);
        String extractedJson = extractJson(rawResponse);
        System.out.println(extractedJson);

        try{
            JsonNode root = objectMapper.readTree(extractedJson);
            JsonNode courseNode = root.get("course");

            Course course = new Course();
            course.setEmail(email);
            course.setDifficulty(difficulty);
            course.setCategory(courseNode.get("category").asText());
            course.setCourseTitle(courseNode.get("course_title").asText());
            course.setCourseSummary(courseNode.get("course_summary").asText());
            course.setTimestamp(java.time.Instant.now().toString());

            JsonNode chapters = courseNode.get("chapters");
            if (chapters != null && chapters.isArray()) {
                course.setTotalLessons(String.valueOf(chapters.size()));
                List<Chapter> chapterList = new ArrayList<>();

                for(JsonNode chapterNode : chapters){
                    Chapter chapter = new Chapter();
                    chapter.setChapterTitle(chapterNode.get("chapter_title").asText());
                    chapter.setChapterSummary(chapterNode.get("chapter_summary").asText());
                    chapter.setCourse(course);
                    chapterList.add(chapter);
                }

                course.setChapters(chapterList);
            } else {
                course.setTotalLessons("0");
            }

            courseRepo.save(course);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String extractJson(String text) {
        Pattern pattern = Pattern.compile("\\{.*}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group() : "{}";
    }

    public List<Course> getCourses(){
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return courseRepo.findByEmail(email);
    }
}
