import { api } from './api'
import { Algorithm } from '../types'

export const algorithmService = {
  async getAlgorithms(): Promise<Algorithm[]> {
    const response = await api.get('/algorithms')
    return response.data
  },

  async getAlgorithm(id: string): Promise<Algorithm> {
    const response = await api.get(`/algorithms/${id}`)
    return response.data
  },

  async completeAlgorithm(id: string, solution: string, timeComplexity: string): Promise<void> {
    await api.post(`/algorithms/${id}/complete`, { solution, timeComplexity })
  },

  async getAlgorithmsByCategory(category: string): Promise<Algorithm[]> {
    const response = await api.get(`/algorithms/category/${category}`)
    return response.data
  },

  async starAlgorithm(id: string): Promise<void> {
    await api.post(`/algorithms/${id}/star`)
  },

  async unstarAlgorithm(id: string): Promise<void> {
    await api.delete(`/algorithms/${id}/star`)
  }
}