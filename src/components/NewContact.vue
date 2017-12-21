<template>
  <section class="container">
    <h1>Checkout a Student</h1>

    <form @submit.prevent="saveContact">

      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input" type="text" placeholder="Student Name" v-model="name" required>
        </div>
      </div>

      <div class="field">
        <label class="label">Reason</label>
        <div class="control">
          <input class="input" type="text" placeholder="Reason" v-model="reason" required>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button type="submit" class="button is-link">Check Out</button>
        </div>
      </div>

    </form>
  </section>
</template>

<script>
  import db from './firebaseInit'
  export default {
    name: 'new-contact',
    data () {
      return {
        name: null,
        reason: null,
        class: 'mr. T'
      }
    },
    methods: {
      saveContact () {
        db.collection('contacts').add({
          name: this.name,
          reason: this.reason,
          class: this.class,
          slug: this.generateUUID()
        })
          .then(docRef => {
            console.log('Doc written with ID: ', docRef.id)
            Object.assign(this.$data, this.$options.data())
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      },
      generateUUID () {
        let d = new Date().getTime()
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          let r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
        return uuid
      }
    }
  }
</script>

<style scoped>

  h1 {
    font-size: 30px;
    margin: 30px 0;
  }

  .input {
    height: 40px;
  }

</style>
