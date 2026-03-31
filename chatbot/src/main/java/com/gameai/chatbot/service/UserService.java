package com.gameai.chatbot.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.gameai.chatbot.entity.User;
import com.gameai.chatbot.repository.UserRepository;
import com.gameai.chatbot.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = this.getUserByEmail(email);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid email");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + u.getRole()));

        return new CustomUserDetails(u.getId(), u.getEmail(), u.getPassword(), authorities);
    }

    public User getUserByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }
}
