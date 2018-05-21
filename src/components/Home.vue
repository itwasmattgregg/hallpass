<template>
  <section class="container">
    <div class="columns">
      <div class="column">
        <new-contact/>
        <h1>Currently Checked Out From Your Class:</h1>
        <div
          class="loader-section"
          v-if="loading">
          <div class="user-list">
            <div class="columns">
              <div class="column is-8">
                <p class="user-list__header animated-background__header"/>
                <p class="user-list__sub animated-background__sub"/>
                <p class="user-list__sub animated-background__sub"/>
              </div>
              <div class="column is-4 right">
                <router-link
                  class="button is-primary"
                  to="/user">
                  View Person
                </router-link>
              </div>
            </div>
          </div>

          <div class="user-list">
            <div class="columns">
              <div class="column is-8">
                <p class="user-list__header animated-background__header"/>
                <p class="user-list__sub animated-background__sub"/>
                <p class="user-list__sub animated-background__sub"/>
              </div>
              <div class="column is-4 right">
                <router-link
                  class="button is-primary"
                  to="/user">
                  View Person
                </router-link>
              </div>
            </div>
          </div>

          <div class="user-list">
            <div class="columns">
              <div class="column is-8">
                <p class="user-list__header animated-background__header"/>
                <p class="user-list__sub animated-background__sub"/>
                <p class="user-list__sub animated-background__sub"/>
              </div>
              <div class="column is-4 right">
                <router-link
                  class="button is-primary"
                  to="/user">
                  View Person
                </router-link>
              </div>
            </div>
          </div>

          <div class="user-list">
            <div class="columns">
              <div class="column is-8">
                <p class="user-list__header animated-background__header"/>
                <p class="user-list__sub animated-background__sub"/>
                <p class="user-list__sub animated-background__sub"/>
              </div>
              <div class="column is-4 right">
                <router-link
                  class="button is-primary"
                  to="/user">
                  View Person
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div
          class="user-list"
          v-for="person in sorted_students"
          :key="person.slug">
          <div class="columns">
            <div class="column is-8">
              <p class="user-list__header">
                <router-link
                :to="{ name: 'view-contact', params: { person: person.slug }}">
                  {{ person.name }}
                </router-link>
              </p>
              <div class="inner">
                <div class="left">
                  <p class="user-list__sub"><strong>Reason</strong>: {{ person.reason }}</p>
                </div>
              </div>
            </div>
            <div class="column is-4 right">
              <div>{{ timeSince(person.timeOut) }}</div>
              <button
                class="button is-primary"
                v-on:click="checkIn(person.id)">
                Check In
              </Button>
            </div>
          </div>
        </div>
        <div id='list-wrapper' v-if="passes.length === 0">
          Nothing to see here
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import db from './firebaseInit'
import NewContact from './NewContact'

export default {
  name: 'home',
  data () {
    return {
      passes: [],
      loading: true,
      now: Math.trunc((new Date()).getTime() / 1000)
    }
  },
  computed: {
    sorted_students () {
      return this.passes.sort((a, b) => {
        return b.timeOut - a.timeOut
      })
    }
  },
  components: {
    NewContact
  },
  methods: {
    timeSince (timeOut) {
      let seconds = (this.now - Math.trunc((timeOut / 1000))) % 60
      const minutes = Math.trunc((this.now - Math.trunc((timeOut / 1000))) / 60) % 60

      if (seconds.toString().length <= 1) {
        seconds = '0' + seconds.toString()
      }

      return minutes + ':' + seconds
    },
    checkIn (id) {
      const doc = db.collection('passes').doc(id)
      doc.update({
        'timeIn': this.now,
        'inHall': false
      })
    }
  },
  created () {
    db
      .collection('passes')
      .where('inHall', '==', true)
      .onSnapshot(querySnapshot => {
        this.loading = false
        querySnapshot.docChanges.forEach(change => {
          if (change.type === 'added') {
            const doc = change.doc
            let data = {
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
            const id = this.passes.findIndex(contact => contact.id === change.doc.id)
            if (id >= 0) {
              this.passes.splice(id, 1)
            }
          }
        })
      })
      // NEed to destroy interval if unmount
    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 30px;
  margin: 30px 0;
}
.user-list {
  margin-top: 30px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
  .column {
    height: 120px;
  }
  .inner {
    .left {
      width: 50%;
      float: left;
      text-align: left;
    }
    .right {
      width: 50%;
      float: left;
      text-align: left;
      p {
        width: 100%;
        text-align: left;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      background: #4b75ff;
    }
  }
  .user-list__header {
    font-size: 20px;
    font-weight: 700;
  }
  .user-list__sub {
    font-size: 15px;
    margin-top: 10px;
  }
}
@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
.animated-background__header {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-name: placeHolderShimmer;
  animation-name: placeHolderShimmer;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  background: #f6f7f8;
  background: #eeeeee;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(8%, #eeeeee),
    color-stop(18%, #dddddd),
    color-stop(33%, #eeeeee)
  );
  background: -webkit-linear-gradient(
    left,
    #eeeeee 8%,
    #dddddd 18%,
    #eeeeee 33%
  );
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  -webkit-background-size: 800px 104px;
  background-size: 800px 104px;
  height: 20px;
  width: 400px;
  position: relative;
}
.animated-background__sub {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-name: placeHolderShimmer;
  animation-name: placeHolderShimmer;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  background: #f6f7f8;
  background: #eeeeee;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(8%, #eeeeee),
    color-stop(18%, #dddddd),
    color-stop(33%, #eeeeee)
  );
  background: -webkit-linear-gradient(
    left,
    #eeeeee 8%,
    #dddddd 18%,
    #eeeeee 33%
  );
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  -webkit-background-size: 800px 104px;
  background-size: 800px 104px;
  height: 20px;
  width: 200px;
  position: relative;
}
</style>
