import api from '@/api';
import { useIntervalFn } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';

/* 用户相关 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token'));
  const avatar = ref('/favicon.ico');
  const currentUser = ref<API.UserLoginResult>({});
  const loginStatus = ref<'login' | 'logout' | 'offline'>('logout');
  const isLogin = computed(() => {
    // 状态不为登出即视作已登录，offline 状态允许再次请求进行尝试
    return loginStatus.value !== 'logout';
  });
  const username = computed(() => currentUser.value.username ?? '未登录');
  const userId = computed(() => currentUser.value.id ?? -1);
  const permission = ref(0);

  // 每小时 ping 一下确认登录过期没
  const { pause: pausePing, resume: resumePing } = useIntervalFn(
    async () => {
      await ping();
    },
    3600000,
    {
      immediate: false,
    }
  );

  onMounted(async () => {
    // 自动登录逻辑
    await ping();
  });

  const ping = async () => {
    const res = await api.user.ping();
    if (res === false) {
      // 切换到 offline 表明登录态可能存在问题
      loginStatus.value = 'offline';
    } else {
      loginStatus.value = 'login';
      currentUser.value = res;
    }
  }

  const login = async (_username: string, _password: string) => {
    try {
      const res = await api.user.login({
        username: _username,
        password: _password,
      });
      if (res.data.code === 200) {
        loginStatus.value = 'login';
        permission.value = 0; // TODO
        currentUser.value = res.data.data;
        localStorage.setItem('token', res.headers['oc-auth-token'] || '');
        resumePing();
        return true;
      } else {
        pausePing();
        return false;
      }
    } catch (e) {
      pausePing();
      logout();
      return false;
    }
  };

  /**
   * 登出，清除本地登录信息
   */
  function logout() {
    loginStatus.value = 'logout';
    permission.value = 0;
    currentUser.value = {};
    localStorage.removeItem('token');
    pausePing();
  }

  return {
    token,
    avatar,
    loginStatus,
    isLogin,
    userId,
    username,
    permission,
    currentUser,
    login,
    logout,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
