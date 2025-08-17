import express from 'express'
import { body } from 'express-validator'
import { 
  getUserProgress, 
  addXP, 
  awardBadge,
  getLeaderboard
} from '../controllers/progressController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = express.Router()

// Validation rules
const addXPValidation = [
  body('amount').isInt({ min: 1, max: 1000 }).withMessage('XP amount must be between 1 and 1000')
]

const awardBadgeValidation = [
  body('badge').isString().isLength({ min: 1, max: 100 }).withMessage('Badge name must be between 1 and 100 characters')
]

// Routes
router.get('/', authenticate, getUserProgress)
router.post('/xp', authenticate, addXPValidation, validate, addXP)
router.post('/badge', authenticate, awardBadgeValidation, validate, awardBadge)
router.get('/leaderboard', authenticate, getLeaderboard)

export default router