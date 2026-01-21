<template>
  <div class="marketing-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">🚪</div>
        <h1 class="hero-title">HallPass</h1>
        <p class="hero-subtitle">Simple, digital hall pass management for teachers</p>
        <p class="hero-description">
          Track student check-outs, manage hall passes, and keep your classroom organized
          with an intuitive, easy-to-use platform.
        </p>
        <router-link to="/school-select" class="button is-primary cta-button">
          Get Started
        </router-link>
      </div>
    </div>

    <div class="features-section">
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Quick Check-Out</h3>
          <p class="feature-description">
            Students can be checked out in seconds with just a few taps.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">Real-Time Tracking</h3>
          <p class="feature-description">
            See who's out of class at any moment with live updates.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3 class="feature-title">Multi-School Support</h3>
          <p class="feature-description">
            Create or join a school to collaborate with other teachers.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3 class="feature-title">Easy to Use</h3>
          <p class="feature-description">
            Clean, modern interface that works on any device.
          </p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2 class="cta-title">Ready to get started?</h2>
      <p class="cta-description">
        Create or join a school to begin managing hall passes today.
      </p>
      <router-link to="/school-select" class="button is-primary cta-button">
        Use the App Now
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarketingPage'
}
</script>

<style lang="scss" scoped>
$primary: #2563eb;
$primary-dark: #1e40af;
$primary-light: #3b82f6;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$text-light: #9ca3af;
$bg-primary: #f9fafb;
$bg-secondary: #ffffff;
$border-color: #e5e7eb;
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$radius-md: 8px;
$radius-lg: 12px;

.marketing-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-section {
  text-align: center;
  padding: 80px 24px 64px;
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($primary-light, 0.05) 100%);
  border-radius: $radius-lg;
  margin-bottom: 80px;

  .hero-content {
    max-width: 700px;
    margin: 0 auto;
  }

  .hero-icon {
    font-size: 80px;
    margin-bottom: 24px;
    display: block;
  }

  .hero-title {
    font-size: 56px;
    font-weight: 800;
    color: $text-primary;
    margin: 0 0 16px 0;
    background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 16px 0;
  }

  .hero-description {
    font-size: 18px;
    color: $text-secondary;
    margin: 0 0 32px 0;
    line-height: 1.6;
  }

  .cta-button {
    font-size: 18px;
    padding: 14px 32px;
    min-width: 200px;
  }
}

.features-section {
  margin-bottom: 80px;
  padding: 0 24px;

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 32px;
  }

  .feature-card {
    background: $bg-secondary;
    border-radius: $radius-lg;
    padding: 32px 24px;
    text-align: center;
    border: 1px solid $border-color;
    box-shadow: $shadow-sm;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-md;
    }

    .feature-icon {
      font-size: 48px;
      margin-bottom: 16px;
      display: block;
    }

    .feature-title {
      font-size: 20px;
      font-weight: 700;
      color: $text-primary;
      margin: 0 0 12px 0;
    }

    .feature-description {
      font-size: 15px;
      color: $text-secondary;
      margin: 0;
      line-height: 1.6;
    }
  }
}

.cta-section {
  text-align: center;
  padding: 64px 24px;
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($primary-light, 0.05) 100%);
  border-radius: $radius-lg;
  margin-bottom: 32px;

  .cta-title {
    font-size: 36px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 16px 0;
  }

  .cta-description {
    font-size: 18px;
    color: $text-secondary;
    margin: 0 0 32px 0;
  }

  .cta-button {
    font-size: 18px;
    padding: 14px 32px;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px 48px;

    .hero-icon {
      font-size: 64px;
    }

    .hero-title {
      font-size: 40px;
    }

    .hero-subtitle {
      font-size: 20px;
    }

    .hero-description {
      font-size: 16px;
    }
  }

  .features-section {
    .features-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  .cta-section {
    padding: 48px 20px;

    .cta-title {
      font-size: 28px;
    }

    .cta-description {
      font-size: 16px;
    }
  }
}
</style>
