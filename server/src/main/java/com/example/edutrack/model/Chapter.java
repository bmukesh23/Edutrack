package com.example.edutrack.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chapters")
@AllArgsConstructor
@NoArgsConstructor
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chapter_title;

    @Column(length = 5000)
    private String chapter_summary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonBackReference
    private Course course;

    public Long getId() {
        return id;
    }

    public String getChapterTitle() {
        return chapter_title;
    }
    public void setChapterTitle(String title) {
        this.chapter_title = title;
    }

    public String getChapterSummary() {
        return chapter_summary;
    }
    public void setChapterSummary(String summary) {
        this.chapter_summary = summary;
    }

    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;
    }
}