import express from 'express'
import { body, param } from 'express-validator'
import { 
  getAlgorithms, 
  getAlgorithm, 
  getAlgorithmsByCategory,
  completeAlgorithm,
  starAlgorithm,
  unstarAlgorithm
} from '../controllers/algorithmController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = express.Router()

// Validation rules
const algorithmIdValidation = [
  param('id').isMongoId().withMessage('Invalid algorithm ID')
]

const categoryValidation = [
  param('category').isIn(['sorting', 'searching', 'graphs', 'dp', 'trees', 'greedy']).withMessage('Invalid category')
]

const completeAlgorithmValidation = [
  body('solution').isString().withMessage('Solution must be a string'),
  body('timeComplexity').isString().withMessage('Time complexity must be a string')
]

// Routes
router.get('/', authenticate, getAlgorithms)
router.get('/category/:category', authenticate, categoryValidation, validate, getAlgorithmsByCategory)
router.get('/:id', authenticate, algorithmIdValidation, validate, getAlgorithm)
router.post('/:id/complete', authenticate, algorithmIdValidation, completeAlgorithmValidation, validate, completeAlgorithm)
router.post('/:id/star', authenticate, algorithmIdValidation, validate, starAlgorithm)
router.delete('/:id/star', authenticate, algorithmIdValidation, validate, unstarAlgorithm)

export default router