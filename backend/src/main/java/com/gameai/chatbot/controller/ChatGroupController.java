package com.gameai.chatbot.controller;

import com.gameai.chatbot.entity.ChatGroup;
import com.gameai.chatbot.service.ChatGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-groups")
public class ChatGroupController {
    @Autowired
    private ChatGroupService chatGroupService;
    
    @PostMapping
    public ChatGroup createChatGroup(@RequestBody ChatGroup chatGroup) {
        return chatGroupService.createChatGroup(chatGroup);
    }
    
    @GetMapping("/{id}")
    public ChatGroup getChatGroup(@PathVariable Long id) {
        return chatGroupService.getChatGroupById(id);
    }
    
    @GetMapping
    public List<ChatGroup> getAllChatGroups() {
        return chatGroupService.getAllChatGroups();
    }
    
    @DeleteMapping("/{id}")
    public void deleteChatGroup(@PathVariable Long id) {
        chatGroupService.deleteChatGroup(id);
    }
}
