<template>
  <header class="app-header">
    <a class="a_title" href="/">
      <h1 class="app-title">Express</h1>
    </a>
  </header>

  <div id="my-app">
    <div class="container">
      <div class="posts-section">
        <h1>Publications récentes</h1>

        <div class="spiner-container" v-if="loading">
          <LoadingSpinner />
        </div>

        <div v-else-if="visiblePosts.length">
          <div class="posts-items">
            <PostItem
              v-for="post in visiblePosts"
              :key="post.id"
              :post="post"
              :isSaved="isPostSaved(post)"
              @toggle-save="toggleSavePost"
            />
            <button v-if="hasMorePosts" @click="loadMorePosts">Charger plus</button>
          </div>
        </div>

        <div v-else>
          <p>Aucune publication disponible.</p>
        </div>
      </div>

      <div class="aside-section">
        <h2>Publications enregistrées</h2>
        <div v-if="savedPosts.length">
          <div class="posts-items">
            <PostItem
              v-for="post in savedPosts"
              :key="post.id"
              :post="post"
              :isSaved="true"
              @toggle-save="toggleSavePost"
            />
          </div>
        </div>
        <div v-else>
          <p>Aucun post enregistré pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
  <footer v-if="visiblePosts.length">
    <p>Créé par Yassine avec ❤️ pour Tekab Dev</p>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PostItem from './components/PostItem.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

const allPosts = ref([])
const visiblePosts = ref([])
const savedPosts = ref([])
const postsPerPage = 3
const currentIndex = ref(0)
const loading = ref(true)

const hasMorePosts = computed(() => currentIndex.value < allPosts.value.length)

const loadMorePosts = () => {
  const nextIndex = currentIndex.value + postsPerPage
  const newPosts = allPosts.value.slice(currentIndex.value, nextIndex)
  visiblePosts.value.push(...newPosts)
  currentIndex.value = nextIndex
}

const toggleSavePost = (post) => {
  const isSaved = isPostSaved(post)
  if (isSaved) {
    savedPosts.value = savedPosts.value.filter((p) => p.id !== post.id)
  } else {
    savedPosts.value.push(post)
  }
  localStorage.setItem('savedPosts', JSON.stringify(savedPosts.value))
}

const isPostSaved = (post) => savedPosts.value.some((p) => p.id === post.id)

onMounted(async () => {
  try {
    const response = await fetch('https://express-worker.yassinealmaamri.workers.dev/')
    const fetchedPosts = await response.json()
    allPosts.value = fetchedPosts
    loadMorePosts()

    const saved = JSON.parse(localStorage.getItem('savedPosts')) || []
    savedPosts.value = saved
  } catch (error) {
    console.error('Erreur de récupération des publications:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style>
body {
  margin: 0;
}
.app-header {
  background-color: #42b983;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.a_title {
  text-decoration: none;
}
.app-title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}
#my-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
.container {
  display: flex;
}
.posts-section {
  flex-basis: 60%;
}
.spiner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.posts-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.aside-section {
  flex-basis: 40%;
  padding: 20px;
}
button {
  background-color: #dc143c;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s ease;
}
button:hover {
  background-color: #b22222;
}
footer {
  margin-top: 40px;
  margin-bottom: 20px;
}
footer p {
  text-align: center;
  color: black;
  font-family: 'Poppins', sans-serif;

  font-weight: 300;
  font-size: 14px;
}
@media (max-width: 1000px) {
  .container {
    flex-direction: column;
  }
}
</style>
