import express from 'express'
import { body } from 'express-validator'
import multer from 'multer'
import { 
  sendMessage, 
  reviewCode, 
  explainCode, 
  generateHint,
  voiceInteraction
} from '../controllers/aiController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Validation rules
const sendMessageValidation = [
  body('message').isString().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('codeSnippet').optional().isString().withMessage('Code snippet must be a string')
]

const reviewCodeValidation = [
  body('code').isString().isLength({ min: 1 }).withMessage('Code is required'),
  body('language').isString().isLength({ min: 1 }).withMessage('Language is required')
]

const explainCodeValidation = [
  body('code').isString().isLength({ min: 1 }).withMessage('Code is required'),
  body('language').isString().isLength({ min: 1 }).withMessage('Language is required')
]

const generateHintValidation = [
  body('problem').isString().isLength({ min: 1 }).withMessage('Problem description is required'),
  body('userCode').isString().withMessage('User code must be a string')
]

// Routes
router.post('/chat', authenticate, sendMessageValidation, validate, sendMessage)
router.post('/code-review', authenticate, reviewCodeValidation, validate, reviewCode)
router.post('/explain-code', authenticate, explainCodeValidation, validate, explainCode)
router.post('/hint', authenticate, generateHintValidation, validate, generateHint)
router.post('/voice', authenticate, upload.single('audio'), voiceInteraction)

export default router