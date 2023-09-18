import { createRouter, createWebHistory } from 'vue-router'
import RecordView from '../views/RecordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'record',
      component: RecordView
    },
    {
      path: '/record',
      name: 'record',
      component: RecordView
    }
  ]
})

export default router
