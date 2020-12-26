<template>
  <div id="app">
    <Navbar />
    <Search/>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Navbar from './components/Navbar'
export default {
  name: 'App',
  components: {
    Search,
    Navbar
  }
}
</script>

