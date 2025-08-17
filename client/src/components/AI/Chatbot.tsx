import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Minimize2, Maximize2, RotateCcw, Copy, Code, Loader2 } from 'lucide-react'
import { useAI } from '../../contexts/AIContext'
import toast from 'react-hot-toast'

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { messages, sendMessage, clearMessages } = useAI()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      try {
        setIsLoading(true)
        await sendMessage(input.trim())
        setInput('')
      } catch (error) {
        toast.error('Failed to send message')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  const handleClearMessages = () => {
    clearMessages()
    toast.success('Chat cleared')
  }

  const quickQuestions = [
    "How do I debug my code?",
    "Explain recursion",
    "What's the difference between let and var?",
    "Help me with this error"
  ]

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`
          fixed z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
          transition-all duration-300 ease-in-out
          ${isMinimized 
            ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 h-16' 
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[340px] sm:w-96 h-[500px] max-h-[calc(100vh-2rem)]'
          }
          ${window.innerWidth < 640 ? 'left-4 right-4 w-auto' : ''}
        `}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 sm:p-4 text-white rounded-t-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate">AI Assistant</h3>
                <p className="text-xs opacity-90 truncate">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={handleClearMessages}
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Clear messages"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)]">
              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scroll-smooth"
                style={{ maxHeight: 'calc(100% - 140px)' }}
              >
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Start a conversation with your AI assistant</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                      
                      {message.codeSnippet && (
                        <div className="mt-3 p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-xs overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{message.codeSnippet}</pre>
                        </div>
                      )}
                      
                      {message.type === 'ai' && (
                        <div className="flex items-center space-x-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1 transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </button>
                          {message.codeSnippet && (
                            <button
                              onClick={() => copyMessage(message.codeSnippet!)}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1 transition-colors"
                            >
                              <Code className="h-3 w-3" />
                              <span>Code</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 0 && (
                <div className="px-3 sm:px-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 mt-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(question)
                          setTimeout(() => inputRef.current?.focus(), 100)
                        }}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything about programming..."
                      className="w-full p-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      rows={1}
                      style={{ 
                        minHeight: '44px', 
                        maxHeight: '100px',
                        overflow: 'hidden'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Chatbot