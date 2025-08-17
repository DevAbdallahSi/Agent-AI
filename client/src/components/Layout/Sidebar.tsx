import React from 'react'
import { NavLink } from 'react-router-dom'
import { X, Home, BookOpen, Brain, Eye, MessageSquare, Mic, Settings, Award, BarChart3, Users, User } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
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
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ]

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
        fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden shrink-0">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable navigation area */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-4 border-blue-500 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Fixed bottom section */}
        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
          {/* Voice Agent Card */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded">
                <Mic className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Voice Agent</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Talk to your AI tutor in any language
            </p>
          </div>
          
          {/* AI Assistant Card */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1 bg-green-100 dark:bg-green-800 rounded">
                <MessageSquare className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">AI Assistant</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Get instant help with code and concepts
            </p>
          </div>

          {/* Online status indicator */}
          <div className="flex items-center justify-center space-x-2 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar