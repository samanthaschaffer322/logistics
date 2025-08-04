/**
 * Internationalization Configuration
 * Supports Vietnamese and English languages
 */

export const locales = ['en', 'vi'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt'
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  vi: '🇻🇳'
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/')
  const locale = segments[1] as Locale
  return locales.includes(locale) ? locale : defaultLocale
}

export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/')
  if (locales.includes(segments[1] as Locale)) {
    return '/' + segments.slice(2).join('/')
  }
  return pathname
}
