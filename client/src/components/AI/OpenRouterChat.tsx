import React, { useEffect, useState, useRef } from 'react';
import { X, Send, Bot, User, Copy, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  from: 'self' | 'ai';
  timestamp: Date;
  sender?: string;
}

interface OpenRouterChatProps {
  userId?: string;
  isOpen: boolean;
  onClose?: () => void;
  userName?: string;
  aiName?: string;
}

const OpenRouterChat: React.FC<OpenRouterChatProps> = ({ 
  userId = 'user', 
  isOpen, 
  onClose, 
  userName = 'You', 
  aiName = 'AI Assistant' 
}) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI programming tutor. I can help you with coding questions, debug your code, explain concepts, and guide you through programming challenges. What would you like to learn today?',
      from: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // OpenRouter API configuration
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 'your-openrouter-api-key';
  const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  const sendMessageToOpenRouter = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Programming Education Platform',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet', // You can change this to other models
          messages: [
            {
              role: 'system',
              content: `You are an expert AI programming tutor. You help students learn programming concepts, debug code, explain algorithms, and provide step-by-step guidance. You are patient, encouraging, and always provide clear explanations with examples when needed. You can help with JavaScript, Python, Java, C++, React, Node.js, algorithms, data structures, and general programming concepts.`
            },
            ...messages.slice(-10).map(msg => ({
              role: msg.from === 'self' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      return 'I\'m having trouble connecting right now. Please check your API key and try again.';
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      from: 'self',
      timestamp: new Date(),
      sender: userId,
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToOpenRouter(message.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        from: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        from: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string): void => {
    navigator.clipboard.writeText(content);
  };

  const clearMessages = (): void => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your AI programming tutor. I can help you with coding questions, debug your code, explain concepts, and guide you through programming challenges. What would you like to learn today?',
        from: 'ai',
        timestamp: new Date(),
      }
    ]);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{aiName}</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearMessages}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4 text-white/80 hover:text-white" />
          </button>
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              title="Close chat"
            >
              <X className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'self' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.from === 'self' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-center mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
                  msg.from === 'self' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {msg.from === 'self' ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {msg.from === 'self' ? userName : aiName}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={`px-4 py-3 rounded-2xl text-sm transition-all duration-200 relative group ${
                  msg.from === 'self'
                    ? 'bg-blue-600 text-white rounded-br-md shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.from === 'ai' && (
                  <button
                    onClick={() => copyMessage(msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 bg-purple-600 text-white">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{aiName}</span>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask ${aiName} anything about programming...`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['Explain functions', 'Debug my code', 'Algorithm help', 'Best practices'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setMessage(suggestion)}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenRouterChat;