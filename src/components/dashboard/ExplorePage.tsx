import React from 'react'
import { Search, Filter, TrendingUp, Award, Users, Calendar } from 'lucide-react'

const ExplorePage: React.FC = () => {
  const sdgGoals = [
    { id: 1, title: "No Poverty", color: "bg-red-500", actions: 45 },
    { id: 2, title: "Zero Hunger", color: "bg-yellow-500", actions: 32 },
    { id: 3, title: "Good Health", color: "bg-green-500", actions: 67 },
    { id: 4, title: "Quality Education", color: "bg-blue-500", actions: 28 },
    { id: 5, title: "Gender Equality", color: "bg-pink-500", actions: 19 },
    { id: 6, title: "Clean Water", color: "bg-cyan-500", actions: 53 },
  ]

  const featuredActions = [
    {
      id: 1,
      title: "Community Garden Project",
      description: "Join local gardening initiative",
      participants: 124,
      category: "Environment",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      title: "Plastic-Free Week Challenge",
      description: "Reduce single-use plastics",
      participants: 89,
      category: "Environment",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      title: "Local Food Drive",
      description: "Help fight hunger in your community",
      participants: 67,
      category: "Community",
      color: "bg-purple-100 text-purple-800"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sustainable actions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">SDG Goals</h3>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {sdgGoals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${goal.color}`} />
                <h4 className="font-medium text-gray-900 text-sm">{goal.title}</h4>
              </div>
              <p className="text-xs text-gray-600">{goal.actions} actions</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Featured Actions</h3>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {featuredActions.map((action) => (
            <div key={action.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${action.color}`}>
                    {action.category}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{action.participants}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>This week</span>
                  </div>
                </div>
                
                <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Weekly Challenge</h3>
        </div>
        <p className="text-green-100 mb-4">
          Complete 5 sustainable actions this week to earn the "Eco Champion" badge!
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="font-medium">Progress: 3/5</span>
          </div>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Join Challenge
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage