'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CombinedRouteOptimizerPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new comprehensive route optimizer
    router.replace('/comprehensive-route-optimizer')
  }, [router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-400">Redirecting to Comprehensive Route Optimizer...</p>
      </div>
    </div>
  )
}
