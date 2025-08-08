package com.example.edutrack.repo;

import com.example.edutrack.model.Chapter;
import com.example.edutrack.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findByChapter(Chapter chapter);
}
