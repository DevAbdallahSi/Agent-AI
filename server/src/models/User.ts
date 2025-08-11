import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  level: number
  xp: number
  badges: string[]
  streak: number
  completedLessons: string[]
  currentLanguage: string
  avatar?: string
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: String
  }],
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  completedLessons: [{
    type: String
  }],
  currentLanguage: {
    type: String,
    default: 'JavaScript',
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Go', 'PHP', 'C#']
  },
  avatar: {
    type: String
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Update level based on XP
userSchema.pre('save', function(next) {
  if (this.isModified('xp')) {
    this.level = Math.floor(this.xp / 500) + 1
  }
  next()
})

export default mongoose.model<IUser>('User', userSchema)