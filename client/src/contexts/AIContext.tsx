import React, { createContext, useContext, useState, useCallback } from 'react'
import { AIMessage, VoiceSettings } from '../types'
import { aiService } from '../services/aiService'
import toast from 'react-hot-toast'

interface AIContextType {
  messages: AIMessage[]
  isVoiceActive: boolean
  isListening: boolean
  isSpeaking: boolean
  voiceSettings: VoiceSettings
  addMessage: (content: string, type: 'user' | 'ai', codeSnippet?: string) => void
  sendMessage: (content: string, codeSnippet?: string) => Promise<void>
  toggleVoice: () => void
  startListening: () => void
  stopListening: () => void
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void
  clearMessages: () => void
  speakText: (text: string) => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

interface AIProviderProps {
  children: React.ReactNode
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI programming tutor. I can help you learn any programming language through interactive voice conversations. What would you like to learn today?',
      timestamp: new Date()
    }
  ])
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en-US',
    voice: 'default',
    speed: 1,
    pitch: 1,
    volume: 0.8
  })

  const addMessage = useCallback((content: string, type: 'user' | 'ai', codeSnippet?: string) => {
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      codeSnippet
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  const sendMessage = useCallback(async (content: string, codeSnippet?: string) => {
    addMessage(content, 'user', codeSnippet)
    
    try {
      const response = await aiService.sendMessage(content, codeSnippet)
      addMessage(response.message, 'ai', response.codeSnippet)
      
      if (isVoiceActive && response.message) {
        speakText(response.message)
      }
    } catch (error) {
      toast.error('Failed to get AI response')
      addMessage('Sorry, I encountered an error. Please try again.', 'ai')
    }
  }, [addMessage, isVoiceActive])

  const toggleVoice = useCallback(() => {
    setIsVoiceActive(prev => !prev)
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSpeaking])

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = voiceSettings.language

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
    }

    recognition.onerror = (event) => {
      toast.error('Speech recognition error: ' + event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [voiceSettings.language, sendMessage])

  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported in this browser')
      return
    }

    speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = voiceSettings.speed
    utterance.pitch = voiceSettings.pitch
    utterance.volume = voiceSettings.volume
    utterance.lang = voiceSettings.language

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }, [voiceSettings])

  const updateVoiceSettings = useCallback((settings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...settings }))
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([messages[0]]) // Keep the initial greeting
  }, [messages])

  return (
    <AIContext.Provider value={{
      messages,
      isVoiceActive,
      isListening,
      isSpeaking,
      voiceSettings,
      addMessage,
      sendMessage,
      toggleVoice,
      startListening,
      stopListening,
      updateVoiceSettings,
      clearMessages,
      speakText
    }}>
      {children}
    </AIContext.Provider>
  )
}