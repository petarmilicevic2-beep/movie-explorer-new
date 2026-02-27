<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import MovieCard from '../components/MovieCard.vue'

const route = useRoute()
const router = useRouter()

const movies = ref([])
const isLoading = ref(false)

const API_URL = 'https://api.tvmaze.com'

async function fetchGenreMovies(genre) {
  isLoading.value = true
  movies.value = []

  try {
    const pages = [0, 1, 2, 3, 4]
    const allShows = []

    for (const page of pages) {
      const response = await axios.get(`${API_URL}/shows`, {
        params: { page },
      })
      allShows.push(...response.data)
    }

    const filtered = allShows
      .filter(show => show.genres && show.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
      .map(show => ({
        imdbID: show.id,
        Title: show.name,
        Year: show.premiered ? show.premiered.slice(0, 4) : 'N/A',
        Type: show.type || 'TV',
        Poster: show.image?.original || show.image?.medium || '',
        Rating: show.rating?.average || null,
        Runtime: show.runtime || null,
        Genres: show.genres || [],
        Summary: show.summary ? show.summary.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '',
      }))

    movies.value = filtered
  } catch (e) {
    console.error('Genre error:', e)
  } finally {
    isLoading.value = false
  }
}

function handleMovieSelect(movie) {
  router.push({ name: 'movie-detail', params: { id: movie.imdbID } })
}

watch(() => route.params.genre, (newGenre) => {
  if (newGenre) {
    fetchGenreMovies(newGenre)
  }
}, { immediate: true })

onMounted(() => {
  if (route.params.genre) {
    fetchGenreMovies(route.params.genre)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 py-12 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          class="mb-4 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          @click="router.back()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <h1 class="text-4xl md:text-5xl font-bold text-white">
          {{ route.params.genre }} Movies & Shows
        </h1>
        <p class="text-slate-400 mt-2">{{ movies.length }} titles found</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <MovieCard
          v-for="movie in movies"
          :key="movie.imdbID"
          :movie="movie"
          @click="handleMovieSelect"
        />
      </div>
    </div>
  </div>
</template>