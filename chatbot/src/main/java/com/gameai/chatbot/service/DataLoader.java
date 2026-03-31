package com.gameai.chatbot.service;

import com.gameai.chatbot.entity.Knowledge;
import com.gameai.chatbot.repository.KnowledgeRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class DataLoader {

    @Autowired
    private KnowledgeRepository repo;

    @jakarta.annotation.PostConstruct
    public void loadData() throws Exception {
        // TEMP: Clear and reload all data
        repo.deleteAll();
        System.out.println("Cleared old data...");

        ObjectMapper mapper = new ObjectMapper();

        InputStream is = getClass()
            .getResourceAsStream("/data/games.json");

        if (is == null) {
            System.err.println("games.json not found!");
            return;
        }

        List<Knowledge> list = Arrays.asList(
            mapper.readValue(is, Knowledge[].class)
        );

        repo.saveAll(list);
        System.out.println("Loaded " + list.size() + " games into database");
    }
}