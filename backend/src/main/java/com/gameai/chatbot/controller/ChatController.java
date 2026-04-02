package com.gameai.chatbot.controller;

import org.springframework.web.bind.annotation.RestController;

import com.gameai.chatbot.service.ChatService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import com.gameai.chatbot.dto.ChatRequest;
import com.gameai.chatbot.entity.ChatHistory;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public String chat(@RequestBody ChatRequest req) {

        Long userId = req.getUserId();
        String question = req.getQuestion();
        Long chatGroupId = req.getChatGroupId();

        return chatService.ask(userId, question, chatGroupId);
    }

    @GetMapping("/count")
    public long count(@RequestParam Long userId) {
        return chatService.countChatsByUser(userId);
    }

    @GetMapping("/{id}")
    public ChatHistory getById(@PathVariable Long id) {
        return chatService.getById(id);
    }
    
    @GetMapping("/group/{groupId}")
    public List<ChatHistory> getByGroup(@PathVariable Long groupId) {
        return chatService.getByGroup(groupId);
    }

}
