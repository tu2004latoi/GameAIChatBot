package com.gameai.chatbot.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = this.getUserByEmail(email);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid email");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + u.getRole()));

        return new CustomUserDetails(u.getId(), u.getEmail(), u.getPassword(), authorities);
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);
        return user.orElse(null);
    }

    @Transactional(readOnly = true)
    public long countUsers() {
        return this.userRepository.count();
    }

    @Transactional(readOnly = true)
    public Page<User> getUsersWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return this.userRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        return user.orElse(null);
    }
}
