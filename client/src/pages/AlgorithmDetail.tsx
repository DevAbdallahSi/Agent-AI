import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Clock, Trophy, ArrowLeft, Star, CheckCircle } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { algorithmService } from '../services/algorithmService'
import { Algorithm } from '../types'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const AlgorithmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [showVisualization, setShowVisualization] = useState(false)

  useEffect(() => {
    const fetchAlgorithm = async () => {
      if (!id) return
      
      try {
        const data = await algorithmService.getAlgorithm(id)
        setAlgorithm(data)
        setCode(data.implementation)
      } catch (error) {
        console.error('Failed to fetch algorithm:', error)
        toast.error('Failed to load algorithm')
        navigate('/algorithms')
      } finally {
        setLoading(false)
      }
    }

    fetchAlgorithm()
  }, [id, navigate])

  const runCode = async () => {
    setIsRunning(true)
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOutput('Algorithm executed successfully!\nTime complexity: O(n log n)\nSpace complexity: O(log n)')
      toast.success('Code executed successfully!')
    } catch (error) {
      setOutput(`Error: ${error}`)
      toast.error('Code execution failed')
    } finally {
      setIsRunning(false)
    }
  }

  const submitSolution = async () => {
    if (!algorithm) return
    
    try {
      await algorithmService.completeAlgorithm(algorithm._id, code, algorithm.timeComplexity)
      setAlgorithm(prev => prev ? { ...prev, completed: true } : null)
      toast.success('Algorithm completed! 🎉')
    } catch (error) {
      toast.error('Failed to submit solution')
    }
  }

  const toggleStar = async () => {
    if (!algorithm) return
    
    try {
      if (algorithm.starred) {
        await algorithmService.unstarAlgorithm(algorithm._id)
      } else {
        await algorithmService.starAlgorithm(algorithm._id)
      }
      
      setAlgorithm(prev => prev ? { ...prev, starred: !prev.starred } : null)
    } catch (error) {
      toast.error('Failed to update star status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!algorithm) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Algorithm not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/algorithms')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Algorithms</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleStar}
              className={`p-2 rounded-lg ${algorithm.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Star className={`h-5 w-5 ${algorithm.starred ? 'fill-current' : ''}`} />
            </button>
            
            {algorithm.completed && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300">Completed</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {algorithm.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {algorithm.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-medium">Time Complexity:</span> {algorithm.timeComplexity}
              </div>
              <div>
                <span className="font-medium">Space Complexity:</span> {algorithm.spaceComplexity}
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{algorithm.estimatedTime} min</span>
              </div>
            </div>
          </div>
          
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            algorithm.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
            algorithm.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            {algorithm.difficulty}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Explanation Panel */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Algorithm Explanation
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400">
              {algorithm.explanation}
            </p>
          </div>

          {/* Visualization Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className="w-full btn-secondary"
            >
              {showVisualization ? 'Hide' : 'Show'} Visualization
            </button>
          </div>

          {/* Simple Visualization */}
          {showVisualization && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Visual Representation
              </h3>
              <div className="flex justify-center space-x-2 mb-4">
                {[64, 34, 25, 12, 22, 11, 90].map((value, index) => (
                  <div
                    key={index}
                    className="bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium flex items-end"
                    style={{ height: `${value}px` }}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Array elements to be sorted
              </p>
            </div>
          )}
        </div>

        {/* Code Editor Panel */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Implementation
            </h2>
          </div>
          
          <div className="h-96">
            <Editor
              height="100%"
              defaultLanguage="javascript"
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
                  onClick={submitSolution}
                  disabled={algorithm.completed}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
                >
                  <Trophy className="h-3 w-3" />
                  <span>{algorithm.completed ? 'Completed' : 'Submit'}</span>
                </button>
              </div>
            </div>
            <div className="bg-gray-900 text-gray-300 p-3 rounded font-mono text-sm min-h-20">
              {output || 'Run your code to see the output...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlgorithmDetail