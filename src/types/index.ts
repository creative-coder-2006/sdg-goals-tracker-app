export interface User {
  id: string
  email: string
  username: string
  created_at: string
}

export interface Action {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  sdg_category: string
  image_url?: string
  confidence_score: number
  verified: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  message: string
  response: string
  created_at: string
}

export interface ProgressData {
  consistency: number
  totalActions: number
  categories: {
    [key: string]: number
  }
  weeklyData: number[]
}