'use client'

import React, { useState, useEffect } from 'react'
import { Locale, defaultLocale } from './config'
import enTranslations from './translations/en.json'
import viTranslations from './translations/vi.json'

const translations = {
  en: enTranslations,
  vi: viTranslations
}

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Get locale from localStorage or browser
    const savedLocale = localStorage.getItem('logiai_locale') as Locale
    if (savedLocale && ['en', 'vi'].includes(savedLocale)) {
      setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('vi')) {
        setLocale('vi')
        localStorage.setItem('logiai_locale', 'vi')
      }
    }
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('logiai_locale', newLocale)
    // Trigger a re-render by updating state
    window.dispatchEvent(new Event('languageChanged'))
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found in fallback
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return {
    locale,
    changeLocale,
    t
  }
}

// Simple provider component for compatibility
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children)
}
