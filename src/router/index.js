import { createRouter, createWebHistory } from 'vue-router'
import MovieListView from '../views/MovieListView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import GenreView from '../views/GenreView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MovieListView,
  },
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: MovieDetailView,
    props: true,
  },
  {
    path: '/genre/:genre',
    name: 'genre',
    component: GenreView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router