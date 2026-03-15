<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllShows } from '../api/movies'
import SearchBar from '../components/SearchBar.vue'
import GenrePills from '../components/GenrePills.vue'
import MovieCard from '../components/MovieCard.vue'

const router = useRouter()

const shows = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedGenre = ref('')
const submittedQuery = ref('')

const highlighted = computed(() =>
  shows.value.length ? shows.value[0] : null,
)

const genres = computed(() => {
  const set = new Set()
  for (const show of shows.value) {
    for (const genre of show.genres) {
      if (genre) set.add(genre)
    }
  }
  return Array.from(set).sort()
})

const filteredShows = computed(() => {
  let result = [...shows.value]

  if (submittedQuery.value) {
    const query = submittedQuery.value.toLowerCase()
    result = result.filter(show =>
      show.title.toLowerCase().includes(query),
    )
  }

  if (selectedGenre.value) {
    result = result.filter(show =>
      show.genres.includes(selectedGenre.value),
    )
  }

  return result
})

watch(selectedGenre, value => {
  if (value) {
    router.push({ name: 'genre', params: { name: value } })
  }
})

const loadShows = async () => {
  loading.value = true
  error.value = ''
  try {
    shows.value = await fetchAllShows()
  } catch (err) {
    error.value = err.message || 'Dogodila se greška.'
  } finally {
    loading.value = false
  }
}

const handleSearchSubmit = () => {
  submittedQuery.value = searchQuery.value.trim()
}

onMounted(() => {
  loadShows()
})
</script>

<template>
  <section class="space-y-8 md:space-y-10">
    <div
      class="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 px-4 py-6 shadow-2xl shadow-black/70 md:px-8 md:py-9"
    >
      <div
        class="pointer-events-none absolute -left-10 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
      ></div>
      <div
        class="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl"
      ></div>

      <div class="relative grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] md:items-center">
        <div class="space-y-4 md:space-y-6">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
            Personalizirani katalog
          </p>
          <h1 class="text-balance text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            Otkrij nove favorite, kao na omiljenoj streaming platformi.
          </h1>
          <p class="max-w-xl text-sm text-slate-300 md:text-base">
            Pregledaj katalog serija i filmova, filtriraj po žanrovima i brzo pronađi
            idući naslov za binge. Brzo, responzivno i ugodno za korištenje.
          </p>
        </div>

        <div class="relative">
          <div
            class="float-right h-40 w-40 rotate-3 overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/80 shadow-xl shadow-black/70 sm:h-52 sm:w-40"
          >
            <img
              v-if="highlighted?.backdrop"
              :src="highlighted.backdrop"
              :alt="highlighted.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/30 to-rose-500/30 text-xs text-slate-100"
            >
              Učitavanje kataloga...
            </div>
          </div>
        </div>
      </div>

      <div class="relative mt-6 md:mt-8">
        <SearchBar
          v-model="searchQuery"
          :genres="genres"
          :selected-genre="selectedGenre"
          @update:selectedGenre="value => (selectedGenre = value)"
          @submit="handleSearchSubmit"
        />
      </div>
    </div>

    <GenrePills v-model="selectedGenre" :genres="genres" />

    <section class="space-y-4">
      <header class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-100">
          {{ selectedGenre || 'Svi naslovi' }}
        </h2>
        <p class="text-xs text-slate-400">
          Pronađeno: <span class="font-medium text-slate-100">{{ filteredShows.length }}</span>
        </p>
      </header>

      <div v-if="error" class="rounded-2xl border border-rose-500/40 bg-rose-900/30 p-4 text-sm">
        {{ error }}
      </div>

      <div
        v-else-if="loading"
        class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        <div
          v-for="n in 10"
          :key="n"
          class="animate-pulse rounded-2xl bg-slate-900/70"
        >
          <div class="aspect-[2/3] rounded-2xl bg-slate-800/80"></div>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        <MovieCard
          v-for="movie in filteredShows"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </section>
  </section>
</template>

