import React from 'react'
import { ArrowLeft, TrendingUp } from 'lucide-react'

interface ProgressPageProps {
  onBack: () => void
}

const ProgressPage: React.FC<ProgressPageProps> = ({ onBack }) => {
  const weeklyData = [60, 45, 70, 55, 80, 65, 75]
  const maxValue = Math.max(...weeklyData)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">My Progress</h1>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Consistency</h2>
        
        <div className="mb-6">
          <div className="flex items-end space-x-2 mb-4">
            <span className="text-3xl font-bold text-gray-900">80%</span>
            <span className="text-sm text-green-600 font-medium">+10%</span>
          </div>
          <p className="text-sm text-gray-600">Last 30 days</p>
        </div>

        <div className="relative h-32 flex items-end space-x-2 mb-4">
          {weeklyData.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-200 rounded-t-sm transition-all duration-300"
                style={{
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: '8px',
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Action Categories</h2>
        
        <div className="mb-6">
          <div className="flex items-end space-x-2 mb-4">
            <span className="text-3xl font-bold text-gray-900">100</span>
          </div>
          <p className="text-sm text-gray-600">Total Actions</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Education</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="text-sm text-gray-600">30</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Health</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-sm text-gray-600">24</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Environment</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-sm text-gray-600">34</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Community</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
              </div>
              <span className="text-sm text-gray-600">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage