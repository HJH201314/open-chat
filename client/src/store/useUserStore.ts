import api from '@/api';
import { useIntervalFn, useLocalStorage, useSessionStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '@/constants';
import genApi from '@/api/gen-api.ts';

/* 用户相关 */
export const useUserStore = defineStore('user', () => {
  const accessToken = useLocalStorage(USER_ACCESS_TOKEN_KEY, '');
  const refreshToken = useLocalStorage(USER_REFRESH_TOKEN_KEY, '');
  const avatar = ref('/favicon.ico');
  const currentUser = useSessionStorage<API.UserLoginResult>('current-user', {});
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
    try {
      const res = await genApi.User.pingPost();
      if (res.data?.data?.id) {
        loginStatus.value = 'login';
        currentUser.value = res.data.data;
      } else {
        // 切换到 offline，表明登录态可能存在问题
        loginStatus.value === 'login' && (loginStatus.value = 'offline');
      }
    } catch (_) {
      loginStatus.value === 'login' && (loginStatus.value = 'offline');
    }
  };

  const login = async (_username: string, _password: string) => {
    try {
      const res = await genApi.User.loginPost({
        username: _username,
        password: _password,
      });
      if (res.data.code === 200) {
        loginStatus.value = 'login';
        permission.value = 0; // TODO
        currentUser.value = res.data.data;
        resumePing();
        return true;
      } else {
        pausePing();
        return false;
      }
    } catch (_) {
      pausePing();
      logout();
      return false;
    }
  };

  /**
   * 登出，清除本地登录信息
   */
  function logout() {
    genApi.User.logoutPost();
    loginStatus.value = 'logout';
    permission.value = 0;
    currentUser.value = {};
    accessToken.value = '';
    refreshToken.value = '';
    pausePing();
  }

  return {
    avatar,
    loginStatus,
    isLogin,
    userId,
    username,
    permission,
    currentUser,
    login,
    logout,
    refreshToken,
    token: accessToken,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
