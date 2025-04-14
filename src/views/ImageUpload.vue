<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Image stuff</h2>
  
      <input type="file" @change="onFileChange" />
      <div v-if="base64Image" class="my-4">
        <img :src="base64Image" alt="preview" class="w-48 border rounded" />
        <button @click="saveToFirestore" class="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Save image</button>
      </div>
  
      <hr class="my-4" />
  
      <h3 class="text-lg font-semibold mb-2">Saved images:</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="img in images" :key="img.id" class="relative group">
          <img :src="img.image" alt="slika" class="rounded shadow" />
          <button
            @click="deleteImage(img.id)"
            class="absolute top-1 right-1 bg-red-500 text-white text-sm px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from "@/firebase"; 
  import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
  } from "firebase/firestore";
  
  export default {
    data() {
      return {
        base64Image: null,
        images: []
      };
    },
    methods: {
      onFileChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
  
        reader.onload = () => {
          this.base64Image = reader.result;
        };
  
        reader.readAsDataURL(file);
      },
  
      async saveToFirestore() {
        if (!this.base64Image) return alert("Nema slike!");
  
        try {
          await addDoc(collection(db, "images"), {
            image: this.base64Image,
            createdAt: new Date()
          });
          this.base64Image = null;
        } catch (err) {
          console.error("Greška pri spremanju slike:", err);
        }
      },
  
      async deleteImage(id) {
        try {
          await deleteDoc(doc(db, "images", id));
        } catch (err) {
          console.error("Greška pri brisanju slike:", err);
        }
      },
  
      loadImages() {
        const q = query(collection(db, "images"), orderBy("createdAt", "desc"));
        onSnapshot(q, snapshot => {
          this.images = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        });
      }
    },
    mounted() {
      this.loadImages();
    }
  };
  </script>
  
  <style scoped>
  img {
    max-height: 200px;
    object-fit: cover;
  }
  </style>
  
