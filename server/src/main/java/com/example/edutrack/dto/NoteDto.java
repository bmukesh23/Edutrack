package com.example.edutrack.dto;

import lombok.Data;
import java.util.List;

@Data
public class NoteDto {
    private String chapter_title;
    private String chapter_summary;
    private String video;
    private List<TopicDto> topics;

    public String getChapter_title() {
        return chapter_title;
    }
    public void setChapter_title(String chapter_title) {
        this.chapter_title = chapter_title;
    }

    public String getChapter_summary() {
        return chapter_summary;
    }
    public void setChapter_summary(String chapter_summary) {
        this.chapter_summary = chapter_summary;
    }

    public String getVideo() {
        return video;
    }
    public void setVideo(String video) {
        this.video = video;
    }

    public List<TopicDto> getTopics() {
        return topics;
    }
    public void setTopics(List<TopicDto> topics) {
        this.topics = topics;
    }

}
