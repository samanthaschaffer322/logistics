'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui-components'
import { Globe } from 'lucide-react'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-slate-400" />
      <div className="flex bg-slate-800 rounded-lg p-1">
        <Button
          size="sm"
          variant={language === 'vi' ? 'default' : 'ghost'}
          onClick={() => setLanguage('vi')}
          className={`px-3 py-1 text-xs ${
            language === 'vi' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          🇻🇳 VI
        </Button>
        <Button
          size="sm"
          variant={language === 'en' ? 'default' : 'ghost'}
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-xs ${
            language === 'en' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          🇺🇸 EN
        </Button>
      </div>
    </div>
  )
}

export default LanguageSwitcher
