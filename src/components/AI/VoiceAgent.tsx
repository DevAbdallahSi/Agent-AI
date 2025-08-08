import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Languages, Settings } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

const VoiceAgent: React.FC = () => {
  const { isVoiceActive, isListening, currentLanguage, toggleVoice, startListening, stopListening, setLanguage } = useAI();
  const [isMinimized, setIsMinimized] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }
  ];

  useEffect(() => {
    // Simulate speaking animation
    if (isListening || isSpeaking) {
      const interval = setInterval(() => {
        setIsSpeaking(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isListening, isSpeaking]);

  if (!isVoiceActive && isMinimized) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-16 h-16' : 'w-80'} transition-all duration-300`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {!isMinimized ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <Mic className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Voice Tutor</h3>
                    <p className="text-xs opacity-90">
                      {isListening ? 'Listening...' : 'Ready to help'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Language Selection */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Teaching Language
                </label>
                <select
                  value={currentLanguage}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.name}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voice Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Input</span>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Volume</span>
                  <div className="flex items-center space-x-2">
                    <VolumeX className="h-4 w-4 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16"
                    />
                    <Volume2 className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {isListening ? 'Say something...' : 'Click the mic to start talking'}
                  </span>
                </div>
              </div>

              {/* Quick Commands */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Try saying:</p>
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p>"Explain functions in JavaScript"</p>
                  <p>"Help me debug this code"</p>
                  <p>"What's wrong with my logic?"</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Minimized View */
          <button
            onClick={() => setIsMinimized(false)}
            className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
          >
            <Mic className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Speaking Indicator */}
      {(isListening || isSpeaking) && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-xs">
          {isListening ? '🎤 Listening...' : '🔊 Speaking...'}
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;