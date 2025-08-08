package com.example.edutrack.repo;

import com.example.edutrack.model.Preferences;
import com.example.edutrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferencesRepository extends JpaRepository<Preferences, Long> {
    Optional<Preferences> findByUser(User user);
}
