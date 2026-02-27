<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const movie = ref(null)
const cast = ref([])
const isLoading = ref(false)
const error = ref('')

const API_URL = 'https://api.tvmaze.com'

async function fetchMovieDetail(id) {
  if (!id) return
  isLoading.value = true
  error.value = ''
  movie.value = null
  cast.value = []

  try {
    const response = await axios.get(`${API_URL}/shows/${id}`, {
      params: { embed: 'cast' },
    })
    
    const show = response.data
    const embeddedCast = response.data._embedded?.cast || []

    movie.value = {
      Title: show.name,
      Year: show.premiered ? show.premiered.slice(0, 4) : 'N/A',
      Runtime: show.runtime ? `${show.runtime} min` : 'N/A',
      Genre: show.genres?.join(', ') || 'N/A',
      Rating: show.rating?.average || null,
      Plot: show.summary
        ? show.summary.replace(/<[^>]+>/g, '')
        : 'No description available.',
      Poster: show.image?.original || show.image?.medium || '',
      Network: show.network?.name || show.webChannel?.name || 'N/A',
      Status: show.status || 'N/A',
      Language: show.language || 'N/A',
      Premiered: show.premiered || 'N/A',
      Ended: show.ended || null,
      OfficialSite: show.officialSite || null,
      Schedule: show.schedule ? `${show.schedule.days.join(', ')} at ${show.schedule.time}` : 'N/A',
    }

    // Glumci (uzmi prvih 10)
    cast.value = embeddedCast.slice(0, 10).map(actor => ({
      name: actor.person.name,
      character: actor.character.name,
      image: actor.person.image?.medium || null,
    }))
  } catch (e) {
    console.error('Detail error:', e)
    error.value = 'Failed to load movie.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMovieDetail(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    fetchMovieDetail(newId)
  }
)

function goBack() {
  router.back()
}
</script>

<template>
  <section class="max-w-5xl mx-auto py-10">
    <!-- Back Button -->
    <button
      type="button"
      class="mb-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
      @click="goBack"
    >
      <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-sm font-medium">Back to results</span>
    </button>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-400 text-sm">Loading details...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-red-400 text-sm font-medium">{{ error }}</p>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie" class="flex flex-col md:flex-row items-start gap-8 md:gap-10">
      <!-- Poster (lijevo) -->
      <div class="shrink-0 w-full md:w-auto flex justify-center md:justify-start">
        <div class="w-32 sm:w-40 md:w-44 lg:w-48">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900">
            <img
              v-if="movie.Poster"
              :src="movie.Poster"
              :alt="movie.Title"
              class="w-full aspect-[2/3] object-cover"
            />
            <div v-else class="w-full aspect-[2/3] flex items-center justify-center text-slate-500">
              <svg class="w-20 h-20 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Info (desno) -->
      <div class="flex-1 min-w-0 space-y-8">
        <!-- Title -->
        <div>
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {{ movie.Title }}
          </h1>
          <div class="flex flex-wrap items-center gap-4">
            <span
              v-if="movie.Runtime !== 'N/A'"
              class="px-3 py-1 rounded-full text-xs font-semibold text-slate-200 bg-slate-800/60 border border-slate-700/60"
            >
              {{ movie.Runtime }}
            </span>
            <span
              v-if="movie.Rating"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-slate-200 bg-slate-800/60 border border-slate-700/60"
            >
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{{ movie.Rating }}/10</span>
            </span>
            <span
              v-if="movie.Status !== 'N/A'"
              class="px-3 py-1 rounded-full text-xs font-semibold text-slate-200 bg-indigo-500/15 border border-indigo-500/30"
            >
              {{ movie.Status }}
            </span>
          </div>
        </div>

        <!-- Plot -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-2">Overview</h3>
          <p class="text-slate-300 leading-relaxed">
            {{ movie.Plot }}
          </p>
        </div>

        <!-- Details Grid -->
        <div class="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 md:p-6">
          <div class="grid grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <h4 class="text-sm font-semibold text-slate-400 mb-1">Genre</h4>
            <p class="text-slate-200">{{ movie.Genre }}</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-slate-400 mb-1">Language</h4>
            <p class="text-slate-200">{{ movie.Language }}</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-slate-400 mb-1">Network</h4>
            <p class="text-slate-200">{{ movie.Network }}</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-slate-400 mb-1">Schedule</h4>
            <p class="text-slate-200">{{ movie.Schedule }}</p>
          </div>
          </div>
        </div>

        <!-- Cast -->
        <div v-if="cast.length > 0">
          <h3 class="text-lg font-semibold text-slate-200 mb-4">Cast</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="actor in cast"
              :key="actor.name"
              class="flex flex-col items-center text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
            >
              <div class="w-16 h-16 rounded-full overflow-hidden mb-2 bg-slate-700">
                <img
                  v-if="actor.image"
                  :src="actor.image"
                  :alt="actor.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  {{ actor.name.charAt(0) }}
                </div>
              </div>
              <p class="text-sm font-semibold text-slate-200">{{ actor.name }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ actor.character }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>