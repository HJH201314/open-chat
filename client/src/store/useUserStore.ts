import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import api from '@/api';

// setup 风格的 store
// https://pinia.vuejs.org/core-concepts/#Setup-Stores
/* 用户相关 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token'));
  const avatar = ref('/favicon.ico');
  const username = ref('未登录');
  const user_id = ref(-1);
  const permission = ref(0);
  const currentUser = ref<API.UserLoginResult>({});

  const loginStatus = ref<'login' | 'logout' | 'offline'>('logout');
  const isLogin = computed(() => {
    return loginStatus.value === 'login';
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

  const login = async (_username: string, _password: string, _remember: boolean = false) =>
    new Promise((resolve, reject) => {
      api.user
        .login({
          username: _username,
          password: _password,
        })
        .then((res) => {
          if (res.data.code === 200) {
            loginStatus.value = 'login';
            user_id.value = res.data.data.id ?? -1;
            username.value = _username ?? '匿名用户';
            permission.value = 0; // TODO
            currentUser.value = res.data.data;
            localStorage.setItem('token', res.headers['oc-auth-token'] || '');
            if (_remember) {
              // 记忆自动登录信息
              localStorage.setItem(
                'up',
                btoa(`${_username},${_password},${new Date().getTime() + 3 * 24 * 60 * 60 * 1000}`)
              );
            }
            // 登录成功后，定时查询状态
            clearInterval(heartbeatInterval.value);
            heartbeatInterval.value = window.setInterval(async () => {
              const res = await api.user.ping();
              if (!res) {
                // 切换到 offline 表明登录态可能存在问题
                loginStatus.value = 'offline';
              } else {
                loginStatus.value = 'login';
              }
            }, 60000);
            resolve(res.data);
          } else {
            localStorage.removeItem('up');
            clearInterval(heartbeatInterval.value);
            reject(res);
          }
        })
        .catch((err) => {
          localStorage.removeItem('up');
          clearInterval(heartbeatInterval.value);
          logout();
          reject(err);
        });
    });

  /**
   * 登出，清除本地登录信息
   */
  function logout() {
    loginStatus.value = 'logout';
    user_id.value = -1;
    username.value = '未登录';
    permission.value = 0;
    currentUser.value = {};
    localStorage.removeItem('token');
    localStorage.removeItem('up'); // 清除自动登录信息
    clearInterval(heartbeatInterval.value);
  }

  return {
    token,
    avatar,
    loginStatus,
    isLogin,
    user_id,
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
