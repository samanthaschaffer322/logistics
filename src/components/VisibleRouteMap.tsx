'use client'

import React from 'react'
import { MapPin, Navigation, ArrowRight } from 'lucide-react'

interface VisibleRouteMapProps {
  selectedRoute?: string
  className?: string
}

const VisibleRouteMap: React.FC<VisibleRouteMapProps> = ({
  selectedRoute = 'cat-lai-chim-en',
  className = ''
}) => {
  const routeData = {
    'cat-lai-chim-en': {
      name: 'Cát Lái → Chim Én',
      origin: 'Cảng Cát Lái',
      destination: 'Chim Én',
      distance: '25 km',
      time: '1.25h',
      color: '#22c55e',
      waypoints: ['Đồng Văn Cống', 'Võ Chí Công', 'Nguyễn Văn Linh']
    },
    'vung-tau-long-an': {
      name: 'Vũng Tàu → Long An',
      origin: 'Cảng Vũng Tàu',
      destination: 'Long An',
      distance: '120 km',
      time: '3.0h',
      color: '#3b82f6',
      waypoints: ['QL51', 'QL1A']
    },
    'chim-en-cp-tien-giang': {
      name: 'Chim Én → CP Tiền Giang',
      origin: 'Chim Én',
      destination: 'CP Tiền Giang',
      distance: '85 km',
      time: '2.5h',
      color: '#f59e0b',
      waypoints: ['QL50', 'QL57']
    },
    'chim-en-rico-hau-giang': {
      name: 'Chim Én → Rico Hậu Giang',
      origin: 'Chim Én',
      destination: 'Rico Hậu Giang',
      distance: '180 km',
      time: '5.0h',
      color: '#ef4444',
      waypoints: ['QL1A', 'QL80']
    }
  }

  const currentRoute = routeData[selectedRoute as keyof typeof routeData] || routeData['cat-lai-chim-en']

  return (
    <div className={`relative ${className}`}>
      {/* Main Map Container - Always Visible */}
      <div className="w-full h-[400px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-600 p-6 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Bản Đồ Tuyến Đường</h3>
              <p className="text-slate-400 text-sm">Hiển thị trực quan tuyến đường</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: currentRoute.color }}></div>
            <span className="text-slate-300 text-sm">Đang hoạt động</span>
          </div>
        </div>

        {/* Route Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            
            {/* Route Path */}
            <div className="relative">
              
              {/* Origin */}
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="ml-4 bg-slate-700/50 rounded-lg p-3 flex-1">
                  <div className="text-green-400 font-medium">Điểm xuất phát</div>
                  <div className="text-white">{currentRoute.origin}</div>
                </div>
              </div>

              {/* Waypoints */}
              {currentRoute.waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center mb-4 ml-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="ml-4 bg-slate-700/30 rounded-lg p-2 flex-1">
                    <div className="text-blue-400 text-sm">Điểm trung gian {index + 1}</div>
                    <div className="text-slate-300 text-sm">{waypoint}</div>
                  </div>
                  {index < currentRoute.waypoints.length - 1 && (
                    <div className="absolute left-2 w-0.5 h-8 bg-slate-600 mt-6"></div>
                  )}
                </div>
              ))}

              {/* Destination */}
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="ml-4 bg-slate-700/50 rounded-lg p-3 flex-1">
                  <div className="text-red-400 font-medium">Điểm đến</div>
                  <div className="text-white">{currentRoute.destination}</div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-red-500 opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Route Info Footer */}
        <div className="mt-6 bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{currentRoute.name}</span>
              </div>
              <div className="text-slate-400 text-sm">•</div>
              <div className="text-slate-300 text-sm">{currentRoute.distance}</div>
              <div className="text-slate-400 text-sm">•</div>
              <div className="text-slate-300 text-sm">{currentRoute.time}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">Tối ưu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
        <h4 className="text-white font-medium text-sm mb-2">Chú thích</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span className="text-slate-300">Xuất phát</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
            <span className="text-slate-300">Trung gian</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            <span className="text-slate-300">Đích đến</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisibleRouteMap
