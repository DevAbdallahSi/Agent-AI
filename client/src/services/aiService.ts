import { api } from './api'

interface AIResponse {
  message: string
  codeSnippet?: string
}

interface CodeReviewResponse {
  feedback: string
  suggestions: string[]
  score: number
  errors: string[]
}

export const aiService = {
  async sendMessage(message: string, codeSnippet?: string): Promise<AIResponse> {
    const response = await api.post('/ai/chat', { message, codeSnippet })
    return response.data
  },

  async reviewCode(code: string, language: string): Promise<CodeReviewResponse> {
    const response = await api.post('/ai/code-review', { code, language })
    return response.data
  },

  async explainCode(code: string, language: string): Promise<string> {
    const response = await api.post('/ai/explain-code', { code, language })
    return response.data.explanation
  },

  async generateHint(problem: string, userCode: string): Promise<string> {
    const response = await api.post('/ai/hint', { problem, userCode })
    return response.data.hint
  },

  async voiceInteraction(audioBlob: Blob): Promise<AIResponse> {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    
    const response = await api.post('/ai/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}