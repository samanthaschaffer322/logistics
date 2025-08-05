'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations } from './translations'

type Locale = 'en' | 'vi'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('logiai_locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('logiai_locale', newLocale)
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

  const contextValue: TranslationContextType = {
    locale,
    setLocale,
    t
  }

  return React.createElement(
    TranslationContext.Provider,
    { value: contextValue },
    children
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    // Return fallback values during SSR or when context is not available
    return {
      locale: 'en' as const,
      setLocale: () => {},
      t: (key: string) => key,
      isLoading: false
    }
  }
  return context
}
