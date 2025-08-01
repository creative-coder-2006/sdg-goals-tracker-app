import React from 'react'
import { Home, Search, Plus, Users, User, TrendingUp } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation