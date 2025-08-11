import React, { useState } from 'react'
import { User, Trophy, Target, Clock, Star, Edit, Save, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentLanguage: user?.currentLanguage || 'JavaScript'
  })

  const handleSave = async () => {
    try {
      const updatedUser = await authService.updateProfile(formData)
      updateUser(updatedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentLanguage: user?.currentLanguage || 'JavaScript'
    })
    setIsEditing(false)
  }

  if (!user) return null

  const stats = [
    { icon: Trophy, label: 'Current Level', value: user.level, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { icon: Target, label: 'Total XP', value: user.xp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Clock, label: 'Study Streak', value: `${user.streak} days`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: Star, label: 'Badges Earned', value: user.badges.length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and learning preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="card p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Level {user.level} • {user.currentLanguage} Developer
              </p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 btn-secondary"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 btn-primary"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 btn-secondary"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Language
            </label>
            {isEditing ? (
              <select
                value={formData.currentLanguage}
                onChange={(e) => setFormData({ ...formData, currentLanguage: e.target.value })}
                className="input"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
              </select>
            ) : (
              <p className="text-gray-900 dark:text-white">{user.currentLanguage}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Since
            </label>
            <p className="text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Achievements & Badges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{badge}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievement unlocked</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Learning Progress
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Level Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.xp % 500}/500 XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((user.xp % 500) / 500) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Completed Lessons
              </h4>
              <p className="text-2xl font-bold text-primary-600">
                {user.completedLessons.length}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Current Streak
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {user.streak} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile