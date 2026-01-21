<template>
  <section class="home-container">
    <div class="header-section">
      <div class="class-name-card">
        <div class="card-header">
          <span class="card-icon">📚</span>
          <h2>Class Name</h2>
        </div>
        <div class="field">
          <input
            class="input"
            type="text"
            v-model="className"
            placeholder="Enter class name"
            @focus="isEditing = true"
            @blur="saveClassName"
            @keyup.enter="saveClassName"
          />
        </div>
      </div>

      <check-out-form :className="className" />
    </div>

    <div class="active-passes-section">
      <div class="section-header">
        <h1>Currently Checked Out</h1>
        <span class="badge" v-if="!loading">{{ passes.length }} active</span>
      </div>

      <!-- Loading state -->
      <div class="loading-container" v-if="loading">
        <div class="pass-card loading" v-for="n in 3" :key="n">
          <div class="pass-card-content">
            <div class="pass-card-main">
              <div class="animated-background__header" />
              <div class="animated-background__sub" />
              <div class="animated-background__sub" />
            </div>
            <div class="pass-card-actions">
              <div class="animated-background__button" />
            </div>
          </div>
        </div>
      </div>

      <!-- Active passes -->
      <div class="passes-list" v-else>
        <div
          class="pass-card"
          v-for="person in sorted_students"
          :key="person.slug"
        >
          <div class="pass-card-content">
            <div class="pass-card-main">
              <div class="pass-header">
                <router-link
                  :to="{
                    name: 'view-contact',
                    params: { person: person.slug },
                  }"
                  class="student-name"
                >
                  {{ person.name }}
                </router-link>
                <span class="status-indicator active"></span>
              </div>
              <div class="pass-details">
                <div class="detail-item">
                  <span class="detail-label">Reason</span>
                  <span class="detail-value">{{ person.reason }}</span>
                </div>
              </div>
            </div>
            <div class="pass-card-actions">
              <div class="time-display">
                <span class="time-value">{{ timeSince(person.timeOut) }}</span>
                <span class="time-label">elapsed</span>
              </div>
              <button
                class="button is-primary check-in-btn"
                v-on:click="checkIn(person.id)"
              >
                Check In
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-state" v-if="passes.length === 0">
          <div class="empty-state-icon">✅</div>
          <h3>All students are in class</h3>
          <p>No active hall passes at the moment.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import db from './firebaseInit'
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore'
import CheckOutForm from './CheckOutForm'
import errorHandler from './ErrorHandler'
import { getSchoolId } from '@/utils/school'

export default {
  name: 'HomePage',
  data () {
    return {
      passes: [],
      loading: true,
      now: Math.trunc(new Date().getTime() / 1000),
      unsubscribe: null,
      intervalId: null,
      className: localStorage.getItem('hallpass_className') || 'mr. T',
      isEditing: false
    }
  },
  computed: {
    sorted_students () {
      return [...this.passes].sort((a, b) => {
        return b.timeOut - a.timeOut
      })
    }
  },
  components: {
    CheckOutForm
  },
  methods: {
    timeSince (timeOut) {
      const elapsedSeconds = this.now - Math.trunc(timeOut / 1000)
      const minutes = Math.floor(elapsedSeconds / 60)
      const hours = Math.floor(minutes / 60)
      const displayMinutes = minutes % 60
      const displaySeconds = elapsedSeconds % 60

      if (minutes < 1) {
        return `${displaySeconds} ${displaySeconds === 1 ? 'second' : 'seconds'}`
      } else if (hours < 1) {
        if (displaySeconds === 0) {
          return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
        }
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${displaySeconds} ${displaySeconds === 1 ? 'second' : 'seconds'}`
      } else if (displayMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
      } else {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${displayMinutes} ${displayMinutes === 1 ? 'minute' : 'minutes'}`
      }
    },
    async checkIn (id) {
      try {
        const docRef = doc(db, 'passes', id)
        // Use milliseconds timestamp for consistency with timeOut
        await updateDoc(docRef, {
          timeIn: new Date().getTime(),
          inHall: false
        })
      } catch (error) {
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to check in student.'
        )
        alert(errorInfo.message)
      }
    },
    saveClassName () {
      localStorage.setItem('hallpass_className', this.className)
      this.isEditing = false
    }
  },
  created () {
    const schoolId = getSchoolId()
    if (!schoolId) {
      this.$router.push('/school-select')
      return
    }

    const q = query(
      collection(db, 'passes'),
      where('schoolId', '==', schoolId),
      where('inHall', '==', true)
    )
    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.loading = false
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const doc = change.doc
          const data = {
            id: doc.id,
            name: doc.data().name,
            reason: doc.data().reason,
            class: doc.data().class,
            timeOut: doc.data().timeOut,
            slug: doc.data().slug
          }
          this.passes.push(data)
        }
        // Assuming the only thing that will ever be modified is active
        if (change.type === 'removed') {
          const id = this.passes.findIndex(
            (contact) => contact.id === change.doc.id
          )
          if (id >= 0) {
            this.passes.splice(id, 1)
          }
        }
      })
    })
    // Update timer every second
    this.intervalId = window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },
  beforeDestroy () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #2563eb;
$primary-dark: #1e40af;
$secondary: #10b981;
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

.home-container {
  width: 100%;
}

.header-section {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.class-name-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .card-icon {
      font-size: 24px;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }

  .field {
    margin: 0;
  }
}

.active-passes-section {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: $text-primary;
      margin: 0;
    }

    .badge {
      background: rgba($primary, 0.1);
      color: $primary;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

.passes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pass-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  &.loading {
    pointer-events: none;
  }

  .pass-card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .pass-card-main {
    flex: 1;
    min-width: 0;
  }

  .pass-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .student-name {
      font-size: 20px;
      font-weight: 700;
      color: $text-primary;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: $primary;
      }
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $text-light;

      &.active {
        background: $secondary;
        box-shadow: 0 0 0 4px rgba($secondary, 0.2);
      }
    }
  }

  .pass-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    font-size: 12px;
    font-weight: 600;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    font-size: 15px;
    color: $text-primary;
  }

  .pass-card-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .time-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .time-value {
      font-size: 24px;
      font-weight: 700;
      color: $primary;
      font-variant-numeric: tabular-nums;
    }

    .time-label {
      font-size: 12px;
      color: $text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .check-in-btn {
    min-width: 120px;
  }
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: $bg-secondary;
  border-radius: $radius-lg;
  border: 1px solid $border-color;

  .empty-state-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 15px;
    color: $text-secondary;
    margin: 0;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.animated-background__header,
.animated-background__sub,
.animated-background__button {
  animation: placeHolderShimmer 1s linear infinite;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
  border-radius: 4px;
}

.animated-background__header {
  height: 20px;
  width: 60%;
  margin-bottom: 12px;
}

.animated-background__sub {
  height: 16px;
  width: 40%;
  margin-bottom: 8px;
}

.animated-background__button {
  height: 40px;
  width: 120px;
}
</style>
