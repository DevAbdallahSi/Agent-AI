import React from 'react';
import { Play, Trophy, Target, Clock, TrendingUp, Brain, Code, Users } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Dashboard: React.FC = () => {
  const { user } = useUser();

  const quickStats = [
    { icon: Trophy, label: 'Current Level', value: user?.level || 0, color: 'text-yellow-600' },
    { icon: Target, label: 'XP Points', value: user?.xp || 0, color: 'text-blue-600' },
    { icon: Clock, label: 'Study Streak', value: `${user?.streak || 0} days`, color: 'text-green-600' },
    { icon: Code, label: 'Lessons Completed', value: user?.completedLessons.length || 0, color: 'text-purple-600' }
  ];

  const recentLessons = [
    { id: '1', title: 'JavaScript Functions', progress: 100, language: 'JavaScript' },
    { id: '2', title: 'Python Data Types', progress: 75, language: 'Python' },
    { id: '3', title: 'React Components', progress: 50, language: 'React' },
    { id: '4', title: 'Database Design', progress: 25, language: 'SQL' }
  ];

  const achievements = [
    { id: '1', title: 'First Steps', description: 'Completed your first lesson', earned: true },
    { id: '2', title: 'Code Warrior', description: 'Solved 10 coding challenges', earned: true },
    { id: '3', title: 'Algorithm Master', description: 'Mastered sorting algorithms', earned: false },
    { id: '4', title: 'Full Stack Developer', description: 'Built a complete web application', earned: false }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to continue your programming journey? Let's code something amazing today!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div key={lesson.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.language}</p>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Play className="h-4 w-4" />
                      <span>Continue</span>
                    </button>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{lesson.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements & Progress */}
        <div className="space-y-8">
          {/* Today's Goal */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Goal</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Complete 2 lessons and earn 200 XP
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">120/200 XP earned</p>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.earned ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                  <Trophy className={`h-5 w-5 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Streak */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Learning Streak</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {user?.streak} days
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep going! You're on fire! 🔥
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Start AI Session</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Talk with your AI tutor</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Code Challenge</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Solve a random problem</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Join Community</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with learners</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;