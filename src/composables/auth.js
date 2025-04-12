// src/composables/auth.js
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export async function signupUser(email, password) {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, 'users', res.user.uid), {
    uid: res.user.uid,
    email: res.user.email
  })
  return res
}

export async function loginUser(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password)
  return res
}

export async function logoutUser() {
  return signOut(auth)
}
