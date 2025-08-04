'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  const handleLanguageChange = (newLocale: 'en' | 'vi') => {
    setLocale(newLocale)
    // Force a page refresh to ensure all components update
    window.location.reload()
  }

  return (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md border border-gray-200">
      <Globe className="h-4 w-4 text-gray-500 ml-2" />
      
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        🇺🇸 EN
      </button>
      
      <button
        onClick={() => handleLanguageChange('vi')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          locale === 'vi'
            ? 'bg-red-600 text-white shadow-md'
            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        🇻🇳 VI
      </button>
    </div>
  )
}
