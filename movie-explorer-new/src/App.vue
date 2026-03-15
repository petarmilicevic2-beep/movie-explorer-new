<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
    <header
      class="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div class="flex items-center gap-2">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 text-xs font-semibold tracking-wide"
          >
            MX
          </div>
          <div class="leading-tight">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
              Movie Explorer
            </p>
            <p class="text-xs text-slate-400">Stream-inspired movie browser</p>
          </div>
        </div>
        <nav class="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <RouterLink
            to="/"
            class="transition hover:text-white"
            active-class="text-white"
            exact-active-class="text-white"
          >
            Početna
          </RouterLink>
          <RouterLink
            to="/genre/Drama"
            class="transition hover:text-white"
            active-class="text-white"
          >
            Žanrovi
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pb-10 pt-4 md:px-6 md:pb-12 md:pt-6">
      <RouterView />
    </main>
  </div>
</template>
