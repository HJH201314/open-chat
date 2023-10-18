import { createRouter, createWebHistory } from 'vue-router'
import MessagePage from '@/pages/message/MessagePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/message'
    },
    {
      path: '/message',
      name: 'message',
      component: MessagePage
    }
  ]
})

export default router
