"use client"

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useI18n, useTheme } from '@/components/Providers'

export default function HeaderControls() {
  const { lang, setLang, t } = useI18n()
  const { resolved, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
        className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
        title={
          resolved === "dark"
            ? t("themeDark", "Light")
            : t("themeLight", "Dark")
        }
      >
        {resolved === "dark" ? (
          <Sun className="h-5 w-5 text-white" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      <button
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        className="text-gray-700 hover:text-primary-600 py-1 rounded-md border border-transparent"
        style={{ color: resolved === "dark" ? "#e0e0e0" : undefined }}
        title={t("language", "Language")}
      >
        {lang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );
}
