import React, { useState } from 'react';
import { Play, Clock, Star, CheckCircle, Lock, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Lessons: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const lessons = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming including variables, functions, and control structures.',
      language: 'JavaScript',
      level: 'Beginner',
      duration: 45,
      rating: 4.8,
      completed: true,
      locked: false,
      students: 1200,
      modules: 8
    },
    {
      id: '2',
      title: 'Python Data Structures',
      description: 'Master lists, dictionaries, sets, and tuples in Python with hands-on exercises.',
      language: 'Python',
      level: 'Intermediate',
      duration: 60,
      rating: 4.9,
      completed: false,
      locked: false,
      students: 980,
      modules: 10
    },
    {
      id: '3',
      title: 'React Components & Props',
      description: 'Build dynamic user interfaces with React components and learn prop management.',
      language: 'React',
      level: 'Intermediate',
      duration: 75,
      rating: 4.7,
      completed: false,
      locked: false,
      students: 856,
      modules: 12
    },
    {
      id: '4',
      title: 'Advanced Algorithms',
      description: 'Dive deep into complex algorithms including dynamic programming and graph theory.',
      language: 'Python',
      level: 'Advanced',
      duration: 120,
      rating: 4.9,
      completed: false,
      locked: true,
      students: 432,
      modules: 15
    },
    {
      id: '5',
      title: 'Node.js Backend Development',
      description: 'Create robust server-side applications with Node.js, Express, and databases.',
      language: 'Node.js',
      level: 'Intermediate',
      duration: 90,
      rating: 4.6,
      completed: false,
      locked: true,
      students: 654,
      modules: 14
    },
    {
      id: '6',
      title: 'Java Object-Oriented Programming',
      description: 'Master OOP concepts in Java including inheritance, polymorphism, and encapsulation.',
      language: 'Java',
      level: 'Intermediate',
      duration: 85,
      rating: 4.8,
      completed: false,
      locked: false,
      students: 743,
      modules: 11
    }
  ];

  const filteredLessons = lessons.filter(lesson => {
    const matchesLanguage = selectedLanguage === 'all' || lesson.language === selectedLanguage;
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLanguage && matchesLevel && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Interactive Lessons
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn programming through hands-on exercises with AI guidance
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
          <div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                <Link to={`/lessons/${lesson.id}`}>
                  <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                    <Play className="h-4 w-4" />
                    <span>{lesson.completed ? 'Review' : 'Start Learning'}</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

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
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
            Get My Learning Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lessons;