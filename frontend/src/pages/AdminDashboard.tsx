import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../services/MyContexts.ts';
import { useToast } from '../components/Toast';
import apis, { authApis } from '../services/apis';
import type { User } from '../types/user';
import type { ChatGroup } from '../types/chat-group';
import type { ChatHistory } from '../types/chat';
import Cookies from 'js-cookie';

interface DashboardStats {
  totalUsers: number;
  totalGroups: number;
  totalChats: number;
  todayChats: number;
}

const AdminDashboard = () => {
  const user = useContext(MyUserContext) as User | null;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'groups' | 'chats'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGroups: 0,
    totalChats: 0,
    todayChats: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel
      const [usersRes, groupsRes, chatsRes] = await Promise.all([
        authApis().get('/users'),
        authApis().get('/chat-groups'),
        authApis().get('/chats'),
      ]);

      const usersData = usersRes.data || [];
      const groupsData = groupsRes.data || [];
      const chatsData = chatsRes.data || [];

      setUsers(usersData);
      setGroups(groupsData);
      setChats(chatsData);

      // Calculate stats
      const today = new Date().toDateString();
      const todayChats = chatsData.filter((chat: ChatHistory) => 
        new Date(chat.createdAt).toDateString() === today
      ).length;

      setStats({
        totalUsers: usersData.length,
        totalGroups: groupsData.length,
        totalChats: chatsData.length,
        todayChats,
      });
    } catch (err: any) {
      showToast('Không thể tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    showToast('👋 Đã đăng xuất!', 'success');
    navigate('/login');
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
      await authApis().delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      showToast('Đã xóa user', 'success');
    } catch (err) {
      showToast('Không thể xóa user', 'error');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm('Bạn có chắc muốn xóa group này?')) return;
    try {
      await authApis().delete(`/chat-groups/${groupId}`);
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setStats(prev => ({ ...prev, totalGroups: prev.totalGroups - 1 }));
      showToast('Đã xóa group', 'success');
    } catch (err) {
      showToast('Không thể xóa group', 'error');
    }
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-slate-400">Game AI Chatbot Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-red-400 font-medium">ADMIN</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm">{user?.fullName || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: '📊 Tổng quan', icon: '📊' },
            { id: 'users', label: '👥 Users', icon: '👥' },
            { id: 'groups', label: '💬 Groups', icon: '💬' },
            { id: 'chats', label: '💭 Chats', icon: '💭' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tổng Users" value={stats.totalUsers} icon="👤" color="from-blue-500 to-cyan-500" />
              <StatCard title="Tổng Groups" value={stats.totalGroups} icon="💬" color="from-purple-500 to-pink-500" />
              <StatCard title="Tổng Chats" value={stats.totalChats} icon="💭" color="from-green-500 to-emerald-500" />
              <StatCard title="Chats Hôm nay" value={stats.todayChats} icon="📈" color="from-orange-500 to-red-500" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-all"
                  >
                    <span className="text-slate-400 text-sm">Quản lý</span>
                    <p className="text-white font-medium">Users</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('groups')}
                    className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-all"
                  >
                    <span className="text-slate-400 text-sm">Quản lý</span>
                    <p className="text-white font-medium">Groups</p>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎮 System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">API Server</span>
                    <span className="flex items-center gap-2 text-green-400 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Database</span>
                    <span className="flex items-center gap-2 text-green-400 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">AI Service</span>
                    <span className="flex items-center gap-2 text-green-400 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">👥 Danh sách Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tên</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-300">{u.id}</td>
                      <td className="px-4 py-3 text-white">{u.email}</td>
                      <td className="px-4 py-3 text-slate-300">{u.fullName || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded">{u.rank || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'groups' ? (
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">💬 Danh sách Groups ({groups.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tên Group</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mô tả</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {groups.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-300">{g.id}</td>
                      <td className="px-4 py-3 text-white font-medium">{g.name}</td>
                      <td className="px-4 py-3 text-slate-400">{g.description || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteGroup(g.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">💭 Lịch sử Chat ({chats.length})</h2>
            </div>
            <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto">
              {chats.map((chat) => (
                <div key={chat.id} className="p-4 hover:bg-slate-800/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">💬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm line-clamp-2">
                        <span className="text-cyan-400 font-medium">Q:</span> {chat.question}
                      </p>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                        <span className="text-purple-400 font-medium">A:</span> {chat.answer}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>Group: {chat.chatGroup?.name || '-'}</span>
                        <span>{new Date(chat.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
