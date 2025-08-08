package com.example.edutrack;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class FirebaseTokenVerifier {

    @PostConstruct
    public void init() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            ClassPathResource resource = new ClassPathResource("firebase/firebase-adminsdk.json");
            String jsonTemplate = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String resolvedJson = replaceEnvVariables(jsonTemplate);

            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(resolvedJson.getBytes(StandardCharsets.UTF_8));

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
        }
    }

    public FirebaseToken verify(String idToken) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().verifyIdToken(idToken);
    }

    private String replaceEnvVariables(String input) {
        for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
            String key = "${" + entry.getKey() + "}";
            input = input.replace(key, entry.getValue());
        }
        return input;
    }
}