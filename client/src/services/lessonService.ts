import { api } from './api'
import { Lesson } from '../types'

export const lessonService = {
  async getLessons(): Promise<Lesson[]> {
    const response = await api.get('/lessons')
    return response.data
  },

  async getLesson(id: string): Promise<Lesson> {
    const response = await api.get(`/lessons/${id}`)
    return response.data
  },

  async completeLesson(id: string, score: number): Promise<void> {
    await api.post(`/lessons/${id}/complete`, { score })
  },

  async saveProgress(lessonId: string, stepIndex: number, code: string): Promise<void> {
    await api.post(`/lessons/${lessonId}/progress`, { stepIndex, code })
  },

  async getLessonProgress(lessonId: string): Promise<any> {
    const response = await api.get(`/lessons/${lessonId}/progress`)
    return response.data
  }
}