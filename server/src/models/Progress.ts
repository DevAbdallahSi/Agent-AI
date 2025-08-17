import mongoose, { Document, Schema } from 'mongoose'

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId
  lessonId?: mongoose.Types.ObjectId
  algorithmId?: mongoose.Types.ObjectId
  type: 'lesson' | 'algorithm'
  completed: boolean
  score: number
  timeSpent: number
  attempts: number
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const progressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  algorithmId: {
    type: Schema.Types.ObjectId,
    ref: 'Algorithm'
  },
  type: {
    type: String,
    required: true,
    enum: ['lesson', 'algorithm']
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Compound index for efficient queries
progressSchema.index({ userId: 1, lessonId: 1 })
progressSchema.index({ userId: 1, algorithmId: 1 })

export default mongoose.model<IProgress>('Progress', progressSchema)