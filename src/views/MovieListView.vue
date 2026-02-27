<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import SearchBar from '../components/SearchBar.vue'
import MovieCard from '../components/MovieCard.vue'

const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('popular')
const allMovies = ref([])
const popularMovies = ref([])
const mostStreamedMovies = ref([])
const newMovies = ref([])
const isLoading = ref(false)
const showGenreMenu = ref(false)

const API_URL = 'https://api.tvmaze.com'

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
  'Thriller', 'Crime', 'Mystery', 'Fantasy', 'Romance', 'Animation',
  'Documentary', 'Family', 'Music', 'War', 'Western'
]

async function fetchAllMovies() {
  isLoading.value = true

  try {
    const pages = [0, 1, 2, 3, 4]
    const allShows = []

    for (const page of pages) {
      const response = await axios.get(`${API_URL}/shows`, {
        params: { page },
      })
      allShows.push(...response.data)
    }

    const mapped = allShows.map(show => ({
      imdbID: show.id,
      Title: show.name,
      Year: show.premiered ? show.premiered.slice(0, 4) : 'N/A',
      Type: show.type || 'TV',
      Poster: show.image?.original || show.image?.medium || '',
      Rating: show.rating?.average || null,
      Runtime: show.runtime || null,
      Genres: show.genres || [],
      Summary: show.summary ? show.summary.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '',
      Updated: show.updated || null,
    }))

    allMovies.value = mapped
    popularMovies.value = [...mapped].filter(m => m.Rating).sort((a, b) => b.Rating - a.Rating).slice(0, 50)
    mostStreamedMovies.value = [...mapped].filter(m => m.Updated).sort((a, b) => new Date(b.Updated || 0) - new Date(a.Updated || 0)).slice(0, 50)
    newMovies.value = [...mapped].filter(m => m.Year && m.Year >= '2020').sort((a, b) => b.Year.localeCompare(a.Year)).slice(0, 50)
  } catch (e) {
    console.error('Movies error:', e)
  } finally {
    isLoading.value = false
  }
}

async function fetchMovies(query) {
  if (!query || query.trim() === '') {
    fetchAllMovies()
    return
  }

  isLoading.value = true

  try {
    const response = await axios.get(`${API_URL}/search/shows`, {
      params: { q: query },
    })

    const mapped = response.data.map(item => {
      const show = item.show
      return {
        imdbID: show.id,
        Title: show.name,
        Year: show.premiered ? show.premiered.slice(0, 4) : 'N/A',
        Type: show.type || 'TV',
        Poster: show.image?.original || show.image?.medium || '',
        Rating: show.rating?.average || null,
        Runtime: show.runtime || null,
        Genres: show.genres || [],
        Summary: show.summary ? show.summary.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '',
        Updated: show.updated || null,
      }
    })

    allMovies.value = mapped
    popularMovies.value = mapped.filter(m => m.Rating).sort((a, b) => b.Rating - a.Rating).slice(0, 50)
    mostStreamedMovies.value = mapped.filter(m => m.Updated).sort((a, b) => new Date(b.Updated || 0) - new Date(a.Updated || 0)).slice(0, 50)
    newMovies.value = mapped.filter(m => m.Year && m.Year >= '2020').sort((a, b) => b.Year.localeCompare(a.Year)).slice(0, 50)
  } catch (e) {
    console.error('Movies error:', e)
  } finally {
    isLoading.value = false
  }
}

const currentMovies = computed(() => {
  switch (activeCategory.value) {
    case 'popular':
      return popularMovies.value
    case 'streamed':
      return mostStreamedMovies.value
    case 'new':
      return newMovies.value
    default:
      return popularMovies.value
  }
})

// Filmovi za donju grid sekciju - režu se na pune redove od 4
const gridMovies = computed(() => {
  const movies = currentMovies.value || []
  if (movies.length <= 4) return movies
  const fullRows = Math.floor(movies.length / 4)
  return movies.slice(0, fullRows * 4)
})

const heroCollage = computed(() => {
  return popularMovies.value.slice(0, 12).filter(m => m.Poster && m.Poster !== 'N/A')
})

function handleMovieSelect(movie) {
  if (movie) {
    router.push({ name: 'movie-detail', params: { id: movie.imdbID } })
  }
}

function goToGenre(genre) {
  router.push({ name: 'genre', params: { genre } })
}

watch(searchQuery, (newQuery) => {
  if (newQuery.trim() === '') {
    fetchAllMovies()
  } else {
    fetchMovies(newQuery)
  }
})

onMounted(() => {
  fetchAllMovies()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative min-h-screen w-full overflow-hidden">
      <!-- Kolaz pozadina - 3 ravnomjerne trećine -->
      <div
        v-if="heroCollage.length > 0"
        class="absolute inset-0 grid grid-cols-3 gap-2 opacity-50 z-0"
      >
        <div
          v-for="movie in heroCollage.slice(0, 3)"
          :key="movie.imdbID"
          class="relative overflow-hidden rounded-lg"
        >
          <img
            :src="movie.Poster"
            :alt="movie.Title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>
      </div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950 z-10"></div>

      <!-- Content - IZNAD OVERLAY-A -->
      <div class="relative z-50 min-h-screen flex flex-col">
        <!-- Header -->
        <div class="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 gap-4 md:gap-6">
          <!-- LIJEVA STRANA: Naslov + Genres -->
          <div class="flex flex-col gap-3 flex-shrink-0">
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-[0_0_30px_rgba(0,0,0,1)] tracking-tight">
              AJP Movies & Shows
            </h1>
            <div class="relative inline-flex">
              <button
                class="px-7 py-3 bg-slate-900/90 backdrop-blur-xl rounded-full text-sm md:text-base font-bold tracking-wide uppercase text-white border-2 border-black/80 shadow-[0_0_20px_rgba(0,0,0,0.9)] hover:bg-slate-800 hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(79,70,229,0.8)] transition-all duration-200"
                @mouseenter="showGenreMenu = true"
                @mouseleave="showGenreMenu = false"
              >
                Genres
              </button>
              
              <div
                v-if="showGenreMenu"
                class="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl p-4 grid grid-cols-2 gap-2 z-50"
                @mouseenter="showGenreMenu = true"
                @mouseleave="showGenreMenu = false"
              >
                <button
                  v-for="genre in genres"
                  :key="genre"
                  class="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-all text-left"
                  @click="goToGenre(genre)"
                >
                  {{ genre }}
                </button>
              </div>
            </div>
          </div>

          <!-- DESNA STRANA: Kategorije + Search (sve desno, search ispod) -->
          <div class="flex flex-col items-stretch md:items-end gap-3 w-full md:max-w-md">
            <!-- Kategorije Tabs -->
            <div class="flex flex-wrap justify-center md:justify-end gap-2 bg-slate-950/80 backdrop-blur-xl rounded-full p-2 border-2 border-black/80 shadow-[0_0_25px_rgba(0,0,0,0.9)]">
              <button
                v-for="cat in [
                  { id: 'popular', label: 'Popular' },
                  { id: 'streamed', label: 'Most Streamed' },
                  { id: 'new', label: 'New To' }
                ]"
                :key="cat.id"
                :class="[
                  'px-4 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold tracking-wide uppercase transition-all duration-200 border-2 border-black/80 bg-slate-900/90 text-white shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(79,70,229,0.8)]',
                  activeCategory === cat.id ? 'scale-105 ring-2 ring-indigo-400/70' : ''
                ]"
                @click="activeCategory = cat.id"
              >
                {{ cat.label }}
              </button>
            </div>

            <!-- Search Bar - manji ispod kategorija, desno / centriran na manjim ekranima -->
            <div class="w-full max-w-xs md:max-w-[260px] self-center md:self-end">
              <SearchBar
                v-model="searchQuery"
                placeholder="Search: Breaking Bad, Stranger Things..."
              />
            </div>
          </div>
        </div>

        <!-- Hero Content Center -->
        <div class="flex-1 flex items-center justify-center px-4 md:px-8 pb-8 md:pb-12">
          <div class="text-center max-w-3xl">
            <h2 v-if="currentMovies.length > 0" class="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              {{ currentMovies[0].Title }}
            </h2>
            <h2 v-else class="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Discover Amazing Content
            </h2>
            <p v-if="currentMovies.length > 0" class="text-xl text-slate-300 mb-8 line-clamp-2 drop-shadow-lg font-bold">
              {{ currentMovies[0].Summary }}
            </p>
            <p v-else class="text-xl text-slate-300 mb-8 drop-shadow-lg font-bold">
              Watch Thousands of Free Movies and TV Shows
            </p>

            <!-- Play Button u sredini ispod opisa - poboljšan izgled -->
            <div class="flex justify-center">
              <button
                v-if="currentMovies.length > 0"
                class="inline-flex items-center gap-3 px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold text-lg tracking-wide uppercase transition-all shadow-[0_0_25px_rgba(129,140,248,0.9)] hover:scale-105 border border-indigo-300/80"
                @click="handleMovieSelect(currentMovies[0])"
              >
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Scroll Sekcija (bez naslova Continue Watching) -->
        <div class="bg-slate-950 py-10 px-4 md:px-8">
      <div class="max-w-7xl mx-auto">
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>

        <!-- 4 MANJA FILMA U REDU, responzivno -->
        <div v-else-if="gridMovies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <MovieCard
            v-for="movie in gridMovies"
            :key="movie.imdbID"
            :movie="movie"
            @click="handleMovieSelect"
          />
        </div>

        <div v-else class="text-center py-20">
          <p class="text-slate-400 font-bold">No Movies Found</p>
        </div>
      </div>
    </div>
  </div>
</template>