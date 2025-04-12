// src/stores/user.js
import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
      })
    },
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = null
    }
  }
})
