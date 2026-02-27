<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search movies...',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        @input="emit('update:modelValue', $event.target.value)"
        class="w-full pl-11 pr-4 py-3 bg-slate-800/60 border-2 border-slate-700/50 rounded-full
               text-slate-100 placeholder:text-slate-500 placeholder:text-sm
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition-all duration-200
               hover:bg-slate-800/80 hover:border-slate-600
               backdrop-blur-sm shadow-lg text-base"
      />
    </div>
  </div>
</template>