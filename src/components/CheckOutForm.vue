<template>
  <section class="checkout-form-container">
    <div class="form-card">
      <form @submit.prevent="saveContact" class="checkout-form">
        <div class="form-row">
          <div class="field field-name">
            <label class="label">Student Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter student name"
                v-model="name"
                required
              />
            </div>
          </div>

          <div class="field field-reason">
            <label class="label">Reason</label>
            <div class="control control-reason">
              <v-select
                v-model="reason"
                :options="reasons"
                placeholder="Select a reason"
                :searchable="true"
              ></v-select>
            </div>
          </div>

          <div class="field field-submit">
            <button type="submit" class="button is-primary submit-btn">
              <span class="button-icon">🚪</span>
              Check Out
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import db from './firebaseInit'
import { collection, addDoc } from 'firebase/firestore'
import vSelect from 'vue-select'
import errorHandler from './ErrorHandler'
import { getSchoolId } from '@/utils/school'
import { getBrowserId } from '@/utils/browser'

export default {
  name: 'CheckOutForm',
  props: {
    className: {
      type: String,
      default: 'mr. T'
    }
  },
  data () {
    return {
      name: null,
      reason: null,
      reasons: [
        'Bathroom',
        'Nurse',
        'Office',
        'Library',
        'Locker',
        'Water Fountain',
        'Counselor',
        'Other'
      ]
    }
  },
  components: {
    'v-select': vSelect
  },
  methods: {
    async saveContact () {
      const schoolId = getSchoolId()
      if (!schoolId) {
        this.$router.push('/school-select')
        return
      }

      try {
        const browserId = getBrowserId()
        await addDoc(collection(db, 'passes'), {
          name: this.name,
          reason: this.reason,
          class: this.className,
          schoolId,
          browserId,
          inHall: true,
          timeOut: new Date().getTime(),
          slug: this.generateUUID()
        })
        this.name = ''
        this.reason = ''
      } catch (error) {
        const errorInfo = errorHandler.handleError(
          error,
          'Failed to check out student.'
        )
        alert(errorInfo.message)
      }
    },
    generateUUID () {
      let d = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
      )
      return uuid
    }
  }
}
</script>

<style lang="scss" scoped>
// Use CSS variables for theme support
$primary: var(--color-primary);
$text-primary: var(--color-text-primary);
$text-secondary: var(--color-text-secondary);
$bg-secondary: var(--color-bg-secondary);
$border-color: var(--color-border);
$shadow-sm: var(--shadow-sm);
$shadow-md: var(--shadow-md);
$radius-lg: var(--radius-lg);

.checkout-form-container {
  width: 100%;
  margin: 0 auto;
}

.form-card {
  background: $bg-secondary;
  border-radius: $radius-lg;
  padding: 20px 24px;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
}

.checkout-form {
  .form-row {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    gap: 16px;
    align-items: end;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .field {
    margin-bottom: 0;
    min-width: 0;

    &.field-name {
      min-width: 0;
    }

    &.field-reason {
      min-width: 0;
    }

    &.field-submit {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;

      @media (max-width: 768px) {
        justify-content: stretch;
      }
    }

    .control {
      width: 100%;
      display: flex;
      min-width: 0;

      &.control-reason {
        display: block;
      }
    }
  }

  .label {
    margin-bottom: 8px;
    font-size: 14px;
  }

  .submit-btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;

    .button-icon {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      padding: 14px 24px;
    }
  }
}

// Vue-select styling
.checkout-form .field-reason {
  .control-reason {
    width: 100%;
    min-width: 0;
  }

  ::v-deep .v-select {
    width: 100%;
    min-width: 0;
    display: block;

    .vs__dropdown-toggle {
      border: 1px solid $border-color;
      border-radius: 8px;
      padding: 0;
      min-height: 48px;
      width: 100%;
      display: flex;
      align-items: stretch;
    }

    .vs__clear,
    .vs__open-indicator {
      flex-shrink: 0;
    }

    .vs__actions {
      padding: 0 12px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .vs__search-container {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      align-items: center;
    }

    .vs__search,
    .vs__search:focus {
      margin: 0;
      padding: 12px 16px;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      flex: 1 1 auto;
      font-size: 15px;
      color: $text-primary;
      border: none;
      outline: none;
      box-sizing: border-box;
    }

    .vs__search::placeholder {
      color: var(--color-text-light);
    }

    .vs__selected {
      color: $text-primary;
      font-size: 15px;
      padding: 12px 16px;
      margin: 0;
      flex: 1 1 auto;
      min-width: 0;
      display: block;
    }

    &.vs--open .vs__dropdown-toggle {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    .vs__dropdown-menu {
      border: 1px solid $border-color;
      border-radius: 8px;
      box-shadow: $shadow-md;
      margin-top: 4px;
      background: $bg-secondary;
    }

    .vs__dropdown-option {
      padding: 12px 16px;
      color: $text-primary;
      background: $bg-secondary;

      &--highlight {
        background: rgba($primary, 0.1);
        color: $primary;
      }
    }
  }
}
</style>
