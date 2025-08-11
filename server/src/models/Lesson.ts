import mongoose, { Document, Schema } from 'mongoose'

export interface ILessonStep {
  id: string
  title: string
  content: string
  instruction: string
  code: string
  expected?: string
  hints?: string[]
}

export interface ILesson extends Document {
  title: string
  description: string
  language: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  rating: number
  students: number
  modules: number
  locked: boolean
  steps: ILessonStep[]
  createdAt: Date
  updatedAt: Date
}

const lessonStepSchema = new Schema<ILessonStep>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  instruction: { type: String, required: true },
  code: { type: String, required: true },
  expected: { type: String },
  hints: [{ type: String }]
})

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Go', 'PHP', 'C#']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  students: {
    type: Number,
    default: 0,
    min: 0
  },
  modules: {
    type: Number,
    required: true,
    min: 1
  },
  locked: {
    type: Boolean,
    default: false
  },
  steps: [lessonStepSchema]
}, {
  timestamps: true
})

export default mongoose.model<ILesson>('Lesson', lessonSchema)