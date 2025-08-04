'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { locales, localeNames, localeFlags, Locale } from '@/lib/i18n/config'

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslation()

  return (
    <div className="relative group">
      <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
        <Globe className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => changeLocale(loc)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                locale === loc ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="mr-3">{localeFlags[loc]}</span>
              {localeNames[loc]}
              {locale === loc && (
                <span className="float-right text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
