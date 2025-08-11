import React, { useState, useEffect } from 'react'
import { Play, Clock, Trophy, Target, Brain, ChevronRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { algorithmService } from '../services/algorithmService'
import { Algorithm } from '../types'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Algorithms: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('sorting')
  const [difficulty, setDifficulty] = useState('all')

  const categories = [
    { id: 'sorting', name: 'Sorting', icon: '🔄', count: 12 },
    { id: 'searching', name: 'Searching', icon: '🔍', count: 8 },
    { id: 'graphs', name: 'Graph Algorithms', icon: '🕸️', count: 15 },
    { id: 'dp', name: 'Dynamic Programming', icon: '⚡', count: 10 },
    { id: 'trees', name: 'Trees & Binary Search', icon: '🌳', count: 14 },
    { id: 'greedy', name: 'Greedy Algorithms', icon: '🎯', count: 9 }
  ]

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const data = await algorithmService.getAlgorithmsByCategory(selectedCategory)
        setAlgorithms(data)
      } catch (error) {
        console.error('Failed to fetch algorithms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlgorithms()
  }, [selectedCategory])

  const filteredAlgorithms = algorithms.filter(algo => {
    if (difficulty === 'all') return true
    return algo.difficulty.toLowerCase() === difficulty.toLowerCase()
  })

  const handleStarAlgorithm = async (id: string, starred: boolean) => {
    try {
      if (starred) {
        await algorithmService.unstarAlgorithm(id)
      } else {
        await algorithmService.starAlgorithm(id)
      }
      
      setAlgorithms(prev => prev.map(algo => 
        algo._id === id ? { ...algo, starred: !starred } : algo
      ))
    } catch (error) {
      console.error('Failed to update star status:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Algorithms & Data Structures
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Master computer science fundamentals with interactive algorithm implementations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Algorithms Solved</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">23</p>
            </div>
            <Brain className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">87%</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Time</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">42h</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Rank</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">#147</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {category.count}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Difficulty</h3>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Algorithms List */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {categories.find(c => c.id === selectedCategory)?.name} Algorithms
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredAlgorithms.length} algorithms
                </span>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="large" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlgorithms.map((algorithm) => (
                    <div key={algorithm._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {algorithm.name}
                          </h3>
                          {algorithm.completed && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                              <Trophy className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs text-green-700 dark:text-green-300">Completed</span>
                            </div>
                          )}
                          <button
                            onClick={() => handleStarAlgorithm(algorithm._id, algorithm.starred)}
                            className={`p-1 rounded ${algorithm.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                          >
                            <Star className={`h-4 w-4 ${algorithm.starred ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          algorithm.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          algorithm.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {algorithm.difficulty}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {algorithm.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            <span className="font-medium">Time:</span> {algorithm.timeComplexity}
                          </div>
                          <div>
                            <span className="font-medium">Space:</span> {algorithm.spaceComplexity}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{algorithm.estimatedTime} min</span>
                          </div>
                        </div>

                        <Link to={`/algorithms/${algorithm._id}`}>
                          <button className="flex items-center space-x-2 px-4 py-2 btn-primary">
                            <Play className="h-4 w-4" />
                            <span>{algorithm.completed ? 'Review' : 'Start'}</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredAlgorithms.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No algorithms found for the selected filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Algorithms