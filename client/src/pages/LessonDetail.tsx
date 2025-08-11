import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Pause, RotateCcw, CheckCircle, ArrowLeft, ArrowRight, Mic, Volume2, Code } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useAI } from '../contexts/AIContext'
import { useAuth } from '../contexts/AuthContext'
import { lessonService } from '../services/lessonService'
import { aiService } from '../services/aiService'
import { Lesson } from '../types'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { speakText, isVoiceActive, toggleVoice } = useAI()
  const { updateUser } = useAuth()
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return
      
      try {
        const data = await lessonService.getLesson(id)
        setLesson(data)
        if (data.steps.length > 0) {
          setCode(data.steps[0].code)
        }
      } catch (error) {
        console.error('Failed to fetch lesson:', error)
        toast.error('Failed to load lesson')
        navigate('/lessons')
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id, navigate])

  const currentStepData = lesson?.steps[currentStep]

  const runCode = async () => {
    setIsRunning(true)
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      const result = 'Hello, World!'
      setOutput(`Output: ${result}`)
      updateUser({ xp: (user?.xp || 0) + 25 })
      toast.success('Code executed successfully!')
    } catch (error) {
      setOutput(`Error: ${error}`)
      toast.error('Code execution failed')
    } finally {
      setIsRunning(false)
    }
  }

  const checkCode = async () => {
    if (!currentStepData) return
    
    try {
      const review = await aiService.reviewCode(code, lesson?.language || 'javascript')
      setFeedback(review.feedback)
      
      if (review.score >= 80) {
        setOutput('✅ Great job! Your code is correct.')
        updateUser({ xp: (user?.xp || 0) + 50 })
        toast.success('Excellent work!')
        
        if (currentStep === (lesson?.steps.length || 1) - 1) {
          // Lesson completed
          await lessonService.completeLesson(id!, review.score)
          toast.success('Lesson completed! 🎉')
        }
      } else {
        setOutput('❌ Not quite right. Check the feedback below.')
        toast.error('Try again!')
      }
    } catch (error) {
      setOutput('❌ Unable to check code. Please try again.')
      toast.error('Code review failed')
    }
  }

  const nextStep = () => {
    if (!lesson || currentStep >= lesson.steps.length - 1) return
    
    const nextStepIndex = currentStep + 1
    setCurrentStep(nextStepIndex)
    setCode(lesson.steps[nextStepIndex].code)
    setOutput('')
    setFeedback('')
  }

  const prevStep = () => {
    if (currentStep <= 0) return
    
    const prevStepIndex = currentStep - 1
    setCurrentStep(prevStepIndex)
    setCode(lesson?.steps[prevStepIndex].code || '')
    setOutput('')
    setFeedback('')
  }

  const speakContent = () => {
    if (currentStepData?.content) {
      speakText(currentStepData.content)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!lesson || !currentStepData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Lesson not found</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {lesson.steps.length}: {currentStepData.title}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg ${isVoiceActive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} hover:opacity-80 transition-colors`}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={speakContent}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:opacity-80 transition-colors"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(((currentStep + 1) / lesson.steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Content Panel */}
        <div className="card p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentStepData.content}
            </p>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Your Task:</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {currentStepData.instruction}
              </p>
            </div>
          </div>

          {/* AI Feedback */}
          {feedback && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Code className="h-4 w-4 mr-2 text-primary-600" />
                AI Feedback
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                {feedback}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor Panel */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="h-96">
            <Editor
              height="100%"
              defaultLanguage={lesson.language.toLowerCase()}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Output</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {isRunning ? <LoadingSpinner size="small" /> : <Play className="h-3 w-3" />}
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                  onClick={checkCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>Check</span>
                </button>
                <button
                  onClick={() => setCode(currentStepData.code)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            <div className="bg-gray-900 text-gray-300 p-3 rounded font-mono text-sm min-h-16">
              {output || 'Run your code to see the output...'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="card p-4 mt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 btn-secondary disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {lesson.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep ? 'bg-primary-600' : 
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === lesson.steps.length - 1}
            className="flex items-center space-x-2 px-4 py-2 btn-primary disabled:opacity-50"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LessonDetail