import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  username: string
  level: number
  streak_days: number
  total_actions: number
  created_at: string
  updated_at: string
}

export interface Action {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string
  sdg_category: string
  image_url: string | null
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

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
  
  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`)
  }
}

// Action functions
export async function createAction(action: Omit<Action, 'id' | 'created_at'>): Promise<Action> {
  const { data, error } = await supabase
    .from('actions')
    .insert(action)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create action: ${error.message}`)
  }
  
  return data
}

export async function getUserActions(userId: string): Promise<Action[]> {
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch actions: ${error.message}`)
  }
  
  return data || []
}

export async function getRecentActions(userId: string, limit: number = 5): Promise<Action[]> {
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw new Error(`Failed to fetch recent actions: ${error.message}`)
  }
  
  return data || []
}

// Chat functions
export async function saveChatMessage(
  userId: string,
  message: string,
  response: string
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      message,
      response
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to save chat message: ${error.message}`)
  }
  
  return data
}

export async function getChatHistory(userId: string, limit: number = 10): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw new Error(`Failed to fetch chat history: ${error.message}`)
  }
  
  return data || []
}

// Upload image to Supabase Storage
export async function uploadActionImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('action-images')
    .upload(fileName, file)
  
  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('action-images')
    .getPublicUrl(fileName)
  
  return publicUrl
}