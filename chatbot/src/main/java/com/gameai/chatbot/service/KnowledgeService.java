package com.gameai.chatbot.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gameai.chatbot.repository.KnowledgeRepository;

@Service
public class KnowledgeService {
    @Autowired
    private KnowledgeRepository repo;

    private static final Map<String, Set<String>> KEYWORD_MAPPING = Map.ofEntries(
        Map.entry("bắn súng", Set.of("fps")),
        Map.entry("súng", Set.of("fps")),
        Map.entry("đối kháng", Set.of("moba", "fighting")),
        Map.entry("thể thao", Set.of("sports")),
        Map.entry("đua xe", Set.of("racing")),
        Map.entry("giải đố", Set.of("puzzle")),
        Map.entry("phiêu lưu", Set.of("adventure")),
        Map.entry("mô phỏng", Set.of("simulation")),
        Map.entry("chiến thuật", Set.of("strategy")),
        Map.entry("hành động", Set.of("action")),
        Map.entry("nhập vai", Set.of("rpg")),
        Map.entry("kinh dị", Set.of("horror")),
        Map.entry("khoa học viễn tưởng", Set.of("scifi")),
        Map.entry("giả tưởng", Set.of("fantasy"))
    );

    public List<String> search(String question) {

        String q = question.toLowerCase();
        Set<String> keywords = expandKeywords(q);

        return repo.findAll().stream()
                .filter(k -> keywords.stream().anyMatch(word -> safe(k.getTitle()).contains(word) ||
                        safe(k.getGenre()).contains(word) ||
                        safe(k.getContent()).contains(word)))
                .map(k -> String.format(
                        "%s (%s): %s - độ khó %s - nền tảng %s",
                        k.getTitle(),
                        k.getGenre(),
                        k.getContent(),
                        k.getDifficulty(),
                        k.getPlatform()))
                .limit(10)
                .toList();
    }

    private Set<String> expandKeywords(String question) {
        Set<String> keywords = new java.util.HashSet<>(List.of(question.split("\\s+")));
        
        // Add mapped synonyms
        for (Map.Entry<String, Set<String>> entry : KEYWORD_MAPPING.entrySet()) {
            if (question.contains(entry.getKey())) {
                keywords.addAll(entry.getValue());
            }
        }
        
        return keywords;
    }

    private String safe(String s) {
        return s == null ? "" : s.toLowerCase();
    }
}