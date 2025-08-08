package com.example.edutrack.dto;

import lombok.Data;

@Data
public class ChapterDto {
    private String chapter_title;
    private String chapter_summary;

    public ChapterDto(String chapter_title, String chapter_summary) {
        this.chapter_title = chapter_title;
        this.chapter_summary = chapter_summary;
    }

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
}
