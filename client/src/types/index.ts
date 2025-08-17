export interface User {
  _id: string
  name: string
  email: string
  level: number
  xp: number
  badges: string[]
  streak: number
  completedLessons: string[]
  currentLanguage: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  _id: string
  title: string
  description: string
  language: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  rating: number
  students: number
  modules: number
  locked: boolean
  completed: boolean
  steps: LessonStep[]
  createdAt: string
  updatedAt: string
}

export interface LessonStep {
  id: string
  title: string
  content: string
  instruction: string
  code: string
  expected?: string
  hints?: string[]
}

export interface Algorithm {
  _id: string
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeComplexity: string
  spaceComplexity: string
  description: string
  completed: boolean
  starred: boolean
  estimatedTime: number
  implementation: string
  explanation: string
  visualizations?: AlgorithmVisualization[]
}

export interface AlgorithmVisualization {
  id: string
  type: 'animation' | 'interactive' | 'simulation'
  title: string
  description: string
  data: any
}

export interface AIMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  language?: string
  codeSnippet?: string
}

export interface Progress {
  _id: string
  userId: string
  totalXP: number
  currentLevel: number
  completedLessons: string[]
  completedAlgorithms: string[]
  badges: Badge[]
  streak: number
  lastActivity: string
  weeklyGoal: number
  weeklyProgress: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface CodeExecution {
  code: string
  language: string
  input?: string
  expectedOutput?: string
}

export interface CodeResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
  memoryUsage: number
}

export interface VoiceSettings {
  language: string
  voice: string
  speed: number
  pitch: number
  volume: number
}

export interface LeaderboardEntry {
  userId: string
  name: string
  avatar?: string
  level: number
  xp: number
  rank: number
  badges: number
}