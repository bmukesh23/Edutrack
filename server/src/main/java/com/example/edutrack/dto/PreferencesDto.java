package com.example.edutrack.dto;

import lombok.Data;

@Data
public class PreferencesDto {
    private String subjects;
    private String skillLevel;
    private String learningGoal;

    public String getSubjects() {
        return subjects;
    }
    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public String getSkillLevel() {
        return skillLevel;
    }
    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public String getLearningGoal() {
        return learningGoal;
    }
    public void setLearningGoal(String learningGoal) {
        this.learningGoal = learningGoal;
    }
}
