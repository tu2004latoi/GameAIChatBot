package com.gameai.chatbot.repository;

import com.gameai.chatbot.entity.Knowledge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KnowledgeRepository extends JpaRepository<Knowledge, Long> {
    List<Knowledge> findByGenreIgnoreCase(String genre);
}
