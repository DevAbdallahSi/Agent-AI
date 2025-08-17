import { Response, NextFunction } from 'express'
import Lesson from '../models/Lesson'
import Progress from '../models/Progress'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'

export const getLessons = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const lessons = await Lesson.find().sort({ createdAt: -1 })

        const userProgress = await Progress.find({
            userId: req.user!._id,
            type: 'lesson'
        })

        const lessonsWithProgress = lessons.map(lesson => {
            const progress = userProgress.find(p => p.lessonId?.toString() === lesson._id.toString())
            return {
                ...lesson.toObject(),
                completed: progress?.completed || false
            }
        })

        return res.json(lessonsWithProgress)  // <== return here
    } catch (error) {
        next(error)
        return  // <== return here
    }
}

export const getLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' })  // <== return here
        }

        const progress = await Progress.findOne({
            userId: req.user!._id,
            lessonId: lesson._id,
            type: 'lesson'
        })

        const lessonWithProgress = {
            ...lesson.toObject(),
            completed: progress?.completed || false
        }

        return res.json(lessonWithProgress)  // <== return here
    } catch (error) {
        next(error)
        return  // <== return here
    }
}

export const completeLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { score } = req.body
        const lessonId = req.params.id

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

        progress.completed = true
        progress.score = Math.max(progress.score, score)
        progress.completedAt = new Date()
        await progress.save()

        const user = await User.findById(req.user!._id)
        if (user && !user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId)
            user.xp += 100
            user.xp += Math.floor(score / 10) * 10
            await user.save()
        }

        return res.json({ message: 'Lesson completed successfully', progress })  // <== return here
    } catch (error) {
        next(error)
        return  // <== return here
    }
}

export const saveProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { stepIndex, code } = req.body
        const lessonId = req.params.id

        return res.json({ message: 'Progress saved successfully' })  // <== return here
    } catch (error) {
        next(error)
        return  // <== return here
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

        return res.json(progress || { completed: false, score: 0 })  // <== return here
    } catch (error) {
        next(error)
        return  // <== return here
    }
}
