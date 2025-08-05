'use client'

import React, { useState, useEffect } from 'react'
import { useEnhancedTranslation } from '@/lib/i18n/enhanced-translation'
import { Globe, Check, RefreshCw } from 'lucide-react'

interface LanguageSwitcherProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact' | 'dropdown'
}

export default function LanguageSwitcher({ 
  className = '', 
  showLabel = true, 
  variant = 'default' 
}: LanguageSwitcherProps) {
  const { locale, setLocale, isLoading, t } = useEnhancedTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' }
  ]

  const handleLanguageChange = async (newLocale: 'en' | 'vi') => {
    if (newLocale === locale || isLoading) return
    
    setIsTransitioning(true)
    setIsDropdownOpen(false)
    
    try {
      await setLocale(newLocale)
      
      // Force page refresh for complete language switch
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Language switch error:', error)
    } finally {
      setIsTransitioning(false)
    }
  }

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as 'en' | 'vi')}
            disabled={isLoading || isTransitioning}
            className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
              locale === lang.code
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            } ${(isLoading || isTransitioning) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {(isLoading || isTransitioning) && locale === lang.code ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <span className="flex items-center space-x-1">
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading || isTransitioning}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
            (isLoading || isTransitioning) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage.flag} {currentLanguage.nativeName}
          </span>
          {(isLoading || isTransitioning) && (
            <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as 'en' | 'vi')}
                disabled={isLoading || isTransitioning}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  locale === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </div>
                </div>
                {locale === lang.code && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Globe className="h-4 w-4" />
          <span>{t('navigation.language')}:</span>
        </div>
      )}
      <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as 'en' | 'vi')}
            disabled={isLoading || isTransitioning}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              locale === lang.code
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            } ${(isLoading || isTransitioning) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {(isLoading || isTransitioning) && locale === lang.code ? (
              <div className="flex items-center space-x-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Hook for programmatic language switching
export function useLanguageSwitcher() {
  const { locale, setLocale, isLoading } = useEnhancedTranslation()
  
  const switchLanguage = async (newLocale: 'en' | 'vi') => {
    if (newLocale === locale || isLoading) return
    
    try {
      await setLocale(newLocale)
      // Force refresh for complete language switch
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Language switch error:', error)
    }
  }

  return {
    currentLanguage: locale,
    switchLanguage,
    isLoading
  }
}
