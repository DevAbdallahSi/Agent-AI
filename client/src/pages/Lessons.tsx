import React, { useState, useEffect } from 'react'
import { Play, Clock, Star, CheckCircle, Lock, Filter, Search, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessonService } from '../services/lessonService'
import { Lesson } from '../types'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js']
  const levels = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await lessonService.getLessons()
        setLessons(data)
      } catch (error) {
        console.error('Failed to fetch lessons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  const filteredLessons = lessons.filter(lesson => {
    const matchesLanguage = selectedLanguage === 'all' || lesson.language === selectedLanguage
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesLanguage && matchesLevel && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Interactive Lessons
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Learn programming through hands-on exercises with AI guidance
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="input"
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input"
          >
            <option value="all">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredLessons.length} lessons found
            </span>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div key={lesson._id} className="card overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lesson.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  lesson.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {lesson.level}
                </span>
                {lesson.completed && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {lesson.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{lesson.rating}</span>
                </div>
                <span>{lesson.students} students</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {lesson.language}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {lesson.modules} modules
                </span>
              </div>

              {lesson.locked ? (
                <div className="flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Unlock at Level 5</span>
                </div>
              ) : (
                <Link to={`/lessons/${lesson._id}`}>
                  <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 btn-primary">
                    <Play className="h-4 w-4" />
                    <span>{lesson.completed ? 'Review' : 'Start Learning'}</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No lessons found matching your criteria.
          </p>
        </div>
      )}

      {/* Learning Path Suggestion */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Let our AI tutor create a personalized learning path based on your goals and current skill level. 
            Get recommendations for the perfect sequence of lessons to master your chosen programming language.
          </p>
          <button className="btn-primary">
            Get My Learning Path
          </button>
        </div>
      </div>
    </div>
  )
}

export default Lessons