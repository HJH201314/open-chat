import { defineStore } from "pinia";
import { ref } from "vue";

// setup 风格的 store
// https://pinia.vuejs.org/core-concepts/#Setup-Stores
/* 用户相关 */
export const useUserStore  = defineStore('user', () => {
  const avatar = ref('');
  const username = ref('');
  const user_id = ref(-1);

  function login(username: string, password: string) {

  }

  function logout() {

  }

  return {
    user_id,
    login,
    logout,
  }
});