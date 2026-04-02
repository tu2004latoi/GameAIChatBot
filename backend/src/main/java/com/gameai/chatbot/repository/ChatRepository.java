package com.gameai.chatbot.repository;

import com.gameai.chatbot.entity.ChatHistory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findTop5ByUser_IdOrderByCreatedAtDesc(Long userId);
    
    List<ChatHistory> findByUser_Id(Long userId);
    List<ChatHistory> findByUser_IdOrderByCreatedAtDesc(Long userId);
    List<ChatHistory> findByChatGroup_Id(Long groupId);
    List<ChatHistory> findByChatGroup_IdOrderByCreatedAtDesc(Long groupId);
    long countByUser_Id(Long userId);
}
