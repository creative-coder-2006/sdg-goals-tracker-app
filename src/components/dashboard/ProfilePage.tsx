import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LogOut, Settings, Award, Target, Users, HelpCircle } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.user_metadata?.username || 'User'}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">124</p>
            <p className="text-sm text-gray-600">Actions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">15</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">5</p>
            <p className="text-sm text-gray-600">Level</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Settings</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Award className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Achievements</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Target className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Goals</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Leaderboard</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Help & Support</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage