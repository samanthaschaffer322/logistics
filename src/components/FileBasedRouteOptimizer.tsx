'use client'

import React, { useState } from 'react'
import { VietnameseRouteLearner } from '@/lib/file-learning/vietnamese-route-learner'

export default function FileBasedRouteOptimizer() {
  const [learnedRoutes, setLearnedRoutes] = useState<any[]>([])
  const [isLearning, setIsLearning] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsLearning(true)
    
    try {
      const learner = new VietnameseRouteLearner()
      const routes = await learner.learnFromFiles(files)
      setLearnedRoutes(routes)
      
      console.log('🎓 Learned routes from your files:', routes)
    } catch (error) {
      console.error('❌ Learning failed:', error)
    }
    
    setIsLearning(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
      <h3 className="text-2xl font-bold text-blue-600 mb-4">
        🎓 Học từ File Logistics Của Bạn
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload các file BKVC, BK CHI PHÍ của công ty:
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {isLearning && (
        <div className="text-center py-4">
          <div className="text-blue-600">🔄 Đang học từ files của bạn...</div>
        </div>
      )}

      {learnedRoutes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3">📊 Tuyến đường thường đi:</h4>
          <div className="space-y-2">
            {learnedRoutes.map((route, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-800">{route.route}</div>
                <div className="text-sm text-gray-600">
                  Tần suất: {route.frequency} lần | 
                  Chi phí tối ưu: {route.optimizedCost.toLocaleString('vi-VN')} VND | 
                  Thời gian: {route.recommendedTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
