import mongoose, { Document, Schema } from 'mongoose'

export interface IAlgorithm extends Document {
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeComplexity: string
  spaceComplexity: string
  description: string
  implementation: string
  explanation: string
  estimatedTime: number
  createdAt: Date
  updatedAt: Date
}

const algorithmSchema = new Schema<IAlgorithm>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sorting', 'searching', 'graphs', 'dp', 'trees', 'greedy']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  timeComplexity: {
    type: String,
    required: true
  },
  spaceComplexity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  implementation: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  estimatedTime: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
})

export default mongoose.model<IAlgorithm>('Algorithm', algorithmSchema)