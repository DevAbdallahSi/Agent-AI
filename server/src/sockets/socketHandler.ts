import { Socket, Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User'

interface AuthenticatedSocket extends Socket {
  userId?: string
}

export const handleSocketConnection = (socket: AuthenticatedSocket, io: Server) => {
  console.log('New socket connection:', socket.id)

  // Authenticate socket connection
  socket.on('authenticate', async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      const user = await User.findById(decoded.userId)
      
      if (user) {
        socket.userId = user._id.toString()
        socket.join(`user_${user._id}`)
        socket.emit('authenticated', { success: true })
        console.log(`User ${user.name} authenticated on socket ${socket.id}`)
      } else {
        socket.emit('authenticated', { success: false, message: 'Invalid token' })
      }
    } catch (error) {
      socket.emit('authenticated', { success: false, message: 'Authentication failed' })
    }
  })

  // Handle real-time AI chat
  socket.on('ai_message', async (data: { message: string, codeSnippet?: string }) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }

    try {
      // Mock AI response - in a real app, you'd call your AI service
      const aiResponse = `AI Response to: "${data.message}"`
      
      socket.emit('ai_response', {
        message: aiResponse,
        timestamp: new Date()
      })
    } catch (error) {
      socket.emit('error', { message: 'Failed to get AI response' })
    }
  })

  // Handle code collaboration
  socket.on('code_change', (data: { lessonId: string, code: string }) => {
    if (!socket.userId) return
    
    // Broadcast code changes to other users in the same lesson (for collaborative features)
    socket.to(`lesson_${data.lessonId}`).emit('code_updated', {
      userId: socket.userId,
      code: data.code,
      timestamp: new Date()
    })
  })

  // Join lesson room for collaboration
  socket.on('join_lesson', (lessonId: string) => {
    if (!socket.userId) return
    
    socket.join(`lesson_${lessonId}`)
    socket.to(`lesson_${lessonId}`).emit('user_joined', {
      userId: socket.userId,
      timestamp: new Date()
    })
  })

  // Leave lesson room
  socket.on('leave_lesson', (lessonId: string) => {
    if (!socket.userId) return
    
    socket.leave(`lesson_${lessonId}`)
    socket.to(`lesson_${lessonId}`).emit('user_left', {
      userId: socket.userId,
      timestamp: new Date()
    })
  })

  // Handle voice agent interactions
  socket.on('voice_start', () => {
    if (!socket.userId) return
    
    socket.emit('voice_ready', { message: 'Voice agent is ready' })
  })

  socket.on('voice_end', () => {
    if (!socket.userId) return
    
    socket.emit('voice_stopped', { message: 'Voice agent stopped' })
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
    
    if (socket.userId) {
      // Notify other users that this user disconnected
      socket.broadcast.emit('user_disconnected', {
        userId: socket.userId,
        timestamp: new Date()
      })
    }
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })
}