<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal.ts';
import { DialogManager } from '@/components/dialog';
import showToast from '@/components/toast/toast.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { Close, Google, Right } from '@icon-park/vue-next';
import EasyTyper from 'easy-typer-js';
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import Logo from '@/components/logo/Logo.vue';
import { encryptWithPublicKey } from '@/utils/encrypt.ts';
import CusInput from '@/components/input/CusInput.vue';
import { onStartTyping } from '@vueuse/core';
import DiliButton from '@/components/button/DiliButton.vue';
import { LogoGithubIcon, LogoQqIcon, LogoWechatStrokeIcon } from 'tdesign-icons-vue-next';
import { AxiosError } from 'axios';

const props = withDefaults(
  defineProps<{
    isModal: boolean;
  }>(),
  {
    isModal: false,
  }
);

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const router = useRouter();
const route = useRoute();
onMounted(() => {
  initPage();
});

const userStore = useUserStore();
const { isLargeScreen } = useGlobal();

const typer = ref<EasyTyper>();
const typerObj = reactive({
  output: '',
  isEnd: false,
  speed: 150,
  singleBack: false,
  sleep: 1000,
  type: 'normal',
  backSpeed: 40,
  sentencePause: false,
});

// 输入框自动聚焦
const inputUsernameRef = useTemplateRef('input-username');
onStartTyping(() => {
  if ((inputUsernameRef.value?.element as any) != document.activeElement) {
    inputUsernameRef.value?.focus();
  }
});

const loginForm = reactive({
  type: ref<'login' | 'register'>('login'),
  username: ref(''),
  password: ref(''),
  repeatPassword: ref(''),
  shake: ref(0),
});
const emoji = ref('🚀');
const submitDisabled = ref(false);

function initPage() {
  emoji.value = '🚀';
  // @ts-ignore EasyTyper 没有类型声明
  typer.value = new EasyTyper(typerObj, ['即刻启航']);
}

function closePage() {
  if (props.isModal) {
    emit('close');
  } else {
    router.replace('/');
  }
}

async function handleLogin() {
  try {
    submitDisabled.value = true;
    const res = await userStore.login(loginForm.username, loginForm.password);
    if (!res) {
      loginForm.shake += 1;
      ToastManager.danger('点火失败，请重试！', { position: 'bottom' });
    }
  } catch (e) {
    console.error(e);
    loginForm.shake += 1;
    ToastManager.danger('点火失败，请重试！', { position: 'bottom' });
    return;
  } finally {
    submitDisabled.value = false;
  }
}

async function handleRegister() {
  try {
    submitDisabled.value = true;
    const keyRes = await genApi.Base.publicKeyGet();
    if (!keyRes.data.data) {
      return;
    }
    const res = await genApi.User.registerPost({
      username: loginForm.username,
      password: await encryptWithPublicKey(keyRes.data.data, loginForm.password),
    });
    if (res.status === 200 && res.data.data === true) {
      ToastManager.normal('注册成功', { position: 'bottom' });
      await userStore.login(loginForm.username, loginForm.password, keyRes.data.data);
    } else {
      loginForm.shake += 1;
      ToastManager.danger('注册失败，请重试！', { position: 'bottom' });
    }
  } catch (e) {
    console.error(e);
    loginForm.shake += 1;
    ToastManager.danger('网络异常请稍后重试！', { position: 'bottom' });
    return;
  } finally {
    submitDisabled.value = false;
  }
}

async function handleLoginSubmit() {
  if (!loginForm.username) {
    loginForm.shake += 1;
    showToast({ text: '请输入用户名！', position: 'bottom', type: 'warning' });
    return;
  } else if (!loginForm.password) {
    loginForm.shake += 1;
    showToast({ text: '请输入密码！', position: 'bottom', type: 'warning' });
    return;
  } else if (loginForm.type === 'register' && loginForm.password !== loginForm.repeatPassword) {
    loginForm.shake += 1;
    showToast({ text: '请正确重复密码！', position: 'bottom', type: 'warning' });
    return;
  }
  switch (loginForm.type) {
    case 'login':
      await handleLogin();
      break;
    case 'register':
      await handleRegister();
      break;
  }
}

async function handleThirdPartyLogin(providerName: string) {
  try {
    submitDisabled.value = true;
    const res = await genApi.Auth.getAuth(providerName);
    if (res.status == 200 && res.data.data) {
      // 记录当前页面
      localStorage.setItem('login-redirect', route.fullPath);
      // 在本标签页打开
      location.href = res.data.data;
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.status == 404) {
        ToastManager.warning('暂未开放');
      }
    }
  } finally {
    submitDisabled.value = false;
  }
}

watch(
  () => userStore.isLogin,
  (v) => {
    if (v) {
      emoji.value = '🎉';
      // @ts-ignore EasyTyper 没有类型声明
      typer.value = new EasyTyper(typerObj, '欢迎回来');
      showToast({ text: `登录成功，欢迎回来，UID:${userStore.userId}`, position: 'top' });
      setTimeout(() => {
        closePage();
      }, 750);
    }
  },
  { immediate: true }
);

function showUserAgreement() {
  DialogManager.commonDialog({
    title: 'F-Chat 用户协议',
    content: '没有协议拜了个拜',
  });
}
</script>

<template>
  <div :class="{ 'in-page': !isModal || !isLargeScreen }" class="login">
    <div class="login-right-top">
      <CusRadioGroup v-model="loginForm.type" class="login-type" name="loginType" background-mode="transparent">
        <CusRadioButton value="login" label="登录"></CusRadioButton>
        <CusRadioButton value="register" label="注册"></CusRadioButton>
      </CusRadioGroup>
      <DiliButton v-if="isModal" @click="closePage">
        <Close size="20px" />
      </DiliButton>
    </div>
    <Logo style="font-size: 32px" @click="!isModal && router.replace('/')"></Logo>
    <div class="login-top">
      <span class="login-top-emoji transition-all-circ">{{ emoji }}</span>
      <div v-if="!isLargeScreen" style="height: 0.01rem" />
      <span class="login-top-text">{{ typerObj.output }}</span>
      <span class="typed-cursor login-top-text">|</span>
    </div>
    <div class="login-bottom">
      <form class="login-forms" @submit.prevent>
        <div class="login-form">
          <CusInput
            ref="input-username"
            v-model="loginForm.username"
            class="login-form-input"
            :input-attrs="{
              style: 'font-size: 1.1rem',
              autocomplete: loginForm.type === 'login' ? 'username' : 'off',
              name: 'username',
              type: 'text',
            }"
            placeholder="请输入用户名"
            type="text"
          />
          <CusInput
            v-model="loginForm.password"
            class="login-form-input"
            :input-attrs="{
              style: 'font-size: 1.1rem',
              autocomplete: loginForm.type === 'login' ? 'password' : 'off',
              name: 'password',
              type: 'password',
            }"
            placeholder="请输入密码"
          />
          <CusInput
            v-if="loginForm.type == 'register'"
            v-model="loginForm.repeatPassword"
            autocomplete="off"
            class="login-form-input"
            :input-attrs="{
              style: 'font-size: 1.1rem',
              autocomplete: 'off',
              name: 'repeat-password',
              type: 'password',
            }"
            placeholder="请再次输入密码"
          />
        </div>
        <button
          v-shake="loginForm.shake"
          :disabled="submitDisabled"
          class="login-form-submit"
          style="outline: none"
          @click="handleLoginSubmit"
        >
          <Right size="32" />
        </button>
      </form>
    </div>
    <div class="login-footer">注册前请阅读并同意<a @click="showUserAgreement">《F-Chat用户协议》</a></div>
    <div class="login-third-party">
      <DiliButton @click="handleThirdPartyLogin('github')">
        <LogoGithubIcon size="1.25rem" />
      </DiliButton>
      <DiliButton @click="handleThirdPartyLogin('google')">
        <Google size="1.25rem" />
      </DiliButton>
      <DiliButton @click="handleThirdPartyLogin('qq')">
        <LogoQqIcon size="1.25rem" />
      </DiliButton>
      <DiliButton @click="handleThirdPartyLogin('wechat')">
        <LogoWechatStrokeIcon size="1.25rem" />
      </DiliButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.login {
  width: 100%;
  height: 100%; // 避免动画过渡时的布局问题
  padding: 0.25rem 1rem 1rem 1rem;
  position: relative;

  &-right-top {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &-top {
    width: 100%;
    font-size: 100px;
    line-height: 1;
    text-align: center;
    margin: 1rem 0;

    &-emoji {
      &:focus {
        transform: scale(0.9);
      }
    }

    &-text {
      font-size: 56px;
      font-weight: bold;
      color: var(--color-primary);
      background-image: $linear-gradient-primary;
      -webkit-text-fill-color: rgba(0, 0, 0, 0);
      background-clip: text;
    }
  }

  &-title {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 4px;

    &:before {
      display: inline-block;
      content: '';
      height: 1rem;
      width: 4px;
      background-color: var(--color-primary);
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  &-third-party {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  &-footer {
    margin-top: 0.5rem;
    color: var(--color-grey-500);
    text-align: center;
  }

  &-forms {
    display: contents;

    .in-page & {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  &-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &-input {
      height: 2.5rem;
      font-size: large;
    }

    &-submit {
      position: relative;
      font-size: 20px;
      background-image: $linear-gradient-primary-2;
      color: white;
      text-align: center;
      border-radius: 0.5rem;
      display: flex;
      padding: 0 0.75rem;
      box-sizing: border-box;
      cursor: pointer;
      transition: all 0.2s $ease-out-circ;

      .in-page & {
        padding: 0.25rem 0;
        margin-top: 0.5rem;
      }

      &:hover {
        opacity: 0.85;
      }

      &:active {
        background-image: $linear-gradient-primary-3;
      }

      span {
        margin: auto;
      }
    }
  }
}

.sidebar-logo {
  flex: 1;
  font-size: 24px;

  &-animation {
    // background-image: linear-gradient(-135deg, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3);
    background-image: linear-gradient(
      -135deg,
      var(--color-primary-darker),
      var(--color-primary),
      var(--color-primary-lighter),
      var(--color-primary),
      var(--color-primary-darker),
      var(--color-primary),
      var(--color-primary-lighter),
      var(--color-primary),
      var(--color-primary-darker)
    );
    -webkit-text-fill-color: rgba(0, 0, 0, 0);
    background-clip: text;
    background-size: 200% 200%;
    animation: text-masked-animation 3s infinite linear;
  }

  @keyframes text-masked-animation {
    0% {
      background-position: 0 -100%;
    }
    100% {
      background-position: -100% 0;
    }
  }
}
</style>
