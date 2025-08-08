package com.example.edutrack.controller;

import com.example.edutrack.dto.NoteDto;
import com.example.edutrack.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/generate-notes/{id}")
    public ResponseEntity<?> generateNotes(@PathVariable Long id) {
        try {
            CompletableFuture<List<NoteDto>> future = noteService.generateNotes(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Note generation started.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/notes/{id}")
    public ResponseEntity<List<NoteDto>> getNotes(@PathVariable Long id) {
        try {
            List<NoteDto> notes = noteService.getNotes(id);;
            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
