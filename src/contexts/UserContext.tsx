import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  completedLessons: string[];
  currentLanguage: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'demo-user',
      name: 'Alex Developer',
      email: 'alex@example.com',
      level: 3,
      xp: 1250,
      badges: ['First Steps', 'JavaScript Basics', 'Problem Solver'],
      streak: 7,
      completedLessons: ['js-basics-1', 'js-basics-2', 'js-functions'],
      currentLanguage: 'JavaScript'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const login = (userData: Omit<User, 'id'>) => {
    setUser({ ...userData, id: 'demo-user' });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      return { ...prev, xp: newXP, level: Math.max(prev.level, newLevel) };
    });
  };

  const addBadge = (badge: string) => {
    setUser(prev => {
      if (!prev || prev.badges.includes(badge)) return prev;
      return { ...prev, badges: [...prev.badges, badge] };
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, addXP, addBadge }}>
      {children}
    </UserContext.Provider>
  );
};