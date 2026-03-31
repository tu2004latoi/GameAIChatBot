package com.gameai.chatbot.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "knowledge")
@Data
public class Knowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;   // tên game

    @Column(columnDefinition = "TEXT")
    private String content;

    private String genre;   // FPS, MOBA...

    private String difficulty; // Easy, Medium, Hard

    private String platform;   // PC, Mobile

    private LocalDateTime createdAt = LocalDateTime.now();
}
