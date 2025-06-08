import { createRouter, createWebHistory } from 'vue-router'
import Home                               from '../views/Home.vue'
import Transacoes                         from '../views/Transacoes.vue'

const routes = [
  { path: '/'          , name: 'Home'      , component: Home       },
  { path: '/transacoes', name: 'Transacoes', component: Transacoes }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
