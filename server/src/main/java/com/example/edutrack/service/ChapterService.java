package com.example.edutrack.service;


import com.example.edutrack.dto.ChapterDto;
import com.example.edutrack.dto.CourseDetailsDto;
import com.example.edutrack.dto.QuizDto;
import com.example.edutrack.model.Chapter;
import com.example.edutrack.model.Course;
import com.example.edutrack.repo.ChapterRepository;
import com.example.edutrack.repo.CourseRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChapterService {
    private final CourseRepository courseRepo;
    private final ChapterRepository chapterRepo;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChapterService(CourseRepository courseRepo, ChapterRepository chapterRepo, GeminiService geminiService) {
        this.courseRepo = courseRepo;
        this.chapterRepo = chapterRepo;
        this.geminiService = geminiService;
    }

    public CourseDetailsDto getCourseDetails(Long courseId){
        Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        List<Chapter> chapters = chapterRepo.findByCourseId(courseId);

        List<ChapterDto> chapterDtos = chapters.stream().map(ch -> new ChapterDto(
                ch.getChapterTitle(),
                ch.getChapterSummary()
        )).collect(Collectors.toList());

        return new CourseDetailsDto(
                course.getCourseTitle(),
                course.getCourseSummary(),
                course.getTotalLessons(),
                chapterDtos
        );
    }

    public QuizDto generateQuiz(Long courseId) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String prompt = String.format(
                "Generate a quiz based on the following course titled %s. " +
                        "The quiz should have 5-10 multiple-choice questions. " +
                        "Format it strictly in JSON with a 'quiz' object containing 'questions'. " +
                        "Each question must have 'question', 'options', and 'correctAnswer'.",
                course.getCourseTitle()
        );

        String rawResponse = geminiService.generateResponse(prompt);
        String extractedJson = extractJson(rawResponse);

        try {
            JsonNode root = objectMapper.readTree(extractedJson);
            JsonNode questionsNode = root.path("quiz").path("questions");

            List<QuizDto.Question> questions = new ArrayList<>();
            for (JsonNode qNode : questionsNode) {
                QuizDto.Question q = new QuizDto.Question();
                q.setQuestion(qNode.get("question").asText());

                List<String> options = new ArrayList<>();
                for (JsonNode opt : qNode.get("options")) {
                    options.add(opt.asText());
                }

                q.setOptions(options);
                q.setCorrectAnswer(qNode.get("correctAnswer").asText());

                questions.add(q);
            }

            QuizDto quiz = new QuizDto();
            quiz.setQuestions(questions);
            return quiz;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate quiz: " + e.getMessage());
        }
    }

    private String extractJson(String text) {
        Pattern pattern = Pattern.compile("\\{.*}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group() : "{}";
    }
}
