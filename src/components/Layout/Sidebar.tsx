import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, BookOpen, Brain, Eye, MessageSquare, Mic, Settings, Award, BarChart3, Users } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Lessons', path: '/lessons' },
    { icon: Brain, label: 'Algorithms', path: '/algorithms' },
    { icon: Eye, label: 'Visual Learning', path: '/visual-learning' },
    { icon: Award, label: 'Achievements', path: '/achievements' },
    { icon: BarChart3, label: 'Progress', path: '/progress' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Mic className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Agent</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Talk to your AI tutor in any language
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Assistant</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Get instant help with code and concepts
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;