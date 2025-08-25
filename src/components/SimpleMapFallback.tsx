'use client'

import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

interface SimpleMapFallbackProps {
  selectedRoute?: string
  className?: string
}

const SimpleMapFallback: React.FC<SimpleMapFallbackProps> = ({
  selectedRoute = 'cat-lai-chim-en',
  className = ''
}) => {
  const routeInfo = {
    'cat-lai-chim-en': {
      name: 'Cát Lái → Chim Én',
      distance: '25 km',
      time: '1.25h',
      color: 'bg-green-500'
    },
    'vung-tau-long-an': {
      name: 'Vũng Tàu → Long An',
      distance: '120 km',
      time: '3.0h',
      color: 'bg-blue-500'
    },
    'chim-en-cp-tien-giang': {
      name: 'Chim Én → CP Tiền Giang',
      distance: '85 km',
      time: '2.5h',
      color: 'bg-yellow-500'
    },
    'chim-en-rico-hau-giang': {
      name: 'Chim Én → Rico Hậu Giang',
      distance: '180 km',
      time: '5.0h',
      color: 'bg-red-500'
    }
  }

  const currentRoute = routeInfo[selectedRoute as keyof typeof routeInfo] || routeInfo['cat-lai-chim-en']

  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex flex-col items-center justify-center p-8 border border-slate-600">
        {/* Map Placeholder */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <MapPin className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Bản Đồ Tương Tác</h3>
          <p className="text-slate-400 text-sm">Đang tải Leaflet.js map...</p>
        </div>

        {/* Route Visualization */}
        <div className="w-full max-w-md bg-slate-800/50 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Tuyến đường hiện tại</h4>
            <div className={`w-3 h-3 rounded-full ${currentRoute.color}`}></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300 text-sm">Điểm xuất phát</span>
            </div>
            
            <div className="flex items-center space-x-3 ml-2">
              <div className="w-0.5 h-8 bg-slate-600"></div>
              <div className="flex-1">
                <div className="text-white font-medium">{currentRoute.name}</div>
                <div className="text-slate-400 text-sm">{currentRoute.distance} • {currentRoute.time}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300 text-sm">Điểm đến</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center space-x-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Đang khởi tạo bản đồ Leaflet.js...</span>
        </div>
      </div>
    </div>
  )
}

export default SimpleMapFallback
