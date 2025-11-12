"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

type Lang = 'en' | 'ar'
type Theme = 'light' | 'dark' | 'system'

const translations: Record<Lang, Record<string, string>> = {
  en,
  ar,
}

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: () => '',
})

interface ThemeContextValue {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolved: 'light',
  setTheme: () => {},
  toggle: () => {},
})

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = localStorage.getItem('pawsitive-lang')
    if (saved === 'en' || saved === 'ar') return saved
    const nav = navigator.language || (navigator as any).userLanguage || 'en'
    return nav.startsWith('ar') ? 'ar' : 'en'
  } catch (e) {
    return 'en'
  }
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const saved = localStorage.getItem('pawsitive-theme')
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved as Theme
    return 'system'
  } catch (e) {
    return 'system'
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Always start with 'en' to match server-side rendering
  const [lang, setLangState] = useState<Lang>('en')
  const [theme, setThemeState] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
    
    // Set initial language from storage/browser after mount
    const initialLang = getInitialLang()
    setLangState(initialLang)
    document.documentElement.lang = initialLang
    document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr'
    
    // Apply initial theme from storage
    const initialTheme = getInitialTheme()
    setThemeState(initialTheme)
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = initialTheme === 'system' ? (prefersDark ? 'dark' : 'light') : initialTheme
    setResolvedTheme(resolved)
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    // persist lang and apply dir & lang attributes
    if (!mounted) return
    try {
      localStorage.setItem('pawsitive-lang', lang)
    } catch {}
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang, mounted])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('pawsitive-theme', theme)
    } catch {}

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
    
    setResolvedTheme(resolved)

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, mounted])

  const setLang = (l: Lang) => setLangState(l)

  const setTheme = (t: Theme) => setThemeState(t)

  const toggle = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const t = (key: string, fallback = ''): string => {
    const dict = translations[lang] || {}
    return dict[key] ?? fallback ?? key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      <ThemeContext.Provider value={{ theme, resolved: resolvedTheme, setTheme, toggle }}>
        {children}
      </ThemeContext.Provider>
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
export const useTheme = () => useContext(ThemeContext)

export default Providers
