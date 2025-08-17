import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Languages, Settings, Minimize2, Maximize2, X, Headphones } from 'lucide-react'
import { useAI } from '../../contexts/AIContext'
import toast from 'react-hot-toast'

const VoiceAgent: React.FC = () => {
    const {
        isVoiceActive,
        isListening,
        isSpeaking,
        voiceSettings,
        toggleVoice,
        startListening,
        stopListening,
        updateVoiceSettings
    } = useAI()
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const componentRef = useRef<HTMLDivElement>(null)

    const languages = [
        { code: 'en-US', name: 'English', flag: '🇺🇸' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
        { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
        { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
        { code: 'pt-PT', name: 'Portuguese', flag: '🇵🇹' },
        { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
        { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' }
    ]

    // Handle voice activation toggle
    const handleVoiceToggle = () => {
        try {
            toggleVoice()
            if (!isVoiceActive) {
                setIsOpen(true)
                toast.success('Voice agent activated')
            } else {
                toast.success('Voice agent deactivated')
            }
        } catch (error) {
            toast.error('Failed to toggle voice agent')
        }
    }

    // Handle listening toggle with error handling
    const handleListeningToggle = async () => {
        try {
            if (isListening) {
                await stopListening()
            } else {
                await startListening()
            }
        } catch (error) {
            toast.error('Microphone access denied or not available')
        }
    }

    // Close settings when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setShowSettings(false)
            }
        }

        if (showSettings) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showSettings])

    return (
        <>
            {/* Voice Agent Button - Always visible when not open */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`
            fixed bottom-4 left-4 sm:bottom-6 sm:left-6 w-14 h-14 sm:w-16 sm:h-16 
            bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full 
            shadow-lg hover:shadow-xl transition-all duration-300 z-40 
            flex items-center justify-center group hover:scale-105
            ${(isListening || isSpeaking) ? 'animate-pulse ring-4 ring-purple-300' : ''}
          `}
                    aria-label="Open Voice Agent"
                >
                    <Headphones className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                    {(isListening || isSpeaking) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                    )}
                </button>
            )}

            {/* Voice Agent Panel */}
            {isOpen && (
                <div
                    ref={componentRef}
                    className={`
            fixed z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
            transition-all duration-300 ease-in-out
            ${isMinimized
                            ? 'bottom-4 left-4 sm:bottom-6 sm:left-6 w-16 h-16'
                            : 'bottom-4 left-4 sm:bottom-6 sm:left-6 w-[320px] sm:w-80'
                        }
            ${window.innerWidth < 640 ? 'left-4 right-4 w-auto' : ''}
          `}
                >
                    {!isMinimized ? (
                        <div className="flex flex-col max-h-[calc(100vh-2rem)]">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 sm:p-4 text-white rounded-t-2xl flex items-center justify-between shrink-0">
                                <div className="flex items-center space-x-2 min-w-0 flex-1">
                                    <div className={`
                    w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0
                    ${(isSpeaking || isListening) ? 'animate-pulse ring-2 ring-white/30' : ''}
                  `}>
                                        <Headphones className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-sm truncate">AI Voice Tutor</h3>
                                        <p className="text-xs opacity-90 truncate">
                                            {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Ready to help'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 shrink-0">
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        aria-label="Settings"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsMinimized(true)}
                                        className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        aria-label="Minimize"
                                    >
                                        <Minimize2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-3 sm:p-4 space-y-4">
                                    {/* Voice Controls */}
                                    <div className="space-y-3">
                                        {/* Main Voice Toggle */}
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${isVoiceActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Voice Agent
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleVoiceToggle}
                                                className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${isVoiceActive ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
                        `}
                                            >
                                                <span
                                                    className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${isVoiceActive ? 'translate-x-6' : 'translate-x-1'}
                          `}
                                                />
                                            </button>
                                        </div>

                                        {isVoiceActive && (
                                            <>
                                                {/* Listening Control */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Input</span>
                                                    <button
                                                        onClick={handleListeningToggle}
                                                        className={`
                              p-3 rounded-full transition-all duration-200 flex items-center justify-center
                              ${isListening
                                                                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                                                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400'
                                                            }
                            `}
                                                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                                                    >
                                                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                                    </button>
                                                </div>

                                                {/* Language Selection */}
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                                        <Languages className="h-3 w-3 inline mr-1" />
                                                        Teaching Language
                                                    </label>
                                                    <select
                                                        value={voiceSettings.language}
                                                        onChange={(e) => updateVoiceSettings({ language: e.target.value })}
                                                        className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                                    >
                                                        {languages.map(lang => (
                                                            <option key={lang.code} value={lang.code}>
                                                                {lang.flag} {lang.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Settings Panel */}
                                                {showSettings && (
                                                    <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                                            <Settings className="h-3 w-3 mr-1" />
                                                            Voice Settings
                                                        </h4>

                                                        {/* Volume Control */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">Volume</span>
                                                            <div className="flex items-center space-x-2">
                                                                <VolumeX className="h-3 w-3 text-gray-400" />
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="1"
                                                                    step="0.1"
                                                                    value={voiceSettings.volume}
                                                                    onChange={(e) => updateVoiceSettings({ volume: parseFloat(e.target.value) })}
                                                                    className="w-20 accent-purple-600"
                                                                />
                                                                <Volume2 className="h-3 w-3 text-gray-600" />
                                                                <span className="text-xs text-gray-500 w-8">{Math.round(voiceSettings.volume * 100)}%</span>
                                                            </div>
                                                        </div>

                                                        {/* Speed Control */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="range"
                                                                    min="0.5"
                                                                    max="2"
                                                                    step="0.1"
                                                                    value={voiceSettings.speed}
                                                                    onChange={(e) => updateVoiceSettings({ speed: parseFloat(e.target.value) })}
                                                                    className="w-20 accent-purple-600"
                                                                />
                                                                <span className="text-xs text-gray-500 w-8">{voiceSettings.speed}x</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Status Indicator */}
                                                <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full transition-colors ${isListening ? 'bg-green-500 animate-pulse' :
                                                                isSpeaking ? 'bg-blue-500 animate-pulse' :
                                                                    'bg-gray-400'
                                                            }`}></div>
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                            {isListening ? 'Say something...' :
                                                                isSpeaking ? 'AI is speaking...' :
                                                                    'Click the mic to start talking'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Quick Commands */}
                                                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">💡 Try saying:</p>
                                                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <p>"Explain functions in JavaScript"</p>
                                                        <p>"Help me debug this code"</p>
                                                        <p>"What's wrong with my logic?"</p>
                                                        <p>"Teach me about algorithms"</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Minimized View */
                        <button
                            onClick={() => setIsMinimized(false)}
                            className={`
                w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300
                ${(isSpeaking || isListening) ? 'animate-pulse ring-4 ring-purple-300' : ''}
              `}
                            aria-label="Maximize Voice Agent"
                        >
                            <Headphones className="h-6 w-6" />
                        </button>
                    )}
                </div>
            )}

            {/* Global Status Indicator */}
            {(isListening || isSpeaking) && isOpen && (
                <div className="fixed bottom-[calc(100vh-8rem)] left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs z-50 pointer-events-none">
                    {isListening ? '🎤 Listening for your voice...' : '🔊 AI is speaking...'}
                </div>
            )}
        </>
    )
}

export default VoiceAgent