package com.gameai.chatbot.dto;

import lombok.Data;
import com.gameai.chatbot.entity.enums.Rank;
import com.gameai.chatbot.entity.enums.Preference;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Rank rank;
    private Preference preference;
}
