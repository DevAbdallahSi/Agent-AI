import { Response, NextFunction } from 'express'
import Lesson from '../models/Lesson'
import Progress from '../models/Progress'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'

export const getLessons = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 })
    
    // Get user's progress for each lesson
    const userProgress = await Progress.find({
      userId: req.user!._id,
      type: 'lesson'
    })

    // Add completion status to lessons
    const lessonsWithProgress = lessons.map(lesson => {
      const progress = userProgress.find(p => p.lessonId?.toString() === lesson._id.toString())
      return {
        ...lesson.toObject(),
        completed: progress?.completed || false
      }
    })

    res.json(lessonsWithProgress)
  } catch (error) {
    next(error)
  }
}

export const getLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    // Check if user has completed this lesson
    const progress = await Progress.findOne({
      userId: req.user!._id,
      lessonId: lesson._id,
      type: 'lesson'
    })

    const lessonWithProgress = {
      ...lesson.toObject(),
      completed: progress?.completed || false
    }

    res.json(lessonWithProgress)
  } catch (error) {
    next(error)
  }
}

export const completeLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { score } = req.body
    const lessonId = req.params.id

    // Find or create progress record
    let progress = await Progress.findOne({
      userId: req.user!._id,
      lessonId,
      type: 'lesson'
    })

    if (!progress) {
      progress = new Progress({
        userId: req.user!._id,
        lessonId,
        type: 'lesson'
      })
    }

    // Update progress
    progress.completed = true
    progress.score = Math.max(progress.score, score)
    progress.completedAt = new Date()
    await progress.save()

    // Update user's completed lessons and XP
    const user = await User.findById(req.user!._id)
    if (user && !user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId)
      user.xp += 100 // Base XP for completing a lesson
      user.xp += Math.floor(score / 10) * 10 // Bonus XP based on score
      await user.save()
    }

    res.json({ message: 'Lesson completed successfully', progress })
  } catch (error) {
    next(error)
  }
}

export const saveProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { stepIndex, code } = req.body
    const lessonId = req.params.id

    // This would typically save the user's progress on a specific step
    // For now, we'll just acknowledge the save
    res.json({ message: 'Progress saved successfully' })
  } catch (error) {
    next(error)
  }
}

export const getLessonProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lessonId = req.params.id
    
    const progress = await Progress.findOne({
      userId: req.user!._id,
      lessonId,
      type: 'lesson'
    })

    res.json(progress || { completed: false, score: 0 })
  } catch (error) {
    next(error)
  }
}