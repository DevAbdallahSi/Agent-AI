import express from 'express'
import { body, param } from 'express-validator'
import { 
  getLessons, 
  getLesson, 
  completeLesson, 
  saveProgress, 
  getLessonProgress 
} from '../controllers/lessonController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = express.Router()

// Validation rules
const lessonIdValidation = [
  param('id').isMongoId().withMessage('Invalid lesson ID')
]

const completeLessonValidation = [
  body('score').isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100')
]

const saveProgressValidation = [
  body('stepIndex').isInt({ min: 0 }).withMessage('Step index must be a non-negative integer'),
  body('code').isString().withMessage('Code must be a string')
]

// Routes
router.get('/', authenticate, getLessons)
router.get('/:id', authenticate, lessonIdValidation, validate, getLesson)
router.post('/:id/complete', authenticate, lessonIdValidation, completeLessonValidation, validate, completeLesson)
router.post('/:id/progress', authenticate, lessonIdValidation, saveProgressValidation, validate, saveProgress)
router.get('/:id/progress', authenticate, lessonIdValidation, validate, getLessonProgress)

export default router