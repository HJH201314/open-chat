import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from '@/api';

// setup 风格的 store
// https://pinia.vuejs.org/core-concepts/#Setup-Stores
/* 用户相关 */
export const useUserStore  = defineStore('user', () => {
  const avatar = ref('');
  const username = ref('');
  const user_id = ref(-1);

  const isLogin = computed(() => {
    return user_id.value >= 0;
  });

  function login(username: string, password: string) {
    api.user.login({
      username,
      password,
    }).then((res) => {
      if (res.status === 200) {
        user_id.value = res.data.data.userId ?? -1;
      }
    });
  }

  function logout() {
    user_id.value = -1;
    api.user.logout({});
  }

  return {
    isLogin,
    user_id,
    login,
    logout,
  }
});