'use client'

import React from 'react'

interface TestMapProps {
  selectedRoute?: string
  className?: string
}

const TestMap: React.FC<TestMapProps> = ({
  selectedRoute = 'cat-lai-chim-en',
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      {/* Very obvious, bright test element */}
      <div className="w-full h-[400px] bg-red-500 border-4 border-yellow-400 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-4xl font-bold text-white mb-4">MAP IS HERE!</h1>
          <h2 className="text-2xl text-yellow-200 mb-4">Bản đồ đang hiển thị</h2>
          <div className="bg-white text-black p-4 rounded-lg text-xl font-bold">
            Route: {selectedRoute}
          </div>
          <div className="mt-4 text-white text-lg">
            If you see this, the map component is working!
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestMap
