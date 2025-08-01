import React, { useState } from 'react'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { chatWithGemini } from '../../lib/gemini'
import { saveChatMessage, getChatHistory } from '../../lib/database'
import type { ChatMessage as DBChatMessage } from '../../lib/database'

interface ChatPageProps {
  onBack: () => void
}

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<DBChatMessage[]>([])

  React.useEffect(() => {
    if (user) {
      loadChatHistory()
    }
  }, [user])

  const loadChatHistory = async () => {
    if (!user) return
    
    try {
      const history = await getChatHistory(user.id, 5)
      setChatHistory(history)
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }
  const suggestedPrompts = [
    "How can I reduce my carbon footprint at home?",
    "What are some sustainable travel options?",
    "Suggest eco-friendly products for daily use."
  ]

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !user) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Get response from Gemini
      const { response } = await chatWithGemini(message)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Save to database
      await saveChatMessage(user.id, message, response)
      
      // Refresh chat history
      await loadChatHistory()
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Sustainability Chat</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700 mb-4">
                Welcome to your personal sustainability assistant! Ask me anything about sustainable living, or choose a prompt below.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Suggested Prompts</h3>
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-left transition-colors"
                >
                  <p className="text-gray-800">{prompt}</p>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
              {chatHistory.map((chat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start space-x-3 mb-3">
                    <MessageCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">User: {chat.message}</p>
                      <p className="text-gray-600 text-sm mt-1">Assistant: {chat.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage