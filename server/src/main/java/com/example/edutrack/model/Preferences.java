package com.example.edutrack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preferences")
@AllArgsConstructor
@NoArgsConstructor
public class Preferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjects;
    private String skillLevel;
    private String learningGoal;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}
