package com.example.edutrack.service;

import com.example.edutrack.FirebaseTokenVerifier;
import com.example.edutrack.dto.UserDto;
import com.example.edutrack.model.User;
import com.example.edutrack.repo.UserRepository;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository repo;
    private final JwtService jwtService;
    private final FirebaseTokenVerifier tokenVerifier;

    public AuthService(UserRepository repo, JwtService jwtService, FirebaseTokenVerifier tokenVerifier) {
        this.repo = repo;
        this.jwtService = jwtService;
        this.tokenVerifier = tokenVerifier;
    }

    public String authenticate(String idToken) {
        try{
            FirebaseToken decodedToken = tokenVerifier.verify(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();
            String photoUrl = decodedToken.getPicture();

            User user = repo.findByEmail(email).orElse(new User());
            user.setName(name);
            user.setEmail(email);
            user.setPhotoUrl(photoUrl);
            repo.save(user);

            return jwtService.generateToken(email);

        } catch (FirebaseAuthException e){
            throw new RuntimeException("Invalid Firebase token", e);
        }
    }

    public UserDto getUserInfo(){
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return repo.findByEmail(email)
                .map(user -> new UserDto(user.getName(), user.getEmail(), user.getPhotoUrl()))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
