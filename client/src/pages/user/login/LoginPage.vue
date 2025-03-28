<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal.ts';
import { DialogManager } from '@/components/dialog';
import showToast from '@/components/toast/toast.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { Close, Right } from '@icon-park/vue-next';
import EasyTyper from 'easy-typer-js';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import Logo from '@/components/Logo.vue';

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

onMounted(() => {
  if (userStore.isLogin) {
    if (props.isModal) emit('close');
    else router.replace('/');
  }
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

const router = useRouter();

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
    const res = await genApi.User.registerPost({
      username: loginForm.username,
      password: loginForm.password,
    });
    if (res.status === 200 && res.data.data === true) {
      ToastManager.normal('注册成功', { position: 'bottom' });
      await userStore.login(loginForm.username, loginForm.password);
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
      }, 1500);
    }
  }
);

function showUserAgreement() {
  DialogManager.commonDialog({
    title: 'OpenChat用户协议',
    content: '没有协议拜了个拜',
  });
}
</script>

<template>
  <div :class="{ 'in-page': !isModal }" class="login">
    <div class="login-right-top">
      <CusRadioGroup v-model="loginForm.type" class="login-type" name="loginType" background-mode="transparent">
        <CusRadioButton value="login" label="登录"></CusRadioButton>
        <CusRadioButton value="register" label="注册"></CusRadioButton>
      </CusRadioGroup>
      <Close
        v-if="isModal"
        class="login-close transition-all-circ enable-hover enable-active"
        size="20"
        @click="closePage"
      />
    </div>
    <Logo style="font-size: 32px"></Logo>
    <div class="login-top">
      <span class="login-top-emoji transition-all-circ">{{ emoji }}</span>
      <div v-if="!isLargeScreen" style="height: 0.01rem" />
      <span class="login-top-text">{{ typerObj.output }}</span>
      <span class="typed-cursor login-top-text">|</span>
    </div>
    <div class="login-bottom">
      <form class="login-forms" @submit.prevent>
        <div class="login-form">
          <input
            v-model="loginForm.username"
            :autocomplete="loginForm.type === 'login' ? 'username' : 'off'"
            class="login-form-input"
            name="username"
            placeholder="请输入用户名"
            type="text"
          />
          <input
            v-model="loginForm.password"
            :autocomplete="loginForm.type === 'login' ? 'password' : 'off'"
            class="login-form-input"
            name="password"
            placeholder="请输入密码"
            type="password"
          />
          <input
            v-if="loginForm.type == 'register'"
            v-model="loginForm.repeatPassword"
            autocomplete="off"
            class="login-form-input"
            name="repeat-password"
            placeholder="请再次输入密码"
            type="password"
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
    <div class="login-footer">我已阅读并同意<a @click="showUserAgreement">《OpenChat用户协议》</a></div>
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

  &-close {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.5rem;
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

  &-footer {
    margin-top: 0.5rem;
    color: $color-grey-500;
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
      width: 100%;
      font-size: large;
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      border: 2px solid #ffffff00;
      background-color: rgba(0, 0, 0, 0.05);
      outline: none;
      transition: all 0.2s $ease-out-circ;

      &:focus {
        background: $color-white;
        border: 2px solid var(--color-primary);
      }
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
