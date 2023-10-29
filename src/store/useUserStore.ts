import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from '@/api';

// setup 风格的 store
// https://pinia.vuejs.org/core-concepts/#Setup-Stores
/* 用户相关 */
export const useUserStore  = defineStore('user', () => {
  const avatar = ref('src/assets/image/default_avatar.jpg');
  const username = ref('');
  const user_id = ref(-1);

  const isLogin = computed(() => {
    return user_id.value >= 0;
  });

  const login = async (username: string, password: string) => new Promise((resolve, reject) => {
    api.user.login({
      username,
      password,
    }).then(res => {
      if (res.data.status === 200) {
        user_id.value = res.data.data.userId ?? -1;
        resolve(res.data);
      } else {
        reject(res);
      }
    }).catch(err => {
      reject(err);
    });
  });

  function logout() {
    user_id.value = -1;
    api.user.logout({});
  }

  return {
    avatar,
    isLogin,
    user_id,
    login,
    logout,
  }
});