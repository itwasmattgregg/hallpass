<template>
  <div id="app">
    <header v-if="showNavbar">
      <nav class="navbar">
        <div class="navbar-container">
          <div class="navbar-brand">
            <router-link to="/home" class="navbar-logo">
              <span class="logo-icon">🚪</span>
              <span class="logo-text">HallPass</span>
            </router-link>
          </div>

          <!-- Desktop menu -->
          <div class="navbar-end desktop-menu">
            <button
              class="navbar-item theme-toggle"
              @click="toggleTheme"
              :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
              :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
              <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
            </button>
            <router-link
              to="/home"
              class="navbar-item"
              active-class="is-active"
              exact>
              My Class
            </router-link>
            <router-link
              to="/full-list"
              class="navbar-item"
              active-class="is-active">
              View All
            </router-link>
            <button
              class="navbar-item logout-button"
              @click="logout">
              Log Out
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            class="mobile-menu-button"
            @click="toggleMobileMenu"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="mobileMenuOpen">
            <span class="hamburger-icon">
              <span class="hamburger-line" :class="{ 'open': mobileMenuOpen }"></span>
              <span class="hamburger-line" :class="{ 'open': mobileMenuOpen }"></span>
              <span class="hamburger-line" :class="{ 'open': mobileMenuOpen }"></span>
            </span>
          </button>
        </div>

        <!-- Mobile menu dropdown -->
        <div class="mobile-menu" :class="{ 'open': mobileMenuOpen }">
          <div class="mobile-menu-content">
            <button
              class="mobile-menu-item theme-toggle"
              @click="toggleTheme"
              :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
              <span class="mobile-menu-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
              <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
            <router-link
              to="/home"
              class="mobile-menu-item"
              active-class="is-active"
              exact
              @click="closeMobileMenu">
              My Class
            </router-link>
            <router-link
              to="/full-list"
              class="mobile-menu-item"
              active-class="is-active"
              @click="closeMobileMenu">
              View All
            </router-link>
            <button
              class="mobile-menu-item logout-button"
              @click="handleLogout">
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </header>
    <main class="main-content" :class="{ 'no-navbar': !showNavbar, 'no-padding': $route.name === 'marketing' }">
      <router-view/>
    </main>
  </div>
</template>

<script>
import { getSchoolId, clearSchool } from '@/utils/school'
import { getTheme, toggleTheme as toggleThemeUtil } from '@/utils/theme'

export default {
  name: 'app',
  data () {
    return {
      class: 'mr. T',
      currentTheme: getTheme(),
      mobileMenuOpen: false
    }
  },
  computed: {
    hasSchool () {
      return !!getSchoolId()
    },
    showNavbar () {
      return this.$route.name !== 'school-select' && this.$route.name !== 'marketing'
    },
    isDarkMode () {
      return this.currentTheme === 'dark'
    },
    isMarketingPage () {
      return this.$route.name === 'marketing'
    }
  },
  watch: {
    '$route' (to) {
      // Close mobile menu on route change
      this.closeMobileMenu()

      // Force light mode on marketing page
      if (to.name === 'marketing') {
        document.documentElement.setAttribute('data-theme', 'light')
      } else {
        // Restore user's theme preference when leaving marketing page
        const { getTheme, applyTheme } = require('@/utils/theme')
        applyTheme(getTheme())
        this.currentTheme = getTheme()
      }
    }
  },
  created () {
    // Force light mode on marketing page if we're on it
    if (this.$route.name === 'marketing') {
      document.documentElement.setAttribute('data-theme', 'light')
    }

    // Listen for theme changes from other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === 'hallpass_theme') {
        this.currentTheme = getTheme()
      }
    })

    // Watch for theme attribute changes (from system preference changes)
    const observer = new MutationObserver(() => {
      this.currentTheme = getTheme()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    // Close mobile menu when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    logout () {
      clearSchool()
      this.$router.push('/school-select')
    },
    handleLogout () {
      this.closeMobileMenu()
      this.logout()
    },
    toggleTheme () {
      this.currentTheme = toggleThemeUtil()
    },
    toggleMobileMenu () {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu () {
      this.mobileMenuOpen = false
    },
    handleClickOutside (event) {
      const navbar = this.$el.querySelector('.navbar')

      if (this.mobileMenuOpen && navbar && !navbar.contains(event.target)) {
        this.closeMobileMenu()
      }
    }
  }
}
</script>

<style lang="scss">
// CSS Variables for theming
:root {
  // Light theme (default)
  --color-primary: #2563eb;
  --color-primary-dark: #1e40af;
  --color-primary-light: #3b82f6;
  --color-secondary: #10b981;
  --color-secondary-dark: #059669;
  --color-danger: #ef4444;
  --color-danger-dark: #dc2626;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-light: #9ca3af;
  --color-bg-primary: #f9fafb;
  --color-bg-secondary: #ffffff;
  --color-border: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --skeleton-base: #eeeeee;
  --skeleton-highlight: #dddddd;
}

[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-primary-light: #60a5fa;
  --color-secondary: #10b981;
  --color-secondary-dark: #059669;
  --color-danger: #ef4444;
  --color-danger-dark: #dc2626;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-light: #9ca3af;
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-border: #374151;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
  --skeleton-base: #374151;
  --skeleton-highlight: #4b5563;
}

// SCSS variables for backward compatibility
$primary: var(--color-primary);
$primary-dark: var(--color-primary-dark);
$primary-light: var(--color-primary-light);
$secondary: var(--color-secondary);
$secondary-dark: var(--color-secondary-dark);
$danger: var(--color-danger);
$danger-dark: var(--color-danger-dark);
$text-primary: var(--color-text-primary);
$text-secondary: var(--color-text-secondary);
$text-light: var(--color-text-light);
$bg-primary: var(--color-bg-primary);
$bg-secondary: var(--color-bg-secondary);
$border-color: var(--color-border);
$shadow-sm: var(--shadow-sm);
$shadow-md: var(--shadow-md);
$shadow-lg: var(--shadow-lg);
$radius-sm: var(--radius-sm);
$radius-md: var(--radius-md);
$radius-lg: var(--radius-lg);

* {
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $bg-primary;
  min-height: 100vh;
  color: $text-primary;
}

.navbar {
  background: $bg-secondary;
  border-bottom: 1px solid $border-color;
  box-shadow: $shadow-sm;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0;

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .navbar-brand {
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-size: 20px;
      font-weight: 700;
      color: $text-primary;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }

      .logo-icon {
        font-size: 24px;
      }

      .logo-text {
        background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  .navbar-end {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .desktop-menu {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba($primary, 0.05);
    }

    @media (max-width: 768px) {
      display: flex;
    }

    .hamburger-icon {
      display: block;
      width: 24px;
      height: 18px;
      position: relative;
    }

    .hamburger-line {
      width: 100%;
      height: 2px;
      background-color: $text-secondary;
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      transform-origin: center;
      position: absolute;
      left: 0;

      &:nth-child(1) {
        top: 0;
        &.open {
          top: 8px;
          transform: rotate(45deg);
        }
      }

      &:nth-child(2) {
        top: 8px;
        &.open {
          opacity: 0;
        }
      }

      &:nth-child(3) {
        top: 16px;
        &.open {
          top: 8px;
          transform: rotate(-45deg);
        }
      }
    }
  }

  .mobile-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: $bg-secondary;
    border-bottom: 1px solid $border-color;
    box-shadow: $shadow-md;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 0;

    &.open {
      max-height: 400px;
      opacity: 1;
    }

    @media (max-width: 768px) {
      display: block;
    }

    .mobile-menu-content {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mobile-menu-item {
      padding: 12px 16px;
      text-decoration: none;
      color: $text-secondary;
      font-weight: 500;
      font-size: 15px;
      border-radius: $radius-sm;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      text-align: center;
      width: 100%;

      &:hover {
        color: $primary;
        background-color: rgba($primary, 0.05);
      }

      &.is-active {
        color: $primary;
        background-color: rgba($primary, 0.1);
      }

      .mobile-menu-icon {
        font-size: 20px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .navbar-item {
    padding: 8px 16px;
    text-decoration: none;
    color: $text-secondary;
    font-weight: 500;
    font-size: 15px;
    border-radius: $radius-sm;
    transition: all 0.2s ease;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5;

    &:hover {
      color: $primary;
      background-color: rgba($primary, 0.05);
    }

    &.is-active {
      color: $primary;
      background-color: rgba($primary, 0.1);
    }
  }

  .logout-button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    padding: 8px 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5;

    .theme-icon {
      font-size: 20px;
      line-height: 1;
      transition: transform 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      background-color: rgba($primary, 0.05);
      transform: scale(1.1);

      .theme-icon {
        transform: rotate(15deg);
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;

  &.no-navbar {
    padding-top: 32px;
  }

  &.no-padding {
    padding: 0;
    max-width: 100%;
    background: $bg-primary;
  }
}

a {
  color: $primary;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: $primary-dark;
  }
}

// Global button styles
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 500;
  border-radius: $radius-md;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &.is-primary {
    background: $primary;
    color: white;

    &:hover {
      background: $primary-dark;
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }

    &:active {
      transform: translateY(0);
    }
  }

  &.is-link {
    background: $primary;
    color: white;

    &:hover {
      background: $primary-dark;
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }
  }
}

// Global input styles
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  background: $bg-secondary;
  color: $text-primary;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  &::placeholder {
    color: $text-light;
  }
}

// Global select styles
.select {
  select {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    background: $bg-secondary;
    color: $text-primary;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }
}

// Global label styles
.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

// Container styles
.container {
  width: 100%;
}

// Responsive
@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px;
  }

  .navbar {
    .navbar-container {
      padding: 0 16px;
    }

    position: relative;
  }
}
</style>
