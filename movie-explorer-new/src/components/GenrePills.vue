<script setup>
const props = defineProps({
  genres: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const selectGenre = genre => {
  emit('update:modelValue', props.modelValue === genre ? '' : genre)
}
</script>

<template>
  <section class="space-y-2">
    <header class="flex items-center justify-between">
      <h2 class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Popularni žanrovi
      </h2>
    </header>
    <div class="flex gap-2 overflow-x-auto pb-1 pt-1">
      <button
        type="button"
        class="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition"
        :class="
          modelValue === ''
            ? 'border-indigo-500/70 bg-indigo-500/20 text-indigo-100 shadow shadow-indigo-900/50'
            : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:text-white'
        "
        @click="selectGenre('')"
      >
        Sve
      </button>
      <button
        v-for="genre in genres"
        :key="genre"
        type="button"
        class="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition"
        :class="
          modelValue === genre
            ? 'border-indigo-500/70 bg-indigo-500/20 text-indigo-100 shadow shadow-indigo-900/50'
            : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:text-white'
        "
        @click="selectGenre(genre)"
      >
        {{ genre }}
      </button>
    </div>
  </section>
</template>

