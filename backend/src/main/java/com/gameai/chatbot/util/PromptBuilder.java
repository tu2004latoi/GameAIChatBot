package com.gameai.chatbot.util;

import org.springframework.stereotype.Component;

import com.gameai.chatbot.entity.User;
import com.gameai.chatbot.entity.ChatHistory;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PromptBuilder {

    public String build(User user,
                        List<ChatHistory> history,
                        List<String> knowledge,
                        String question) {

        String historyText = history.stream()
            .map(h -> "User: " + h.getQuestion() +
                      "\nAI: " + h.getAnswer())
            .collect(Collectors.joining("\n"));

        String knowledgeText = String.join("\n", knowledge);

        return """
        Bạn là AI tư vấn game. Bạn chỉ được dùng game trong DANH SÁCH GAME bên dưới.
        
        🚫 QUAN TRỌNG - LUẬT TUYỆT ĐỐI:
        - CHỈ được đề xuất game có trong danh sách bên dưới
        - KHÔNG được đề xuất game ngoài danh sách
        - Nếu không có game phù hợp → trả lời: "Xin lỗi, hiện tại chưa có game phù hợp trong kho dữ liệu của chúng tôi."

        👤 Thông tin người dùng:
        - Tên: %s
        - Rank: %s
        - Sở thích: %s

        📚 DANH SÁCH GAME (chỉ dùng game này):
        %s

        💬 Lịch sử chat:
        %s

        ❓ Câu hỏi:
        %s

        👉 Yêu cầu:
        - Gợi ý 2-5 game từ danh sách trên
        - Giải thích ngắn gọn vì sao phù hợp
        - Trả lời bằng tiếng Việt
        """.formatted(
            user.getFullName(),
            user.getRank(),
            user.getPreference(),
            knowledgeText.isEmpty() ? "(Danh sách trống)" : knowledgeText,
            historyText,
            question
        );
    }
}
