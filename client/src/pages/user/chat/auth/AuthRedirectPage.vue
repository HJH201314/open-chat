<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import genApi from '@/api/gen-api.ts';
import { useRouteQuery } from '@vueuse/router';
import { useUserStore } from '@/store/useUserStore.ts';
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    name?: string;
  }>(),
  {
    name: '',
  }
);

const code = useRouteQuery<string>('code');
const state = useRouteQuery<string>('state');
const resData = ref<any>();

const userStore = useUserStore();
const router = useRouter();
watchEffect(() => {
  if (userStore.isLogin) {
    const path = localStorage.getItem('login-redirect');
    if (path) {
      router.replace(path);
    }
  }
});

watchEffect(async () => {
  if (code.value && state.value) {
    try {
      const res = await genApi.Auth.postAuth(props.name, {
        code: String(code.value),
        state: String(state.value),
      });
      if (res.status == 200 && res.data.data) {
        userStore.internalLogin(res.data.data);
      }
      resData.value = res.data;
    } catch (e) {
      console.error(e);
      resData.value = e;
    }
  }
});
</script>

<template>
  <div class="auth-redirect">登录中...{{ resData }}</div>
</template>

<style scoped lang="scss">
.auth-redirect {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>