import React from 'react'
import { Leaf, Award, Calendar, TrendingUp, MessageSquare } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getProfile, getRecentActions } from '../../lib/database'
import type { Profile, Action } from '../../lib/database'

interface HomePageProps {
  onNavigateToChat?: () => void
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToChat }) => {
  const { user } = useAuth()
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [recentActions, setRecentActions] = React.useState<Action[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return
    
    try {
      const [profileData, actionsData] = await Promise.all([
        getProfile(user.id),
        getRecentActions(user.id, 3)
      ])
      
      setProfile(profileData)
      setRecentActions(actionsData)
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 animate-pulse rounded-2xl h-32"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
          <div className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-green-100 mb-4">Keep making a difference for our planet</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span className="font-medium">Level {profile?.level || 1} Eco-Warrior</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="font-medium">{profile?.streak_days || 0} Day Streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-green-100 rounded-lg p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Total Actions</h3>
              <p className="text-2xl font-bold text-green-600">{profile?.total_actions || 0}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Keep it up!</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">This Month</h3>
              <p className="text-2xl font-bold text-blue-600">{recentActions.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Recent actions</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 rounded-full p-2">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Log a Sustainable Action</h4>
                <p className="text-sm text-gray-600">Take a photo and verify your impact</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={onNavigateToChat}
            className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Get Sustainability Tips</h4>
                <p className="text-sm text-gray-600">Chat with our AI assistant</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        {recentActions.length > 0 ? (
          <div className="space-y-4">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(action.created_at).toLocaleDateString()} • {action.sdg_category}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {action.verified ? 'Verified' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No actions yet. Start by logging your first sustainable action!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage