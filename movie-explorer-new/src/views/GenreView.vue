<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAllShows } from '../api/movies'
import MovieCard from '../components/MovieCard.vue'

const route = useRoute()

const shows = ref([])
const loading = ref(false)
const error = ref('')

const currentGenre = computed(() => route.params.name || '')

const filteredShows = computed(() =>
  shows.value.filter(show => show.genres.includes(currentGenre.value)),
)

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

onMounted(() => {
  loadShows()
})
</script>

<template>
  <section class="space-y-5 md:space-y-7">
    <header class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
        Žanr
      </p>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
        {{ currentGenre || 'Svi žanrovi' }}
      </h1>
      <p class="text-sm text-slate-300">
        Pregled naslova koji pripadaju odabranom žanru.
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
</template>

