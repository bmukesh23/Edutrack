package com.example.edutrack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "topics")
@AllArgsConstructor
@NoArgsConstructor
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic_title;

    @ElementCollection
    @CollectionTable(name = "topic_key_points", joinColumns = @JoinColumn(name = "topic_id"))
    @Column(name = "key_point", length = 1000)
    private List<String> key_points;

    @Column(length = 10000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    public Long getId() {
        return id;
    }

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

    public Note getNote() {
        return note;
    }
    public void setNote(Note note) {
        this.note = note;
    }
}
