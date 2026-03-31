package com.gameai.chatbot.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.gameai.chatbot.entity.enums.UserRole;
import com.gameai.chatbot.entity.enums.Rank;
import com.gameai.chatbot.entity.enums.Preference;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(name = "`rank`")
    @Enumerated(EnumType.STRING)
    private Rank rank;        // Bronze, Silver, Gold...

    @Enumerated(EnumType.STRING)
    private Preference preference;  // FPS, MOBA...

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    private LocalDateTime createdAt = LocalDateTime.now();

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
