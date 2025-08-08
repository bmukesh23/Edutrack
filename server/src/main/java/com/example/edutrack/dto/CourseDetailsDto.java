package com.example.edutrack.dto;

import lombok.Data;

import java.util.List;

@Data
public class CourseDetailsDto {
    private String courseTitle;
    private String courseSummary;
    private String totalLessons;
    private List<ChapterDto> chapters;

    public CourseDetailsDto(String courseTitle, String courseSummary, String totalLessons, List<ChapterDto> chapters) {
        this.courseTitle = courseTitle;
        this.courseSummary = courseSummary;
        this.totalLessons = totalLessons;
        this.chapters = chapters;
    }

    public String getCourseTitle() {
        return courseTitle;
    }
    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseSummary() {
        return courseSummary;
    }
    public void setCourseSummary(String courseSummary) {
        this.courseSummary = courseSummary;
    }

    public String getTotalLessons() {
        return totalLessons;
    }
    public void setTotalLessons(String totalLessons) {
        this.totalLessons = totalLessons;
    }

    public List<ChapterDto> getChapters() {
        return chapters;
    }
    public void setChapters(List<ChapterDto> chapters) {
        this.chapters = chapters;
    }
}
