import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const sessionKey = ref<string>(''); // 会话key

  return { sessionKey }
})
