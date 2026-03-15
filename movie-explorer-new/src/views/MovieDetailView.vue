<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchShowById } from '../api/movies'

const route = useRoute()
const router = useRouter()

const movie = ref(null)
const loading = ref(false)
const error = ref('')

const loadMovie = async () => {
  loading.value = true
  error.value = ''
  try {
    movie.value = await fetchShowById(route.params.id)
  } catch (err) {
    error.value = err.message || 'Dogodila se greška.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMovie()
})
</script>

<template>
  <section v-if="movie" class="space-y-6 md:space-y-8">
    <div
      class="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-2xl shadow-black/70"
    >
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"
      ></div>
      <img
        v-if="movie.backdrop"
        :src="movie.backdrop"
        :alt="movie.title"
        class="h-64 w-full object-cover md:h-80"
      />

      <div class="relative px-4 pb-5 pt-28 md:px-8 md:pb-7 md:pt-40">
        <button
          type="button"
          class="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/60 backdrop-blur transition hover:bg-slate-900/90"
          @click="router.back()"
        >
          ← Natrag
        </button>
        <h1 class="text-balance text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          {{ movie.title }}
        </h1>
        <p class="mt-2 text-sm text-slate-300">
          {{ movie.year }} •
          <span v-if="movie.genres.length">{{ movie.genres.join(' • ') }}</span>
        </p>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span
            v-if="movie.rating"
            class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-200 ring-1 ring-amber-500/40"
          >
            ★ {{ movie.rating.toFixed(1) }} / 10
          </span>
          <span
            v-if="movie.runtime"
            class="rounded-full bg-slate-900/80 px-2.5 py-1 text-slate-200 ring-1 ring-slate-700/70"
          >
            ⏱ {{ movie.runtime }} min
          </span>
          <span
            v-if="movie.status"
            class="rounded-full bg-slate-900/80 px-2.5 py-1 text-slate-300 ring-1 ring-slate-700/70"
          >
            {{ movie.status }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
      <article class="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5">
        <h2 class="text-sm font-semibold text-slate-100">Sažetak</h2>
        <p class="text-sm leading-relaxed text-slate-300">
          {{ movie.summary || 'Za ovaj naslov nema dodatnog opisa.' }}
        </p>
      </article>

      <aside class="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5">
        <h2 class="text-sm font-semibold text-slate-100">Detalji</h2>
        <dl class="space-y-2 text-sm text-slate-300">
          <div class="flex justify-between gap-4">
            <dt class="text-slate-400">Jezik</dt>
            <dd class="font-medium text-slate-100">{{ movie.language || 'Nepoznato' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-slate-400">Status</dt>
            <dd class="font-medium text-slate-100">{{ movie.status || 'Nepoznato' }}</dd>
          </div>
          <div v-if="movie.schedule?.time || movie.schedule?.days?.length" class="flex flex-col gap-1">
            <dt class="text-slate-400">Raspored</dt>
            <dd class="font-medium text-slate-100">
              <span v-if="movie.schedule?.days?.length">
                {{ movie.schedule.days.join(', ') }}
              </span>
              <span v-if="movie.schedule?.time" class="ml-1">
                u {{ movie.schedule.time }}h
              </span>
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  </section>

  <section
    v-else-if="loading"
    class="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 text-sm text-slate-200"
  >
    Učitavanje detalja...
  </section>

  <section
    v-else
    class="rounded-3xl border border-rose-500/40 bg-rose-950/80 p-6 text-sm text-rose-50"
  >
    {{ error || 'Nije moguće pronaći traženi naslov.' }}
  </section>
</template>

