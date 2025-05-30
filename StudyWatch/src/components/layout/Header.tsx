import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudy } from '../../context/StudyContext';
import Button from '../ui/Button';
import { BookOpen, LogOut, MessageSquare, Bell } from 'lucide-react';

interface HeaderProps {
  onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const { getUnreadMessageCount } = useStudy();
  
  const unreadMessages = currentUser ? getUnreadMessageCount(currentUser.id) : 0;
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <BookOpen size={24} />
              <span className="font-bold text-lg">StudyWatch</span>
            </button>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('/messages')}
                className="relative text-gray-700 hover:text-gray-900"
              >
                <MessageSquare size={20} />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => onNavigate('/calendar')}
                className="text-gray-700 hover:text-gray-900"
              >
                <Bell size={20} />
              </button>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">
                  {currentUser.name} ({currentUser.role})
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;