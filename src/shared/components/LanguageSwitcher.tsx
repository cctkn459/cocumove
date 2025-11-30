import React from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/LanguageSwitcher.css'

interface LanguageSwitcherProps {
  compact?: boolean
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ]

  if (compact) {
    return (
      <select 
        value={i18n.language} 
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="language-selector-compact"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="language-switcher">
      <p className="label">Idioma / Language / Idioma / Langue</p>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-btn ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => i18n.changeLanguage(lang.code)}
            title={lang.name}
          >
            <span className="flag">{lang.flag}</span>
            <span className="name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

