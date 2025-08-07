'use client'

import React from 'react'
import Layout from '@/components/Layout'
import InteractiveMap from '@/components/InteractiveMap'
import { Map } from 'lucide-react'

const InteractiveMapPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Map className="w-8 h-8 text-indigo-400" />
              Interactive Vietnam Logistics Map
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time tracking and route optimization for Vietnamese logistics operations
            </p>
          </div>
        </div>

        {/* Interactive Map */}
        <InteractiveMap />
      </div>
    </Layout>
  )
}

export default InteractiveMapPage
