import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import api from '@/api';

// setup 风格的 store
// https://pinia.vuejs.org/core-concepts/#Setup-Stores
/* 用户相关 */
export const useUserStore  = defineStore('user', () => {
  const avatar = ref('https://avatars.githubusercontent.com/u/24362351?v=4');
  const username = ref('未登录');
  const user_id = ref(-1);
  const permission = ref(0);
  const currentUser = ref<API.LoginResult>({});

  const isLogin = computed(() => {
    return user_id.value >= 0;
  });

  onMounted(() => {
    // 自动登录逻辑
    const up = localStorage.getItem('up');
    if (up) {
      const ups = atob(up).split(',');
      if (new Date().getTime() < parseInt(ups[2])) {
        login(ups[0], ups[1]);
      }
    }
  });

  const login = async (_username: string, _password: string, _remember: boolean = false) => new Promise((resolve, reject) => {
    api.user.login({
      username: _username,
      password: _password,
    }).then(res => {
      if (res.data.status === 200) {
        user_id.value = res.data.data.id ?? -1;
        username.value = _username ?? '匿名用户';
        permission.value = res.data.data.permission ?? 0;
        currentUser.value = res.data.data;
        if (_remember) {
          // 记忆自动登录信息
          localStorage.setItem('up', btoa(`${_username},${_password},${new Date().getTime()+3*24*60*60*1000}`));
        }
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
    api.user.logout();
  }

  return {
    avatar,
    isLogin,
    user_id,
    username,
    permission,
    currentUser,
    login,
    logout,
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}