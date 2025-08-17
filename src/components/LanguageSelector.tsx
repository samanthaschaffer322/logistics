'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    {
      code: 'vi' as const,
      name: 'Tiếng Việt',
      flag: '🇻🇳',
      shortName: 'VI'
    },
    {
      code: 'en' as const,
      name: 'English',
      flag: '🇺🇸',
      shortName: 'EN'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium">{currentLanguage?.shortName}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                language === lang.code
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1 font-medium">{lang.name}</span>
              {language === lang.code && (
                <Check className="w-4 h-4 text-blue-400" />
              )}
            </button>
          ))}
        </div>
        
        <div className="border-t border-slate-700/50 p-2">
          <div className="text-xs text-slate-400 px-3 py-1">
            {language === 'vi' 
              ? 'Ngôn ngữ sẽ được lưu tự động'
              : 'Language preference will be saved'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
