import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)

export interface ActionAnalysis {
  action: string
  sdgCategory: string
  confidence: number
  description: string
}

export interface ChatResponse {
  response: string
}

// Analyze uploaded image for sustainable actions
export async function analyzeActionImage(imageFile: File): Promise<ActionAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    // Convert file to base64
    const imageData = await fileToGenerativePart(imageFile)
    
    const prompt = `
    Analyze this image and determine if it shows a sustainable action related to the UN Sustainable Development Goals (SDGs).
    
    Respond with a JSON object containing:
    - action: Brief description of the sustainable action shown (e.g., "Using reusable water bottle")
    - sdgCategory: The most relevant SDG category (choose from: "Climate Action", "Clean Water", "Sustainable Cities", "Responsible Consumption", "Life on Land", "Life Below Water", "Good Health", "Quality Education", "No Poverty", "Zero Hunger", "Gender Equality", "Affordable Energy", "Economic Growth", "Industry Innovation", "Reduced Inequalities", "Peace and Justice", "Partnerships")
    - confidence: Confidence score from 0-100 indicating how certain you are this is a sustainable action
    - description: Detailed explanation of why this action supports sustainability and the SDGs
    
    If the image doesn't clearly show a sustainable action, set confidence to 0 and explain why.
    `
    
    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback if JSON parsing fails
    return {
      action: "Sustainable action detected",
      sdgCategory: "Climate Action",
      confidence: 50,
      description: "Image analysis completed but detailed parsing failed."
    }
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw new Error('Failed to analyze image. Please try again.')
  }
}

// Chat with Gemini about sustainability
export async function chatWithGemini(message: string): Promise<ChatResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const systemPrompt = `
    You are a helpful sustainability assistant focused on the UN Sustainable Development Goals (SDGs). 
    Your role is to provide practical, actionable advice on sustainable living, environmental protection, 
    and contributing to the SDGs in daily life.
    
    Guidelines:
    - Keep responses concise but informative (2-3 sentences max)
    - Focus on practical actions people can take
    - Reference relevant SDGs when appropriate
    - Be encouraging and positive
    - Provide specific, actionable tips
    `
    
    const prompt = `${systemPrompt}\n\nUser question: ${message}`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    
    return {
      response: response.text()
    }
  } catch (error) {
    console.error('Error chatting with Gemini:', error)
    throw new Error('Failed to get response. Please try again.')
  }
}

// Helper function to convert file to format needed by Gemini
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      resolve(base64String.split(',')[1]) // Remove data:image/jpeg;base64, prefix
    }
    reader.readAsDataURL(file)
  })
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  }
}