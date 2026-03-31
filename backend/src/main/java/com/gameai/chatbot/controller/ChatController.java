package com.gameai.chatbot.controller;

import org.springframework.web.bind.annotation.RestController;

import com.gameai.chatbot.service.ChatService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> req) {

        Long userId = Long.parseLong(req.get("userId"));
        String question = req.get("question");

        String answer = chatService.ask(userId, question);

        return Map.of("answer", answer);
    }
}
