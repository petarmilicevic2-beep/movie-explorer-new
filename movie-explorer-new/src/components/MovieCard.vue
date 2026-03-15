<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const openDetails = () => {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } })
}
</script>

<template>
  <article
    class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-lg shadow-black/50 transition hover:-translate-y-1 hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-900/60"
    @click="openDetails"
  >
    <div class="relative aspect-[2/3] overflow-hidden bg-slate-900">
      <img
        v-if="movie.image"
        :src="movie.image"
        :alt="movie.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-xs text-slate-400"
      >
        Nema slike
      </div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"
      ></div>
      <span
        v-if="movie.rating"
        class="absolute left-2 top-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-400/40 backdrop-blur"
      >
        ★ {{ movie.rating.toFixed(1) }}
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <h3 class="line-clamp-1 text-sm font-semibold text-slate-50">
        {{ movie.title }}
      </h3>
      <p class="text-xs text-slate-400">
        {{ movie.year }} • {{ movie.language || 'N/A' }}
      </p>
      <div class="mt-1 flex flex-wrap gap-1">
        <span
          v-for="genre in movie.genres.slice(0, 3)"
          :key="genre"
          class="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300"
        >
          {{ genre }}
        </span>
      </div>
    </div>
  </article>
</template>

