<template>
    <div>
      <h1>Home Page</h1>
      HOMEPAGE
      <router-link to="/todo">Go to TODOs</router-link>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import { logoutUser } from '../composables/auth'
  import { useUserStore } from '../stores/user'
  
  export default {
    name: 'Home',
  
    methods: {
      async logout() {
        await logoutUser()
        this.$router.push('/login')
      }
    },
  
    mounted() {
      alert('Uspijeli smo')
  
      const userStore = useUserStore()
      console.log('User from Pinia store:', userStore.user)
    }
  }
  </script>
  