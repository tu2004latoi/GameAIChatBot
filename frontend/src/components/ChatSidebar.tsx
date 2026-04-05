import { useState } from 'react';
import type { ChatGroup } from '../types/chat-group';

interface ChatSidebarProps {
  groups: ChatGroup[];
  activeGroupId: number | null;
  onSelectGroup: (groupId: number) => void;
  onCreateGroup: () => void;
  onDeleteGroup: (groupId: number) => void;
  currentUser: { fullName?: string; email?: string; rank?: string; preference?: string } | null;
  onLogout: () => void;
}

const ChatSidebar = ({
  groups,
  activeGroupId,
  onSelectGroup,
  onCreateGroup,
  onDeleteGroup,
  currentUser,
  onLogout,
}: ChatSidebarProps) => {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  // Get rank color for user avatar border
  const getRankColor = (rank?: string) => {
    switch (rank?.toUpperCase()) {
      case 'BRONZE': return 'from-amber-700 to-amber-600';
      case 'SILVER': return 'from-slate-400 to-slate-300';
      case 'GOLD': return 'from-yellow-500 to-yellow-400';
      case 'PLATINUM': return 'from-cyan-400 to-cyan-300';
      case 'DIAMOND': return 'from-blue-400 to-cyan-300';
      case 'MASTER': return 'from-purple-500 to-purple-400';
      case 'GRANDMASTER': return 'from-red-500 to-orange-500';
      case 'CHALLENGER': return 'from-pink-500 to-rose-500';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  return (
    <div className="w-72 bg-slate-900/95 border-r border-slate-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              GAME AI
            </h2>
            <p className="text-xs text-slate-400">Chat Assistant</p>
          </div>
        </div>

        {/* Create Group Button */}
        <button
          onClick={onCreateGroup}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-purple-500/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Group Chat
        </button>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Các Group Chat ({groups.length})
        </div>
        
        {groups.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">Chưa có group nào</p>
            <p className="text-slate-500 text-xs mt-1">Tạo group để bắt đầu chat</p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="relative group"
                onMouseEnter={() => setHoveredGroup(group.id)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <div
                  onClick={() => onSelectGroup(group.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                    ${activeGroupId === group.id 
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/30 text-white' 
                      : 'hover:bg-slate-800/50 text-slate-300'
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${activeGroupId === group.id
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                      : 'bg-slate-800 group-hover:bg-slate-700'
                    }
                  `}>
                    <span className="text-lg font-bold">
                      {group.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{group.name}</p>
                    {group.description && (
                      <p className="text-xs text-slate-400 truncate">{group.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Delete button on hover */}
                {hoveredGroup === group.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGroup(group.id);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors z-10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current User */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br ${getRankColor(currentUser?.rank)} p-[2px]`}>
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser?.fullName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.fullName || currentUser?.email || 'Người dùng'}
            </p>
            {currentUser?.rank && (
              <p className="text-xs text-cyan-400 font-medium">{currentUser.rank}</p>
            )}
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
