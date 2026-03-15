<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  genres: {
    type: Array,
    default: () => [],
  },
  selectedGenre: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'update:selectedGenre', 'submit'])

const handleInput = event => {
  emit('update:modelValue', event.target.value)
}

const handleGenreChange = event => {
  emit('update:selectedGenre', event.target.value)
}

const handleSubmit = event => {
  event.preventDefault()
  emit('submit')
}
</script>

<template>
  <form
    @submit="handleSubmit"
    class="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3 shadow-lg shadow-black/40 backdrop-blur md:flex-row md:items-center md:gap-4 md:p-4"
  >
    <div class="flex-1">
      <label class="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        Pretraži katalog
      </label>
      <div
        class="group flex items-center gap-2 rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-slate-700/70 transition focus-within:ring-2 focus-within:ring-indigo-500/80"
      >
        <span class="text-slate-500">
          🔍
        </span>
        <input
          :value="props.modelValue"
          @input="handleInput"
          type="search"
          placeholder="Upiši naziv filma ili serije..."
          class="w-full bg-transparent text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1 md:w-56">
      <label class="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        Žanr
      </label>
      <select
        :value="props.selectedGenre"
        @change="handleGenreChange"
        class="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">Svi žanrovi</option>
        <option v-for="genre in genres" :key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>
    </div>

    <button
      type="submit"
      class="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 px-4 py-2 text-sm font-semibold tracking-wide text-white shadow-lg shadow-indigo-900/50 transition hover:brightness-110 md:mt-6"
    >
      Traži
    </button>
  </form>
</template>

