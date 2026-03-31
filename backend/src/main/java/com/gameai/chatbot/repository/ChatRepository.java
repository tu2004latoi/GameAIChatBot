package com.gameai.chatbot.repository;

import com.gameai.chatbot.entity.ChatHistory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findTop5ByUser_IdOrderByCreatedAtDesc(Long userId);
}
