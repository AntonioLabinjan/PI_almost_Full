<template>
    <div>
      <h2>Signup</h2>
      <form @submit.prevent="handleSignup">
        <input v-model="email" placeholder="Email" />
  
        <input v-model="password" type="password" placeholder="Password" />
        <input v-model="repeatPassword" type="password" placeholder="Repeat Password" />
  
        <button type="submit">Sign Up</button>
  
        <p v-if="error" style="color: red">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { signupUser } from '../composables/auth'
  
  export default {
    name: 'Signup',
    data() {
      return {
        email: '',
        password: '',
        repeatPassword: '',
        error: null
      }
    },
    methods: {
      isPasswordStrong(password) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/
        return regex.test(password)
      },
      async handleSignup() {
        this.error = null
  
        if (this.password !== this.repeatPassword) {
          this.error = 'Passwords do not match.'
          return
        }
  
        if (!this.isPasswordStrong(this.password)) {
          this.error = 'Password must be at least 8 characters long and contain at least 1 number, 1 uppercase letter, and 1 symbol.'
          return
        }
  
        try {
          await signupUser(this.email, this.password)
          this.$router.push('/')
        } catch (err) {
          this.error = err.message
        }
      }
    }
  }
  </script>
  