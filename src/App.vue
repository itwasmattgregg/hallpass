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

          <div class="navbar-end">
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

export default {
  name: 'app',
  data () {
    return {
      class: 'mr. T'
    }
  },
  computed: {
    hasSchool () {
      return !!getSchoolId()
    },
    showNavbar () {
      return this.$route.name !== 'school-select' && this.$route.name !== 'marketing'
    }
  },
  methods: {
    logout () {
      clearSchool()
      this.$router.push('/school-select')
    }
  }
}
</script>

<style lang="scss">
// Modern color palette
$primary: #2563eb;
$primary-dark: #1e40af;
$primary-light: #3b82f6;
$secondary: #10b981;
$secondary-dark: #059669;
$danger: #ef4444;
$danger-dark: #dc2626;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$text-light: #9ca3af;
$bg-primary: #f9fafb;
$bg-secondary: #ffffff;
$border-color: #e5e7eb;
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$radius-sm: 6px;
$radius-md: 8px;
$radius-lg: 12px;

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
    gap: 8px;
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

  .navbar .navbar-container {
    padding: 0 16px;
  }
}
</style>
