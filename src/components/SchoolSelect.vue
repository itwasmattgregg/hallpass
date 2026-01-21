<template>
  <div class="school-select-container">
    <div class="school-select-card">
      <div class="card-header">
        <h1>Select School</h1>
      </div>

      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          Create School
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'join' }"
          @click="activeTab = 'join'"
        >
          Join School
        </button>
      </div>

      <div class="tab-content">
        <!-- Create School Tab -->
        <div v-if="activeTab === 'create'" class="form-section">
          <div class="field">
            <label class="label">School Name</label>
            <input
              class="input"
              type="text"
              v-model="schoolName"
              placeholder="Enter school name"
              @keyup.enter="createSchool"
            />
          </div>
          <button
            class="button is-primary"
            @click="createSchool"
            :disabled="!schoolName || creating"
          >
            <span v-if="creating">Creating...</span>
            <span v-else>Create School</span>
          </button>
        </div>

        <!-- Join School Tab -->
        <div v-if="activeTab === 'join'" class="form-section">
          <div class="field">
            <label class="label">School ID</label>
            <input
              class="input"
              type="text"
              v-model="schoolId"
              placeholder="Enter school ID"
              @keyup.enter="joinSchool"
            />
          </div>
          <button
            class="button is-primary"
            @click="joinSchool"
            :disabled="!schoolId || joining"
          >
            <span v-if="joining">Joining...</span>
            <span v-else>Join School</span>
          </button>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import db from './firebaseInit'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import errorHandler from './ErrorHandler'

export default {
  name: 'SchoolSelect',
  data () {
    return {
      activeTab: 'create',
      schoolName: '',
      schoolId: '',
      creating: false,
      joining: false,
      error: null
    }
  },
  methods: {
    async createSchool () {
      if (!this.schoolName.trim()) {
        this.error = 'Please enter a school name'
        return
      }

      this.creating = true
      this.error = null

      try {
        const schoolRef = await addDoc(collection(db, 'schools'), {
          name: this.schoolName.trim(),
          createdAt: new Date().getTime()
        })

        // Save school ID to localStorage
        localStorage.setItem('hallpass_schoolId', schoolRef.id)
        localStorage.setItem('hallpass_schoolName', this.schoolName.trim())

        // Redirect to home
        this.$router.push('/home')
      } catch (error) {
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to create school.'
        )
        this.error = errorInfo.message
      } finally {
        this.creating = false
      }
    },
    async joinSchool () {
      if (!this.schoolId.trim()) {
        this.error = 'Please enter a school ID'
        return
      }

      this.joining = true
      this.error = null

      try {
        const schoolRef = doc(db, 'schools', this.schoolId.trim())
        const schoolDoc = await getDoc(schoolRef)

        if (!schoolDoc.exists()) {
          this.error = 'School not found. Please check the school ID.'
          this.joining = false
          return
        }

        const schoolData = schoolDoc.data()

        // Save school ID and name to localStorage
        localStorage.setItem('hallpass_schoolId', this.schoolId.trim())
        localStorage.setItem('hallpass_schoolName', schoolData.name || 'School')

        // Redirect to home
        this.$router.push('/home')
      } catch (error) {
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to join school.'
        )
        this.error = errorInfo.message
      } finally {
        this.joining = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #2563eb;
$primary-dark: #1e40af;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$text-light: #9ca3af;
$bg-primary: #f9fafb;
$bg-secondary: #ffffff;
$border-color: #e5e7eb;
$danger: #ef4444;
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$radius-md: 8px;
$radius-lg: 12px;

.school-select-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: $bg-primary;
}

.school-select-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: 40px;
  box-shadow: $shadow-lg;
  border: 1px solid $border-color;
  max-width: 500px;
  width: 100%;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 32px;

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: $text-primary;
      margin: 0;
    }

    .card-subtitle {
      font-size: 15px;
      color: $text-secondary;
      margin: 0;
    }
  }

  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 2px solid $border-color;
  }

  .tab-button {
    flex: 1;
    padding: 12px 16px;
    background: none;
    border: none;
    font-size: 15px;
    font-weight: 500;
    color: $text-secondary;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    margin-bottom: -2px;

    &:hover {
      color: $primary;
    }

    &.active {
      color: $primary;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: $primary;
      }
    }
  }

  .tab-content {
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field {
      margin: 0;
    }

    .button {
      width: 100%;
      padding: 12px 20px;
      font-size: 15px;
      font-weight: 600;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  .error-message {
    margin-top: 16px;
    padding: 12px 16px;
    background: rgba($danger, 0.1);
    color: $danger;
    border-radius: $radius-md;
    font-size: 14px;
    text-align: center;
  }
}
</style>
