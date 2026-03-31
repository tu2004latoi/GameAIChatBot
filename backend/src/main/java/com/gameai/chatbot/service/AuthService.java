package com.gameai.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gameai.chatbot.entity.User;
import com.gameai.chatbot.repository.UserRepository;
import com.gameai.chatbot.entity.enums.Rank;
import com.gameai.chatbot.entity.enums.Preference;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
     public boolean authenticate(String email, String password) {
        Optional<User> u = this.userRepository.findByEmail(email);
        if (u.isPresent()) {
            User user = u.get();
            return passwordEncoder.matches(password, user.getPassword());
        }

        return false;
    }
    
    @Transactional
    public User register(String email, String password, String firstName, String lastName, Rank rank, Preference preference) {
        Optional<User> u = this.userRepository.findByEmail(email);
        if (u.isPresent()) {
            return null;
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRank(rank);
        user.setPreference(preference);
        this.userRepository.save(user);
        
        return user;
    }
}
