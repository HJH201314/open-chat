<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import { DialogManager } from '@/components/dialog';
import showToast from '@/components/toast/toast';
import { useUserStore } from '@/store/useUserStore';
import { Close, Right } from '@icon-park/vue-next';
import EasyTyper from 'easy-typer-js';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

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
  username: ref(''),
  password: ref(''),
  shake: ref(0),
});
const emoji = ref('🚀');
const submitDisabled = ref(false);

function initPage() {
  emoji.value = '🚀';
  // @ts-ignore
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

async function handleLoginSubmit() {
  if (!loginForm.username) {
    loginForm.shake += 1;
    showToast({ text: '请输入用户名！', position: 'bottom', type: 'warning' });
    return;
  } else if (!loginForm.password) {
    loginForm.shake += 1;
    showToast({ text: '请输入密码！', position: 'bottom', type: 'warning' });
    return;
  } else {
    try {
      submitDisabled.value = true;
      await userStore.login(loginForm.username, loginForm.password);
    } catch (e) {
      console.error(e);
      loginForm.shake += 1;
      showToast({ text: '点火失败', position: 'bottom', type: 'danger' });
      return;
    } finally {
      submitDisabled.value = false;
    }
  }
}

watch(
  () => userStore.isLogin,
  (v) => {
    if (v) {
      emoji.value = '🎉';
      // @ts-ignore
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
    <Close
      v-if="isModal"
      class="login-close transition-all-circ enable-hover enable-active"
      size="20"
      @click="closePage"
    />
    <div class="sidebar-logo sidebar-logo-animation" style="font-size: 32px">OpenChat</div>
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
            autocomplete="username"
            class="login-form-input"
            name="username"
            placeholder="请输入用户名"
            type="text"
          />
          <input
            v-model="loginForm.password"
            autocomplete="password"
            class="login-form-input"
            name="password"
            placeholder="请输入密码"
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
  padding: 0.25rem 1rem 1rem 1rem;
  position: relative;

  &-close {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 0.5rem;
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
      color: $color-primary;
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
      background-color: $color-primary;
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
      background-color: $color-grey-100;
      outline: none;
      transition: all 0.2s $ease-out-circ;

      &:focus {
        background: $color-white;
        border: 2px solid $color-primary;
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
      #418ae0,
      #56a0d8,
      #dc8bc3,
      #56a0d8,
      #418ae0,
      #56a0d8,
      #dc8bc3,
      #56a0d8,
      #418ae0
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
