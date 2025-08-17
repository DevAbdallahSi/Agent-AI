import { Response, NextFunction } from 'express'
import Algorithm from '../models/Algorithm'
import Progress from '../models/Progress'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'

export const getAlgorithms = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const algorithms = await Algorithm.find().sort({ createdAt: -1 })

        // Get user's progress for each algorithm
        const userProgress = await Progress.find({
            userId: req.user!._id,
            type: 'algorithm'
        })

        // Add completion status to algorithms
        const algorithmsWithProgress = algorithms.map(algorithm => {
            const progress = userProgress.find(p => p.algorithmId?.toString() === algorithm._id.toString())
            return {
                ...algorithm.toObject(),
                completed: progress?.completed || false,
                starred: false // This would come from a separate collection in a real app
            }
        })

        res.json(algorithmsWithProgress)
    } catch (error) {
        next(error)
    }
}

export const getAlgorithm = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {   // <-- change here
    try {
        const algorithm = await Algorithm.findById(req.params.id)
        if (!algorithm) {
            return res.status(404).json({ message: 'Algorithm not found' })
        }

        const progress = await Progress.findOne({
            userId: req.user!._id,
            algorithmId: algorithm._id,
            type: 'algorithm'
        })

        const algorithmWithProgress = {
            ...algorithm.toObject(),
            completed: progress?.completed || false,
            starred: false
        }

        return res.json(algorithmWithProgress)
    } catch (error) {
        next(error)
    }
}

export const getAlgorithmsByCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { category } = req.params
        const algorithms = await Algorithm.find({ category }).sort({ difficulty: 1, name: 1 })

        // Get user's progress for each algorithm
        const userProgress = await Progress.find({
            userId: req.user!._id,
            type: 'algorithm'
        })

        // Add completion status to algorithms
        const algorithmsWithProgress = algorithms.map(algorithm => {
            const progress = userProgress.find(p => p.algorithmId?.toString() === algorithm._id.toString())
            return {
                ...algorithm.toObject(),
                completed: progress?.completed || false,
                starred: false // This would come from a separate collection in a real app
            }
        })

        res.json(algorithmsWithProgress)
    } catch (error) {
        next(error)
    }
}

export const completeAlgorithm = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { solution, timeComplexity } = req.body
        const algorithmId = req.params.id

        // Find or create progress record
        let progress = await Progress.findOne({
            userId: req.user!._id,
            algorithmId,
            type: 'algorithm'
        })

        if (!progress) {
            progress = new Progress({
                userId: req.user!._id,
                algorithmId,
                type: 'algorithm'
            })
        }

        // Update progress
        progress.completed = true
        progress.score = 100 // Full score for completing an algorithm
        progress.completedAt = new Date()
        await progress.save()

        // Update user's XP
        const user = await User.findById(req.user!._id)
        if (user) {
            user.xp += 150 // XP for completing an algorithm
            await user.save()
        }

        res.json({ message: 'Algorithm completed successfully', progress })
    } catch (error) {
        next(error)
    }
}

export const starAlgorithm = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // In a real app, you'd save this to a separate collection or user preferences
        res.json({ message: 'Algorithm starred successfully' })
    } catch (error) {
        next(error)
    }
}

export const unstarAlgorithm = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // In a real app, you'd remove this from a separate collection or user preferences
        res.json({ message: 'Algorithm unstarred successfully' })
    } catch (error) {
        next(error)
    }
}