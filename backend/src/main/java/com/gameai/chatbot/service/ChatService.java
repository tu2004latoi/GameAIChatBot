
package com.gameai.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gameai.chatbot.ai.OpenRouterService;
import com.gameai.chatbot.entity.ChatHistory;
import com.gameai.chatbot.entity.User;
import com.gameai.chatbot.repository.ChatRepository;
import com.gameai.chatbot.repository.UserRepository;
import com.gameai.chatbot.util.PromptBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired private UserRepository userRepo;
    @Autowired private ChatRepository chatRepo;
    @Autowired private KnowledgeService knowledgeService;
    @Autowired private OpenRouterService gemini;
    @Autowired private PromptBuilder promptBuilder;
    @Autowired private ChatGroupService chatGroupService;

    @Transactional
    public String ask(Long userId, String question, Long chatGroupId) {

        // 1. user
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. history
        List<ChatHistory> history =
            chatRepo.findTop5ByUser_IdOrderByCreatedAtDesc(userId);

        // 3. knowledge
        List<String> knowledge =
            knowledgeService.search(question);

        // 4. build prompt
        String prompt = promptBuilder.build(
            user, history, knowledge, question
        );

        // 5. gọi AI
        String answer = gemini.ask(prompt);

        // 6. lưu history
        ChatHistory chat = new ChatHistory();
        chat.setUser(user);
        chat.setQuestion(question);
        chat.setAnswer(answer);
        chat.setChatGroup(chatGroupService.getChatGroupById(chatGroupId));
        chat.setCreatedAt(LocalDateTime.now());

        chatRepo.save(chat);

        return answer;
    }

    @Transactional(readOnly = true)
    public ChatHistory getById(Long id) {
        return chatRepo.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ChatHistory> getChatsByUser(Long userId) {
        return chatRepo.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long countChatsByUser(Long userId) {
        return chatRepo.countByUser_Id(userId);
    }
    
    @Transactional(readOnly = true)
    public List<ChatHistory> getByGroup(Long groupId) {
        return chatRepo.findByChatGroup_IdOrderByCreatedAtDesc(groupId);
    }
}
