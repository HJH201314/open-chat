import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
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

  const heartbeatInterval = ref<number>();

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
        // 登录成功后，定时查询状态
        clearInterval(heartbeatInterval.value);
        heartbeatInterval.value = window.setInterval(async () => {
          const res = await api.user.current();
          if (!res.data.status || res.data.status != 200) {
            logout(true);
          }
        }, 60000);
        resolve(res.data);
      } else {
        clearInterval(heartbeatInterval.value);
        reject(res);
      }
    }).catch(err => {
      clearInterval(heartbeatInterval.value);
      logout(true);
      reject(err);
    });
  });

  /**
   * 登出
   * @param force 是否强制登出
   */
  function logout(force?: boolean) {
    user_id.value = -1;
    username.value = '未登录';
    permission.value = 0;
    currentUser.value = {};
    clearInterval(heartbeatInterval.value);
    if (!force) {
      // 非强制登出才请求后端
      api.user.logout();
    }
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