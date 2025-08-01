import React, { useState } from 'react'
import BottomNavigation from '../layout/BottomNavigation'
import HomePage from './HomePage'
import ExplorePage from './ExplorePage'
import AddActionPage from './AddActionPage'
import ProgressPage from './ProgressPage'
import ProfilePage from './ProfilePage'
import ChatPage from './ChatPage'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [showAddAction, setShowAddAction] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const handleTabChange = (tab: string) => {
    if (tab === 'add') {
      setShowAddAction(true)
      return
    }
    if (tab === 'progress') {
      setShowProgress(true)
      return
    }
    setActiveTab(tab)
  }

  const handleBackToHome = () => {
    setShowAddAction(false)
    setShowProgress(false)
    setShowChat(false)
    setActiveTab('home')
  }

  const handleNavigateToChat = () => {
    setShowChat(true)
  }

  if (showAddAction) {
    return <AddActionPage onBack={handleBackToHome} />
  }

  if (showProgress) {
    return <ProgressPage onBack={handleBackToHome} />
  }

  if (showChat) {
    return <ChatPage onBack={handleBackToHome} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigateToChat={handleNavigateToChat} />
      case 'explore':
        return <ExplorePage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage onNavigateToChat={handleNavigateToChat} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        {renderContent()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

export default Dashboard