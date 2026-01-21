<template>
  <section class="view-contact-container">
    <div class="contact-card">
      <div class="contact-header">
        <router-link to="/" class="back-link">
          <span class="back-icon">←</span>
          Back to Active Passes
        </router-link>
      </div>

      <div class="contact-content">
        <div class="contact-avatar">
          <span class="avatar-text">{{
            name ? name.charAt(0).toUpperCase() : "?"
          }}</span>
        </div>

        <h1 class="contact-name">{{ name }}</h1>

        <div class="contact-details">
          <div class="detail-row">
            <span class="detail-label">Reason</span>
            <span class="detail-value">{{ reason }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import db from './firebaseInit'
import { collection, query, where, getDocs } from 'firebase/firestore'
import errorHandler from './ErrorHandler'
import { getSchoolId } from '@/utils/school'

export default {
  name: 'view-contact',
  data () {
    return {
      name: null,
      reason: null
    }
  },
  beforeRouteEnter (to, from, next) {
    const schoolId = getSchoolId()
    if (!schoolId) {
      next('/school-select')
      return
    }

    const q = query(
      collection(db, 'passes'),
      where('schoolId', '==', schoolId),
      where('slug', '==', to.params.person)
    )
    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          const errorInfo = errorHandler.handleError(
            { code: 'not-found' },
            'Student not found.'
          )
          alert(errorInfo.message)
          next('/')
          return
        }
        querySnapshot.forEach((doc) => {
          next((vm) => {
            vm.name = doc.data().name
            vm.reason = doc.data().reason
          })
        })
      })
      .catch((error) => {
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to load student information.'
        )
        alert(errorInfo.message)
        next('/')
      })
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    async fetchData () {
      try {
        const schoolId = getSchoolId()
        if (!schoolId) {
          this.$router.push('/school-select')
          return
        }

        const q = query(
          collection(db, 'passes'),
          where('schoolId', '==', schoolId),
          where('slug', '==', this.$route.params.person)
        )
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) {
          const errorInfo = errorHandler.handleError(
            { code: 'not-found' },
            'Student not found.'
          )
          alert(errorInfo.message)
          this.$router.push('/home')
          return
        }
        querySnapshot.forEach((doc) => {
          this.name = doc.data().name
          this.reason = doc.data().reason
        })
      } catch (error) {
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to load student information.'
        )
        alert(errorInfo.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #2563eb;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$bg-secondary: #ffffff;
$border-color: #e5e7eb;
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
$radius-lg: 12px;

.view-contact-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.contact-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: 32px;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
}

.contact-header {
  margin-bottom: 32px;

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: $text-secondary;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: $primary;
    }

    .back-icon {
      font-size: 20px;
      font-weight: 700;
    }
  }
}

.contact-content {
  text-align: center;
}

.contact-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: $shadow-md;

  .avatar-text {
    font-size: 32px;
    font-weight: 700;
    color: white;
  }
}

.contact-name {
  font-size: 32px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 32px 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid $border-color;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 18px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.5;
}
</style>
