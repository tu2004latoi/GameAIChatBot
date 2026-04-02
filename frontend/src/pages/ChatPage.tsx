import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyUserContext, MyDispatcherContext } from '../services/mycontexts';
import { useToast } from '../components/Toast';
import apis, { authApis, endPoints } from '../services/apis';
import ChatSidebar from '../components/ChatSidebar';
import ChatArea from '../components/ChatArea';
import CreateGroupModal from '../components/CreateGroupModal';
import type { ChatGroup } from '../types/chat-group';
import type { ChatHistory } from '../types/chat';
import type { User } from '../types/user';
import Cookies from 'js-cookie';

const ChatPage = () => {
  const user = useContext(MyUserContext) as User | null;
  const dispatch = useContext(MyDispatcherContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch groups on mount
  useEffect(() => {
    if (!user) return;
    
    const fetchGroups = async () => {
      try {
        const response = await authApis().get(endPoints.chatGroups.list);
        setGroups(response.data || []);
      } catch (err: any) {
        showToast('Không thể tải danh sách group', 'error');
      }
    };
    
    fetchGroups();
  }, [user, showToast]);

  // Fetch messages when active group changes
  useEffect(() => {
    if (!activeGroupId || !user) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        // Using the chat history endpoint by group
        const response = await authApis().get(endPoints.chats.listByGroup(activeGroupId));
        setMessages(response.data || []);
      } catch (err: any) {
        // If endpoint doesn't exist, use empty array
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeGroupId, user]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  const handleCreateGroup = async (name: string, description: string) => {
    try {
      setCreatingGroup(true);
      const response = await authApis().post(endPoints.chatGroups.list, {
        name,
        description,
      });
      
      const newGroup = response.data;
      setGroups(prev => [...prev, newGroup]);
      setActiveGroupId(newGroup.id);
      setIsModalOpen(false);
      showToast('🎉 Group đã được tạo thành công!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Không thể tạo group', 'error');
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm('Bạn có chắc muốn xóa group này? Tất cả tin nhắn sẽ bị xóa.')) return;
    
    try {
      await authApis().delete(endPoints.chatGroups.detail(groupId));
      setGroups(prev => prev.filter(g => g.id !== groupId));
      if (activeGroupId === groupId) {
        setActiveGroupId(null);
        setMessages([]);
      }
      showToast('Đã xóa group', 'success');
    } catch (err: any) {
      showToast('Không thể xóa group', 'error');
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!activeGroupId || !user) return;

    try {
      setLoading(true);
      
      // Call AI chat API
      const chatResponse = await authApis().post(endPoints.chats.send, {
        userId: user.id,
        question,
        chatGroupId: activeGroupId,
      });
      
      const answer = chatResponse.data;
      
      // Add message to local state
      const newMessage: ChatHistory = {
        id: Date.now(), // Temporary ID
        question,
        answer,
        createdAt: new Date().toISOString(),
        user,
        chatGroup: activeGroup || undefined,
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (err: any) {
      showToast('Không thể gửi tin nhắn', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch?.({ type: 'logout', payload: null });
    showToast('👋 Đã đăng xuất thành công!', 'success');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        groups={groups}
        activeGroupId={activeGroupId}
        onSelectGroup={setActiveGroupId}
        onCreateGroup={() => setIsModalOpen(true)}
        onDeleteGroup={handleDeleteGroup}
        currentUser={user}
        onLogout={handleLogout}
      />

      {/* Chat Area */}
      <div className="flex-1 relative">
        <ChatArea
          activeGroup={activeGroup}
          messages={messages}
          currentUser={user}
          onSendMessage={handleSendMessage}
          loading={loading}
        />
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateGroup}
        loading={creatingGroup}
      />
    </div>
  );
};

export default ChatPage;
