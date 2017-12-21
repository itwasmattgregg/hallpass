<template>
  <section class="container">

    <h1>View Contact</h1>

    <div class="contact--section">
      <p class="__name">{{name}}</p>

      <p>{{reason}}</p>

    </div>
  </section>
</template>

<script>
  import db from './firebaseInit'
  export default {
    name: 'view-contact',
    data () {
      return {
        name: null,
        reason: null
      }
    },
    beforeRouteEnter (to, from, next) {
      db.collection('contacts').where('slug', '==', to.params.person).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          next(vm => {
            vm.name = doc.data().name
            vm.reason = doc.data().reason
          })
        })
      })
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        db.collection('contacts').where('slug', '==', this.$route.params.person).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data())
            this.name = doc.data().name
            this.reason = doc.data().reason
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  section {
    height: 100vh;
  }
  h1 {
    font-size: 30px;
    margin: 30px 0;
  }
  p {
    margin-bottom: 20px;
  }
  .contact--section {
    background-color: white;
    padding: 20px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
    .__name {
      font-size: 30px;
    }
  }
</style>
