package com.gameai.chatbot.service;

import com.gameai.chatbot.entity.ChatGroup;
import com.gameai.chatbot.repository.ChatGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatGroupService {
    
    @Autowired
    private ChatGroupRepository chatGroupRepository;
    
    @Transactional
    public ChatGroup createChatGroup(ChatGroup chatGroup) {
        return chatGroupRepository.save(chatGroup);
    }
    
    @Transactional(readOnly = true)
    public ChatGroup getChatGroupById(Long id) {
        return chatGroupRepository.findById(id).orElse(null);
    }
    
    @Transactional(readOnly = true)
    public List<ChatGroup> getAllChatGroups() {
        return chatGroupRepository.findAll();
    }
    
    @Transactional
    public void deleteChatGroup(Long id) {
        chatGroupRepository.deleteById(id);
    }
}
