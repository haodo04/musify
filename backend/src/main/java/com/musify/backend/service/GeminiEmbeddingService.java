package com.musify.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiEmbeddingService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String MODEL = "gemini-embedding-001";
    private static final String BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Double> embed(String text) {
        String url = BASE_URL + MODEL + ":embedContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String escapedText = objectMapper.valueToTree(text).toString();
        String requestBody = """
                {
                  "content": {
                    "parts": [{ "text": %s }]
                  }
                }
                """.formatted(escapedText);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(url, entity, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode valuesNode = root.path("embedding").path("values");

            List<Double> vector = new ArrayList<>();
            valuesNode.forEach(node -> vector.add(node.asDouble()));

            if (vector.isEmpty()) {
                throw new RuntimeException("Gemini tra ve embedding rong");
            }
            return vector;
        } catch (Exception e) {
            throw new RuntimeException("Loi khi goi Gemini Embedding API: " + e.getMessage(), e);
        }
    }
}