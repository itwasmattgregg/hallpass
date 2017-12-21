<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <div class="navbar-brand">
          <router-link
            to="/"
            class="navbar-item">
            HallPass
          </router-link>
        </div>

        <div class="navbar-end">
          <router-link
            to="/add"
            class="navbar-item">
            View All
          </router-link>
        </div>
      </nav>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #eee;
  min-height: 100vh;
}
.navbar {
  background: #4285f4;
  color: white;
}
a {
  color: white;
}
</style>
