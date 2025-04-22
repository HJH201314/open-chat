import { useIntervalFn, useLocalStorage, useSessionStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '@/constants';
import genApi from '@/api/gen-api.ts';
import type { ApiSchemaUser } from '@/api/gen/data-contracts.ts';
import { encryptWithPublicKey } from '@/utils/encrypt.ts';

/* 用户相关 */
export const useUserStore = defineStore('user', () => {
  const accessToken = useLocalStorage(USER_ACCESS_TOKEN_KEY, '');
  const refreshToken = useLocalStorage(USER_REFRESH_TOKEN_KEY, '');
  const avatar = ref('/favicon.ico');
  const currentUser = useSessionStorage<ApiSchemaUser>('current-user', {});
  const loginStatus = ref<'login' | 'logout' | 'offline'>('offline');
  const isLogin = computed(() => {
    // 状态不为登出即视作已登录，offline 状态允许再次请求进行尝试
    return loginStatus.value == 'login' || (loginStatus.value == 'offline' && accessToken.value != '');
  });
  const username = computed(() => currentUser.value.username ?? '未登录');
  const userId = computed(() => currentUser.value.id ?? -1);
  const roles = computed(() => currentUser.value.roles ?? []);
  const isAdmin = computed(() => {
    return roles.value
      .map((role) => role.name)
      .join('')
      .toLowerCase()
      .includes('admin');
  });

  const ping = async () => {
    try {
      if (!accessToken.value) return;

      const res = await genApi.User.currentGet();
      if (res.data?.data?.id) {
        loginStatus.value = 'login';
        currentUser.value = { ...res.data.data };
      } else {
        // 切换到 offline，表明登录态可能存在问题
        loginStatus.value === 'login' && (loginStatus.value = 'offline');
      }
    } catch (_) {
      loginStatus.value === 'login' && (loginStatus.value = 'offline');
    }
  };

  // 每小时 ping 一下确认登录过期没
  const { pause: pausePing, resume: resumePing } = useIntervalFn(
    async () => {
      await ping();
    },
    3600000,
    {
      immediate: !!accessToken, // 页面加载后若已有 token，则获取当前登录信息
      immediateCallback: true,
    }
  );

  const login = async (_username: string, _password: string, _publicKey: string = '') => {
    try {
      let publicKey = '';
      if (_publicKey) {
        publicKey = _publicKey;
      } else {
        const keyRes = await genApi.Base.publicKeyGet();
        publicKey = keyRes.data?.data || '';
      }
      const res = await genApi.User.loginPost({
        username: _username,
        password: await encryptWithPublicKey(publicKey, _password),
      });
      if (res.data.code === 200) {
        loginStatus.value = 'login';
        currentUser.value = { ...res.data.data };
        console.debug('[login]', res.data.data);
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

  const internalLogin = (userInfo: ApiSchemaUser) => {
    loginStatus.value = 'login';
    currentUser.value = { ...userInfo };
    resumePing();
  };

  /**
   * 登出，清除本地登录信息
   */
  function logout() {
    if (accessToken.value) {
      genApi.User.logoutPost();
    }
    loginStatus.value = 'logout';
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
    roles,
    currentUser,
    isAdmin,
    login,
    internalLogin,
    logout,
    refreshToken,
    token: accessToken,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
