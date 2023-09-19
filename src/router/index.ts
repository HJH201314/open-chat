import { createRouter, createWebHistory } from 'vue-router'
import RecordPage from '@/pages/RecordPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/record'
    },
    {
      path: '/record',
      name: 'record',
      component: RecordPage
    }
  ]
})

export default router
