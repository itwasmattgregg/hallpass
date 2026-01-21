// Theme management utility
const THEME_STORAGE_KEY = 'hallpass_theme'
const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'

export function getTheme () {
  // Check localStorage first
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === DARK_THEME || stored === LIGHT_THEME) {
    return stored
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_THEME
  }

  // Default to light
  return LIGHT_THEME
}

export function setTheme (theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function applyTheme (theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
}

export function toggleTheme () {
  const currentTheme = getTheme()
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME
  setTheme(newTheme)
  return newTheme
}

// Initialize theme on load
export function initTheme () {
  const theme = getTheme()
  applyTheme(theme)

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-apply if user hasn't set a preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? DARK_THEME : LIGHT_THEME)
      }
    })
  }
}
