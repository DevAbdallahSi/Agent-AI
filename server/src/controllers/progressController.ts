import { Response, NextFunction } from 'express'
import User from '../models/User'
import Progress from '../models/Progress'
import { AuthRequest } from '../middleware/auth'

export const getUserProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id).select('-password')
    const progress = await Progress.find({ userId: req.user!._id })
    
    const completedLessons = progress.filter(p => p.type === 'lesson' && p.completed).length
    const completedAlgorithms = progress.filter(p => p.type === 'algorithm' && p.completed).length
    
    res.json({
      user,
      stats: {
        totalXP: user?.xp || 0,
        currentLevel: user?.level || 1,
        completedLessons,
        completedAlgorithms,
        badges: user?.badges || [],
        streak: user?.streak || 0
      },
      progress
    })
  } catch (error) {
    next(error)
  }
}

export const addXP = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body
    
    const user = await User.findById(req.user!._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    user.xp += amount
    await user.save()
    
    res.json({
      message: `Added ${amount} XP`,
      totalXP: user.xp,
      level: user.level
    })
  } catch (error) {
    next(error)
  }
}

export const awardBadge = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { badge } = req.body
    
    const user = await User.findById(req.user!._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    if (!user.badges.includes(badge)) {
      user.badges.push(badge)
      await user.save()
    }
    
    res.json({
      message: `Badge "${badge}" awarded`,
      badges: user.badges
    })
  } catch (error) {
    next(error)
  }
}

export const getLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const topUsers = await User.find()
      .select('name level xp badges')
      .sort({ xp: -1 })
      .limit(10)
    
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      level: user.level,
      xp: user.xp,
      badges: user.badges.length
    }))
    
    res.json(leaderboard)
  } catch (error) {
    next(error)
  }
}