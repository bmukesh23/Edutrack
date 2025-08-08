package com.example.edutrack.dto;

import lombok.Data;
import java.util.List;

@Data
public class TopicDto {
    private String topic_title;
    private List<String> key_points;
    private String notes;

    public String getTopic_title() {
        return topic_title;
    }
    public void setTopic_title(String title) {
        this.topic_title = title;
    }

    public List<String> getKey_points() {
        return key_points;
    }
    public void setKey_points(List<String> key_points) {
        this.key_points = key_points;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
