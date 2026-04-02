import { useState, useRef, useEffect } from 'react';
import type { ChatHistory } from '../types/chat';
import type { ChatGroup } from '../types/chat-group';
import type { User } from '../types/user';

interface ChatAreaProps {
  activeGroup: ChatGroup | null;
  messages: ChatHistory[];
  currentUser: User | null;
  onSendMessage: (question: string) => void;
  loading: boolean;
}

const ChatArea = ({ activeGroup, messages, currentUser, onSendMessage, loading }: ChatAreaProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Gaming-themed suggestions
  const suggestions = [
    'Hướng dẫn build tướng Liên Quân',
    'Chiến thuật chơi PUBG Mobile',
    'Cách leo rank nhanh trong Valorant',
    'Review game Elden Ring',
  ];

  if (!activeGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Chọn một Group Chat</h3>
          <p className="text-slate-400 mb-6">Hoặc tạo group mới để bắt đầu trò chuyện với AI</p>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-purple-500/30 rounded-full text-sm text-slate-400 hover:text-purple-400 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full">
      {/* Header */}
      <div className="h-16 border-b border-slate-800/50 flex items-center px-6 bg-slate-900/50 backdrop-blur-sm">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
          <span className="text-white font-bold">{activeGroup.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{activeGroup.name}</h3>
          {activeGroup.description && (
            <p className="text-xs text-slate-400">{activeGroup.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AI Online
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-500/20">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Bắt đầu cuộc trò chuyện</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Hỏi Game AI Assistant bất cứ điều gì về game - chiến thuật, build, review, tips...
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className="space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[70%] space-y-1">
                  <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                    <span>{formatTime(msg.createdAt)}</span>
                    <span className="font-medium text-cyan-400">Bạn</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg shadow-purple-500/10">
                    <p className="text-sm leading-relaxed">{msg.question}</p>
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-[80%] space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-cyan-400">Game AI</span>
                    <span>{formatTime(msg.createdAt)}</span>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/50 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về game... (ví dụ: Build tướng nào mạnh trong Liên Quân?)"
            className="w-full pl-4 pr-14 py-4 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {['Hướng dẫn build', 'Chiến thuật', 'Review game', 'Tips & Tricks'].map((action) => (
            <button
              key={action}
              onClick={() => setInput(action + ': ')}
              className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-purple-500/30 rounded-lg text-xs text-slate-400 hover:text-purple-400 transition-all duration-200 whitespace-nowrap"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
