import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { AIMessage, VoiceSettings } from '../types'
import { aiService } from '../services/aiService'
import toast from 'react-hot-toast'

// Type declarations for Speech APIs
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

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

const INITIAL_MESSAGE: AIMessage = {
  id: '1',
  type: 'ai',
  content: 'Hello! I\'m your AI programming tutor. I can help you learn any programming language through interactive voice conversations. What would you like to learn today?',
  timestamp: new Date()
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([INITIAL_MESSAGE])
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

  // Refs to manage speech recognition and synthesis
  const recognitionRef = useRef<any>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isComponentMountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    isComponentMountedRef.current = true
    
    return () => {
      isComponentMountedRef.current = false
      // Cleanup speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
      // Cleanup speech synthesis
      if (utteranceRef.current) {
        speechSynthesis.cancel()
        utteranceRef.current = null
      }
    }
  }, [])

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
    if (!content.trim()) {
      toast.error('Please enter a message')
      return
    }

    addMessage(content, 'user', codeSnippet)
    
    try {
      const response = await aiService.sendMessage(content, codeSnippet)
      
      if (!isComponentMountedRef.current) return
      
      addMessage(response.message, 'ai', response.codeSnippet)
      
      if (isVoiceActive && response.message) {
        speakText(response.message)
      }
    } catch (error) {
      if (!isComponentMountedRef.current) return
      
      console.error('AI Service Error:', error)
      toast.error('Failed to get AI response')
      addMessage('Sorry, I encountered an error. Please try again.', 'ai')
    }
  }, [addMessage, isVoiceActive])

  const toggleVoice = useCallback(() => {
    setIsVoiceActive(prev => {
      const newValue = !prev
      
      // If turning off voice, stop any current speech
      if (!newValue && isSpeaking) {
        speechSynthesis.cancel()
        setIsSpeaking(false)
      }
      
      // If turning off voice, stop any current listening
      if (!newValue && isListening) {
        stopListening()
      }
      
      return newValue
    })
  }, [isSpeaking, isListening])

  const startListening = useCallback(() => {
    if (!isVoiceActive) {
      toast.error('Please enable voice mode first')
      return
    }

    if (isListening) {
      toast('Already listening...')
      return
    }

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser. Try Chrome or Safari.')
      return
    }

    // Stop any current speech before listening
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = voiceSettings.language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        if (isComponentMountedRef.current) {
          setIsListening(true)
          toast.success('Listening... Speak now!')
        }
      }

      recognition.onresult = (event: any) => {
        if (!isComponentMountedRef.current) return
        
        const transcript = event.results[0][0].transcript.trim()
        if (transcript) {
          sendMessage(transcript)
        } else {
          toast.error('No speech detected')
        }
      }

      recognition.onerror = (event: any) => {
        if (!isComponentMountedRef.current) return
        
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        switch (event.error) {
          case 'no-speech':
            toast.error('No speech detected. Please try again.')
            break
          case 'audio-capture':
            toast.error('Microphone not found. Please check your microphone.')
            break
          case 'not-allowed':
            toast.error('Microphone permission denied. Please allow microphone access.')
            break
          case 'network':
            toast.error('Network error. Please check your connection.')
            break
          default:
            toast.error(`Speech recognition error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        if (isComponentMountedRef.current) {
          setIsListening(false)
          recognitionRef.current = null
        }
      }

      recognition.start()
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      toast.error('Failed to start speech recognition')
      setIsListening(false)
    }
  }, [voiceSettings.language, sendMessage, isVoiceActive, isListening, isSpeaking])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const speakText = useCallback((text: string) => {
    if (!text.trim()) return

    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported in this browser')
      return
    }

    // Cancel any existing speech
    speechSynthesis.cancel()
    
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance
      
      utterance.rate = Math.max(0.1, Math.min(10, voiceSettings.speed))
      utterance.pitch = Math.max(0, Math.min(2, voiceSettings.pitch))
      utterance.volume = Math.max(0, Math.min(1, voiceSettings.volume))
      utterance.lang = voiceSettings.language

      utterance.onstart = () => {
        if (isComponentMountedRef.current) {
          setIsSpeaking(true)
        }
      }

      utterance.onend = () => {
        if (isComponentMountedRef.current) {
          setIsSpeaking(false)
          utteranceRef.current = null
        }
      }

      utterance.onerror = (event) => {
        if (isComponentMountedRef.current) {
          console.error('Speech synthesis error:', event.error)
          setIsSpeaking(false)
          utteranceRef.current = null
          toast.error(`Speech error: ${event.error}`)
        }
      }

      speechSynthesis.speak(utterance)
      
    } catch (error) {
      console.error('Failed to start speech synthesis:', error)
      toast.error('Failed to speak text')
      setIsSpeaking(false)
    }
  }, [voiceSettings])

  const updateVoiceSettings = useCallback((settings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...settings }))
  }, [])

  const clearMessages = useCallback(() => {
    // Stop any active speech/listening when clearing
    speechSynthesis.cancel()
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    setIsSpeaking(false)
    setIsListening(false)
    
    setMessages([INITIAL_MESSAGE])
  }, []) // Removed messages dependency to prevent infinite re-renders

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