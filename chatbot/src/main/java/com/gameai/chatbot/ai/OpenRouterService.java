package com.gameai.chatbot.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenRouterService {

    @Value("${openrouter.api-key}")
    private String apiKey;

    @Value("${openrouter.model}")
    private String model;

    private final String URL = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    public String ask(String prompt) {
        System.out.println("Prompt: " + prompt);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // 👇 recommended (optional nhưng nên có)
            headers.set("HTTP-Referer", "http://localhost:8080");
            headers.set("X-Title", "game-ai-chatbot");

            Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                )
            );

            HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                URL,
                request,
                Map.class
            );

            return extract(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return "AI đang bận 😢";
        }
    }

    private String extract(Map body) {

        List choices = (List) body.get("choices");
        if (choices == null || choices.isEmpty()) {
            return "Không có phản hồi";
        }

        Map first = (Map) choices.get(0);
        Map message = (Map) first.get("message");

        return (String) message.get("content");
    }
}