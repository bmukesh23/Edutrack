package com.example.edutrack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "assessments")
@AllArgsConstructor
@NoArgsConstructor
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String name;
    private String subject;
    private String learningGoal;
    private String timestamp;
    private int score;

    @Column(name = "total_questions")
    private int totalQuestions;

    private String getEmail(){
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getLearningGoal() {
        return learningGoal;
    }
    public void setLearningGoal(String learningGoal) {
        this.learningGoal = learningGoal;
    }

    public String getTimeStamp() {
        return timestamp;
    }
    public void setTimeStamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public int getScore() {
        return score;
    }
    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }
    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
}
