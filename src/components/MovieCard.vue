<script setup>
import { ref } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])

const showInfo = ref(false)
</script>

<template>
  <div
    class="relative group w-full"
    @mouseenter="showInfo = true"
    @mouseleave="showInfo = false"
  >
    <button
      type="button"
      class="relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all duration-300"
      @click="emit('click', movie)"
    >
      <!-- Poster -->
      <img
        v-if="movie.Poster && movie.Poster !== 'N/A'"
        :src="movie.Poster"
        :alt="movie.Title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <svg class="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Hover Overlay s Info -->
      <div
        v-if="showInfo"
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-4"
      >
        <h3 class="text-white font-semibold text-sm mb-3 line-clamp-2">{{ movie.Title }}</h3>
        
        <!-- Info s ikonama -->
        <div class="space-y-2">
          <!-- Trajanje -->
          <div v-if="movie.Runtime" class="flex items-center gap-2 text-xs text-slate-300">
            <svg class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ movie.Runtime }} min</span>
          </div>

          <!-- Žanr -->
          <div v-if="movie.Genres && movie.Genres.length > 0" class="flex items-center gap-2 text-xs text-slate-300">
            <svg class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="line-clamp-1">{{ movie.Genres.slice(0, 2).join(', ') }}</span>
          </div>

          <!-- Ocjena -->
          <div v-if="movie.Rating" class="flex items-center gap-2 text-xs text-slate-300">
            <svg class="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>IMDB: <span class="font-semibold text-white">{{ movie.Rating }}</span>/10</span>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>