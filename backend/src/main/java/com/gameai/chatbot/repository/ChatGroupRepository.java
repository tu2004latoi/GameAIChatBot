package com.gameai.chatbot.repository;

import com.gameai.chatbot.entity.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    
}
