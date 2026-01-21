<template>
  <section class="full-list-container">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1>All Hall Passes</h1>
          <p class="page-subtitle">View and manage all hall pass records</p>
        </div>
        <div class="school-info">
          <span class="school-label">School ID:</span>
          <span class="school-id">{{ schoolId }}</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <div class="filter-group">
          <label class="label">Status</label>
          <div class="select">
            <select v-model="statusFilter">
              <option value="all">All Passes</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>
        </div>
        <div class="filter-group">
          <label class="label">Sort By</label>
          <div class="select">
            <select v-model="sortBy">
              <option value="timeOut">Checkout Time (Newest First)</option>
              <option value="timeOutOld">Checkout Time (Oldest First)</option>
              <option value="timeIn">Checkin Time (Newest First)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
        <div class="filter-group filter-group-search">
          <label class="label">Search</label>
          <input
            class="input"
            type="text"
            placeholder="Search by name or reason..."
            v-model="searchQuery"
          />
        </div>
      </div>
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
        </div>
      </div>
    </div>

    <!-- Passes list -->
    <div class="passes-list" v-else>
      <div
        class="pass-card"
        v-for="pass in filteredAndSortedPasses"
        :key="pass.id"
      >
        <div class="pass-card-content">
          <div class="pass-card-main">
            <div class="pass-header">
              <router-link
                :to="{ name: 'view-contact', params: { person: pass.slug } }"
                class="student-name"
              >
                {{ pass.name }}
              </router-link>
              <span
                class="status-badge"
                :class="{
                  'is-active': pass.inHall,
                  'is-completed': !pass.inHall,
                }"
              >
                {{ pass.inHall ? "Active" : "Completed" }}
              </span>
            </div>
            <div class="pass-details">
              <div class="detail-item">
                <span class="detail-label">Reason</span>
                <span class="detail-value">{{ pass.reason }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Class</span>
                <span class="detail-value">{{ pass.class }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Checked Out</span>
                <span class="detail-value">
                  {{ formatDate(pass.timeOut) }}
                  <span v-if="pass.inHall" class="time-ago">
                    ({{ timeSince(pass.timeOut) }} ago)
                  </span>
                </span>
              </div>
              <div class="detail-item" v-if="pass.timeIn">
                <span class="detail-label">Checked In</span>
                <span class="detail-value">
                  {{ formatDate(pass.timeIn) }}
                  <span class="duration"
                    >({{ duration(pass.timeOut, pass.timeIn) }})</span
                  >
                </span>
              </div>
            </div>
          </div>
          <div class="pass-card-actions">
            <button
              v-if="pass.inHall"
              class="button is-primary"
              v-on:click="checkIn(pass.id)"
            >
              Check In
            </button>
            <div v-else class="completed-indicator">
              <span class="completed-icon" aria-label="Completed">✓</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredAndSortedPasses.length === 0" class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No passes found</h3>
        <p>
          {{
            searchQuery
              ? "Try adjusting your search or filters."
              : "No hall passes have been created yet."
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import db from './firebaseInit'
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  where
} from 'firebase/firestore'
import errorHandler from './ErrorHandler'
import { getSchoolId } from '@/utils/school'

export default {
  name: 'full-list',
  data () {
    return {
      passes: [],
      loading: true,
      now: Math.trunc(new Date().getTime() / 1000),
      unsubscribe: null,
      intervalId: null,
      statusFilter: 'all',
      sortBy: 'timeOut',
      searchQuery: '',
      schoolId: null
    }
  },
  computed: {
    filteredAndSortedPasses () {
      let filtered = this.passes

      // Filter by status
      if (this.statusFilter === 'active') {
        filtered = filtered.filter((p) => p.inHall === true)
      } else if (this.statusFilter === 'completed') {
        filtered = filtered.filter((p) => p.inHall === false)
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter((p) => {
          return (
            p.name.toLowerCase().includes(query) ||
            p.reason.toLowerCase().includes(query) ||
            (p.class && p.class.toLowerCase().includes(query))
          )
        })
      }

      // Sort
      const sorted = [...filtered].sort((a, b) => {
        switch (this.sortBy) {
          case 'timeOut':
            return b.timeOut - a.timeOut
          case 'timeOutOld':
            return a.timeOut - b.timeOut
          case 'timeIn':
            if (!a.timeIn && !b.timeIn) return 0
            if (!a.timeIn) return 1
            if (!b.timeIn) return -1
            return b.timeIn - a.timeIn
          case 'name':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })

      return sorted
    }
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
    formatDate (timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    },
    duration (timeOut, timeIn) {
      const durationMs = timeIn - timeOut
      const totalSeconds = Math.floor(durationMs / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const hours = Math.floor(minutes / 60)
      const displayMinutes = minutes % 60
      const displaySeconds = totalSeconds % 60

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
    }
  },
  created () {
    const schoolId = getSchoolId()
    if (!schoolId) {
      this.$router.push('/school-select')
      return
    }

    this.schoolId = schoolId

    // Get all passes (both active and inactive) for this school
    const q = query(
      collection(db, 'passes'),
      where('schoolId', '==', schoolId),
      orderBy('timeOut', 'desc')
    )
    this.unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        this.loading = false
        this.passes = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          this.passes.push({
            id: doc.id,
            name: data.name,
            reason: data.reason,
            class: data.class,
            timeOut: data.timeOut,
            timeIn: data.timeIn || null,
            inHall: data.inHall,
            slug: data.slug
          })
        })
      },
      (error) => {
        this.loading = false
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to load passes.'
        )
        alert(errorInfo.message)
      }
    )

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
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);
$radius-md: 8px;
$radius-lg: 12px;

.full-list-container {
  width: 100%;
}

.page-header {
  margin-bottom: 32px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: wrap;
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 8px 0;
  }

  .page-subtitle {
    font-size: 16px;
    color: $text-secondary;
    margin: 0;
  }

  .school-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba($primary, 0.1);
    border-radius: $radius-md;
    border: 1px solid rgba($primary, 0.2);

    .school-label {
      font-size: 14px;
      font-weight: 600;
      color: $text-secondary;
    }

    .school-id {
      font-size: 14px;
      font-weight: 700;
      color: $primary;
      font-family: 'Courier New', monospace;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .school-info {
      width: 100%;
    }
  }
}

.filters-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
  margin-bottom: 24px;

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.filter-group-search {
      grid-column: 1 / -1;

      @media (min-width: 769px) {
        grid-column: span 2;
      }
    }

    .select {
      width: 100%;
      position: relative;
      height: 48px;

      select {
        width: 100%;
        padding: 14px 16px;
        font-size: 15px;
        line-height: 1.5;
        border: 1px solid $border-color;
        border-radius: 8px;
        background: $bg-secondary;
        color: $text-primary;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 48px;
        box-sizing: border-box;
        overflow: visible;
        text-overflow: ellipsis;

        &:focus {
          outline: none;
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }

        &:hover {
          border-color: #d1d5db;
        }

        option {
          padding: 12px 16px;
          line-height: 1.5;
        }
      }
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
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
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
    flex-wrap: wrap;

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

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.is-active {
        background: rgba($secondary, 0.1);
        color: $secondary;
      }

      &.is-completed {
        background: rgba($text-light, 0.1);
        color: $text-secondary;
      }
    }
  }

  .pass-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
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
    line-height: 1.5;

    .time-ago,
    .duration {
      color: $text-secondary;
      font-size: 13px;
      margin-left: 4px;
    }
  }

  .pass-card-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .completed-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $text-secondary;
    font-size: 14px;
    font-weight: 500;

    .completed-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba($secondary, 0.1);
      color: $secondary;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }
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
.animated-background__sub {
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
</style>
