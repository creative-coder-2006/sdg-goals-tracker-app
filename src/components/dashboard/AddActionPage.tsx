import React, { useState } from 'react'
import { X, Camera, Upload, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { analyzeActionImage } from '../../lib/gemini'
import { createAction, uploadActionImage, updateProfile, getProfile } from '../../lib/database'
import type { ActionAnalysis } from '../../lib/gemini'

interface AddActionPageProps {
  onBack: () => void
}

const AddActionPage: React.FC<AddActionPageProps> = ({ onBack }) => {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [analysis, setAnalysis] = useState<ActionAnalysis | null>(null)
  const [error, setError] = useState<string>('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerifyAction = async () => {
    if (!selectedFile || !user) return
    
    setIsUploading(true)
    setError('')
    
    try {
      // Analyze image with Gemini
      const analysisResult = await analyzeActionImage(selectedFile)
      setAnalysis(analysisResult)
      
      if (analysisResult.confidence >= 70) {
        // Upload image to storage
        const imageUrl = await uploadActionImage(selectedFile, user.id)
        
        // Save action to database
        await createAction({
          user_id: user.id,
          title: analysisResult.action,
          description: analysisResult.description,
          category: 'Environment', // Default category
          sdg_category: analysisResult.sdgCategory,
          image_url: imageUrl,
          confidence_score: analysisResult.confidence,
          verified: true
        })
        
        // Update user profile stats
        const profile = await getProfile(user.id)
        if (profile) {
          await updateProfile(user.id, {
            total_actions: profile.total_actions + 1,
            streak_days: profile.streak_days + 1 // Simplified streak logic
          })
        }
        
        setIsVerified(true)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify action')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveAction = () => {
    onBack()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Upload Image</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {!selectedImage ? (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Camera className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Capture Your Sustainable Action
              </h3>
              <p className="text-gray-600 mb-6">
                Take a photo of your sustainable action and our AI will verify it for you
              </p>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Choose Image</span>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <img
                src={selectedImage}
                alt="Uploaded sustainable action"
                className="w-full h-64 object-cover"
              />
            </div>

            {isVerified ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">
                    Action Verified!
                  </h3>
                </div>
                {analysis && (
                  <div className="space-y-2 mb-4">
                    <p className="text-green-800">
                      <strong>Action:</strong> {analysis.action}
                    </p>
                    <p className="text-green-800">
                      <strong>SDG Category:</strong> {analysis.sdgCategory}
                    </p>
                    <p className="text-green-800">
                      <strong>Confidence:</strong> {analysis.confidence}%
                    </p>
                  </div>
                )}
                <button
                  onClick={handleSaveAction}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            ) : analysis && analysis.confidence < 70 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-900">
                    Action Needs Review
                  </h3>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-green-800">
                    <strong>Action:</strong> {analysis.action}
                  </p>
                  <p className="text-green-800">
                    <strong>SDG Category:</strong> {analysis.sdgCategory}
                  </p>
                  <p className="text-green-800">
                    <strong>Confidence:</strong> {analysis.confidence}%
                  </p>
                  <p className="text-yellow-800 text-sm mt-2">
                    The AI couldn't clearly identify a sustainable action. Please try taking a clearer photo or choose a different action.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setSelectedFile(null)
                    setAnalysis(null)
                    setIsVerified(false)
                  }}
                  className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <button
                onClick={handleVerifyAction}
                disabled={isUploading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Verifying with AI...' : 'Verify Action'}
              </button>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Tips for better verification:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure good lighting in your photo</li>
                <li>• Show the sustainable action clearly</li>
                <li>• Include context when possible</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddActionPage