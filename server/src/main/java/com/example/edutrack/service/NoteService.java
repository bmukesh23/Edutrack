package com.example.edutrack.service;

import com.example.edutrack.dto.NoteDto;
import com.example.edutrack.dto.TopicDto;
import com.example.edutrack.model.Chapter;
import com.example.edutrack.model.Note;
import com.example.edutrack.model.Topic;
import com.example.edutrack.repo.ChapterRepository;
import com.example.edutrack.repo.NoteRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NoteService {

    @Value("${youtube.api.key}")
    private String youtubeApiKey;

    @Value("${youtube.search.url}")
    private String youtubeSearchUrl;

    private final ChapterRepository chapterRepo;
    private final NoteRepository noteRepo;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NoteService(ChapterRepository chapterRepo, NoteRepository noteRepo, GeminiService geminiService) {
        this.chapterRepo = chapterRepo;
        this.noteRepo = noteRepo;
        this.geminiService = geminiService;
    }

    @Async
    public CompletableFuture<List<NoteDto>> generateNotes(Long courseId) {
        List<Chapter> chapters = chapterRepo.findByCourseId(courseId);
        List<NoteDto> results = new ArrayList<>();

        for (Chapter chapter : chapters) {
            try {
                NoteDto noteDto = generateNoteForChapter(chapter);
                results.add(noteDto);
            } catch (Exception e) {
                System.err.println("Error generating notes for chapter: " + chapter.getChapterTitle() + " -> " + e.getMessage());
            }
        }

        return CompletableFuture.completedFuture(results);
    }

    public List<NoteDto> generateNotesSync(Long courseId) {
        try {
            return generateNotes(courseId).get(); // blocking version
        } catch (Exception e) {
            throw new RuntimeException("Note generation failed: " + e.getMessage());
        }
    }

    private NoteDto generateNoteForChapter(Chapter chapter) throws Exception {
        String prompt = String.format(
                "Generate study notes in clean JSON format for the chapter titled '%s' with the following summary: '%s'. " +
                        "The JSON should contain a 'topics' array. Each topic must include: " +
                        "'topic_title' (string), 'key_points' (array of 3–5 concise bullet points), and 'notes' (detailed explanation). " +
                        "Do not include any extra text before or after the JSON object.",
                chapter.getChapterTitle(), chapter.getChapterSummary()
        );

        String response = geminiService.generateResponse(prompt);
        String json = extractJson(response);

        JsonNode root = objectMapper.readTree(json);
        JsonNode topicsNode = root.get("topics");

        List<Topic> topicList = new ArrayList<>();
        List<TopicDto> topicDtos = new ArrayList<>();

        for (JsonNode topicNode : topicsNode) {
            String title = topicNode.get("topic_title").asText();
            List<String> points = new ArrayList<>();
            topicNode.get("key_points").forEach(p -> points.add(p.asText()));
            String notes = topicNode.get("notes").asText();

            Topic topic = new Topic();
            topic.setTopic_title(title);
            topic.setKey_points(points);
            topic.setNotes(notes);
            topicList.add(topic);

            TopicDto dto = new TopicDto();
            dto.setTopic_title(title);
            dto.setKey_points(points);
            dto.setNotes(notes);
            topicDtos.add(dto);
        }

        String videoUrl = searchYoutubeVideo(chapter.getChapterTitle());

        Note note = new Note();
        note.setChapter(chapter);
        note.setChapter_title(chapter.getChapterTitle());
        note.setChapter_summary(chapter.getChapterSummary());
        note.setVideo(videoUrl);
        note.setTopics(topicList);
        topicList.forEach(t -> t.setNote(note));

        noteRepo.save(note);

        NoteDto result = new NoteDto();
        result.setChapter_title(chapter.getChapterTitle());
        result.setChapter_summary(chapter.getChapterSummary());
        result.setVideo(videoUrl);
        result.setTopics(topicDtos);

        return result;
    }

    public List<NoteDto> getNotes(Long courseId) {
        List<Chapter> chapters = chapterRepo.findByCourseId(courseId);
        List<NoteDto> result = new ArrayList<>();

        for (Chapter chapter : chapters) {
            Note note = noteRepo.findByChapter(chapter).orElse(null);
            if (note == null) continue;

            List<TopicDto> topicDtos = new ArrayList<>();
            for (Topic topic : note.getTopics()) {
                TopicDto dto = new TopicDto();
                dto.setTopic_title(topic.getTopic_title());
                dto.setKey_points(topic.getKey_points());
                dto.setNotes(topic.getNotes());
                topicDtos.add(dto);
            }

            NoteDto dto = new NoteDto();
            dto.setChapter_title(note.getChapter_title());
            dto.setChapter_summary(note.getChapter_summary());
            dto.setVideo(note.getVideo());
            dto.setTopics(topicDtos);

            result.add(dto);
        }

        return result;
    }

    private String extractJson(String text) {
        Pattern pattern = Pattern.compile("\\{.*}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group() : "{}";
    }

    private String searchYoutubeVideo(String query) {
        String url = youtubeSearchUrl + "?part=snippet&q=" + query + "&key=" + youtubeApiKey + "&maxResults=1&type=video";
        RestTemplate restTemplate = new RestTemplate();
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            return "https://www.youtube.com/watch?v=" + response.get("items").get(0).get("id").get("videoId").asText();
        } catch (Exception e) {
            return null;
        }
    }
}