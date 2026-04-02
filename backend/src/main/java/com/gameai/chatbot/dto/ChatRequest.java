package com.gameai.chatbot.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private Long userId;
    private String question;
    private Long chatGroupId;
}
