<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" />
        <button type="submit">Login</button>
        <p v-if="error" style="color: red">{{ error }}</p>
      </form>
  
      <p>Don't have an account?</p>
      <router-link to="/signup">
        <button>Go to Signup</button>
      </router-link>
    </div>
  </template>
  
  <script>
  import { loginUser } from '../composables/auth'
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        error: null
      }
    },
    methods: {
      async handleLogin() {
        this.error = null
        try {
          await loginUser(this.email, this.password)
          this.$router.push('/')
        } catch (err) {
          const code = err.code
          if (code === 'auth/user-not-found') {
            this.error = 'User not found. Please check your email or sign up first.'
          } else if (code === 'auth/wrong-password') {
            this.error = 'Incorrect password. Please try again.'
          } else if (code === 'auth/invalid-email') {
            this.error = 'Invalid email address format.'
          } else {
            this.error = err.message
          }
        }
      }
    }
  }
  </script>
  