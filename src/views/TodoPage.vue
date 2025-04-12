<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8 flex items-center justify-center">
      <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 class="text-4xl font-extrabold text-gray-800 mb-8 text-center">Todo list</h1>
  
        <div class="mb-4 text-center text-lg">
          <!-- dinamički dohvat varijable iz js-a-->
          <p class="font-semibold text-gray-600">Broj zadataka: {{ taskCount }}</p>
        </div>
  
        <div class="flex mb-6 justify-center">
          <!-- HTML element za korisnički input-->
           <!-- ako stisnemo enter, dodamo task-->
          <!-- isto tako, ako stisnemo botun, dodamo task-->  
          <input 
            v-model="newTask" 
            @keyup.enter="addTask" 
            placeholder="Add new task..."
            class="flex-1 p-4 text-lg border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            @click="addTask"
            class="bg-purple-600 text-white px-6 py-4 rounded-r-xl hover:bg-purple-800 transition-all"
          >
            ➕ Add
          </button>
        </div>
  
        <!-- Poruka ako nema zadataka -->
        <p v-if="tasks.length === 0" class="text-center text-lg text-gray-500">
          Nema zadataka. Dodaj neki!
        </p>
  
        <!-- lista taskova -->
        <ul v-if="tasks.length > 0" class="space-y-4">
          <!-- v-for iterira kroz sve unesene taskove u tasks arrayu i dohvaća ih po indexu -->
          <li v-for="(task, index) in tasks" :key="task.id"  
              class="flex items-center justify-between p-4 rounded-xl shadow-sm transition-all duration-300 bg-gray-100 hover:bg-gray-200">
  
            <!-- Text zadatka -->
            <div 
              @click="toggleCompleted(index)"
              :class="['text-lg cursor-pointer select-none', task.completed ? 'line-through text-gray-400' : 'text-gray-800']">
              {{ task.text }}
            </div>
  
            <!-- Div za sekciju s buttonima -->
            <div class="space-x-3">
              <!-- S @click povezujemo button i metodu. Metoda se poziva za onaj task koji se nalazi na proslijeđenom indexu -->
              <button @click="editTask(index)" class="text-blue-500 hover:text-blue-700 text-xl">
                ✏️
              </button>
              <button @click="deleteTask(index)" class="text-red-500 hover:text-red-700 text-xl">
                ❌
              </button>
            </div>
          </li>
        </ul>
        <router-link to="/">Go back home</router-link>
      </div>
    </div>
    <div>
      <!-- dohvat komponente i njen prikaz-->
    <FooterComponent></FooterComponent>
    </div>
  </template>
  
  <script>
  // import komponente => . označava src folder
  import FooterComponent from "../components/FooterComponent.vue";
  
  // import Firestore stvari
  import { db } from "../firebase";
  import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
  
  export default {
    // komponente koje imamo na stranici => zamislimo komponente kao manje sastavne djelove od kojih se slaže cijela stranica (view)
    // view se može sastojati od više komponenti
    components:{
      FooterComponent, // mora se podudarat s Name parametrom u komponenti
    },
  
    // podaci
    data() {
      return {
        newTask: "",
        tasks: []
      };
    },
    computed: {
      // computed property za broj zadataka
      taskCount() {
        return this.tasks.length; 
      }
    },
    methods: {
      // metoda za dodavanje taskova
      // firebase metode su asinkrone => ukratko...treba nam neko vrijeme da se stvar spremi u db, pa zato moramo počekat da se to sve odradi (ofc. radi se o vremenu manjem od sekunde, ali svejedno)
      async addTask() {
        if (this.newTask.trim() !== "") {
          // kreira se docRef objekt koji u sebe pohranjuje uneseni tekst iz varijable newTask
          // i dalje imamo defaultnu false vrijednost za completed atribut
          // dodan je atribut createdAt koji dohvaća timestamp trenutka kad je todo kreiran
          // metoda addDoc je firebaseova ugrađena metoda koja služi za pohranu dokumenata u kolekcije 
          // prima parametar collection koji definira u koju kolekciju spremamo, db definira bazu u koju spremamo, todos definira todos kolekciju koju smo složili u firebaseu
          // novi task se push-a u array zadataka i za id mu se postavlja id dokumenta u koji je spremljen (to firebase automatski generira za nas...neki random niz slova i brojeva)
          const docRef = await addDoc(collection(db, "todos"), {
            text: this.newTask,
            createdAt: serverTimestamp(),
            completed: false
          });
          this.tasks.push({ id: docRef.id, text: this.newTask, completed: false });
          this.newTask = "";
        }
      },
      // metoda za uređivanje zadatka
      // prima indeks zadatka na koji smo kliknuli (indeks u arrayu..nema veze s firebaseom (0,1,2,3...))
      async editTask(index) {
        // definira se varijabla updatedText koja se puni kroz korisnički prompt i pohranjuje u tasks array na primljenom indeksu u tekst atribut
        const updatedText = prompt("Edit task", this.tasks[index].text);
        // ako smo unesli neki tekst
        if (updatedText !== null) {
          // dohvaća se task iz arraya na tom indeksu
          const task = this.tasks[index];
          // poziva se asinkrona firebase funkcija updateDoc koja prima bazu, naziv kolekcije i id odabranog zadatka koji se nalazio na traženom indeksu
          // override-a tekst u arrayu koji je prije bio na tom indeksu sa tekstom koji smo mi unijeli
          await updateDoc(doc(db, "todos", task.id), { text: updatedText });
          this.tasks[index].text = updatedText;
        }
      },
      // metoda za brisanje zadatka
      async deleteTask(index) {
        // dohvat po prosljeđenom indeksu
        const task = this.tasks[index];
        // traži se id onog zadataka koji se nalazi na tom indeksu
        // poziva se asinkrona metoda deleteDoc koja prima bazu, naziv kolekcije i id odabranog zadatka iz traženog indeksa
        await deleteDoc(doc(db, "todos", task.id));
        // briše se task iz arraya na tom indeksu
        this.tasks.splice(index, 1);
      },
      // metoda za označavanje zadatka kao gotovog
      async toggleCompleted(index) {
        // dohvat po prosljeđenom indeksu
        const task = this.tasks[index];
        // definiranje varijable newStatus u koju se sprema negirani dohvaćeni stari status
        // zašto?
        // imaš todo koji po defaultu ima done = false. 
        // pozoveš metodu toogle completed
        // ona invertira taj status iz false u true ili obratno, ovo se invertira s svakim pozivom odnosno klikom
        const newStatus = !task.completed;
        // poziva se asinkrona metoda awaitDoc koja dohvaća task po id-ju i u completed atribut stavlja vrijednost iz varijable newStatus
        await updateDoc(doc(db, "todos", task.id), { completed: newStatus });
        // ista stvar se dešava i u arrayu taskova
        this.tasks[index].completed = newStatus;
      }
    },
    // vidi alert za skužit čemu služi mounted => sad ima više smisla
    async mounted() {
      alert("Mounted radi nešto čim se stvar pokrene...sad nam dohvaća podatke iz kolekcije u firebaseu (jako cool stvar kad skužite)");
  
      // u querySnapshot se spremaju svi dokumenti iz firebase kolekcije todos
      const querySnapshot = await getDocs(collection(db, "todos"));
      // za svaki dokument u snapshotu dohvaća se njegov sadržaj
      querySnapshot.forEach((docSnap) => {
        // i push-a u array taskova kako bi bili vidljivi na frontendu
        this.tasks.push({ id: docSnap.id, ...docSnap.data() });
      });
    }
  };
  </script>
  
  
  <style>
  /*ovaj moj stil ne valja niš...napravite slobodno bolji ako znate :) ja stvarno ne znannnnn */
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #1f2937, #4b5563, #6b7280, #374151);
    background-size: 400% 400%;
    animation: gradientBG 10s ease infinite;
  }
  
  
  
  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .max-w-2xl {
    width: 100%;
  }
  
  .flex {
    display: flex;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .text-center {
    text-align: center;
  }
  
  .space-x-3 {
    margin-right: 1rem;
  }
  </style>
  