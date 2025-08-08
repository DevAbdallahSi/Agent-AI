import React, { createContext, useContext, useState } from 'react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
}

interface AIContextType {
  messages: AIMessage[];
  isVoiceActive: boolean;
  isListening: boolean;
  currentLanguage: string;
  addMessage: (content: string, type: 'user' | 'ai') => void;
  toggleVoice: () => void;
  startListening: () => void;
  stopListening: () => void;
  setLanguage: (language: string) => void;
  clearMessages: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: React.ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI programming tutor. I can help you learn any programming language through interactive voice conversations. What would you like to learn today?',
      timestamp: new Date()
    }
  ]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('JavaScript');

  const addMessage = (content: string, type: 'user' | 'ai') => {
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      language: type === 'ai' ? currentLanguage : undefined
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    if (type === 'user') {
      setTimeout(() => {
        const aiResponse = generateAIResponse(content, currentLanguage);
        const aiMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          language: currentLanguage
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const toggleVoice = () => {
    setIsVoiceActive(prev => !prev);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  const clearMessages = () => {
    setMessages([messages[0]]); // Keep the initial greeting
  };

  return (
    <AIContext.Provider value={{
      messages,
      isVoiceActive,
      isListening,
      currentLanguage,
      addMessage,
      toggleVoice,
      startListening,
      stopListening,
      setLanguage,
      clearMessages
    }}>
      {children}
    </AIContext.Provider>
  );
};

// Helper function to generate AI responses
const generateAIResponse = (userMessage: string, language: string): string => {
  const responses = {
    greeting: `Great! Let's start learning ${language}. I'll guide you through interactive lessons where you'll write real code. Would you like to begin with variables and basic syntax?`,
    variables: `In ${language}, variables store data values. Let me show you how to declare them. Try typing: ${language === 'JavaScript' ? 'let message = "Hello World";' : 'message = "Hello World"'}`,
    functions: `Functions are reusable blocks of code. In ${language}, you can create them like this: ${language === 'JavaScript' ? 'function greet(name) { return "Hello " + name; }' : 'def greet(name): return f"Hello {name}"'}`,
    help: `I'm here to help! You can ask me about syntax, debugging, best practices, or any programming concept. I can also review your code and suggest improvements.`,
    default: `That's an interesting question about ${language}! Let me break that down for you step by step. First, let's understand the core concept, then we'll practice with hands-on coding exercises.`
  };

  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return responses.greeting;
  } else if (lowerMessage.includes('variable') || lowerMessage.includes('var')) {
    return responses.variables;
  } else if (lowerMessage.includes('function') || lowerMessage.includes('method')) {
    return responses.functions;
  } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
    return responses.help;
  } else {
    return responses.default;
  }
};