<script setup lang="ts">

import { createApp, defineComponent, h, onMounted, reactive, ref, VueElement } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MenuUnfold, MenuFold, Github, Login, Logout, Right } from "@icon-park/vue-next";
import { useUserStore } from "@/store/useUserStore";
import Tooltip from "@/components/tooltip/Tooltip.vue";
import CommonModal from "@/components/modal/CommonModal.vue";
import type { CommonModalFunc } from "@/components/modal/CommonModal";
import { useEventBus, useMediaQuery, useShare } from "@vueuse/core";
import { toggleSidebarKey } from "@/constants/eventBusKeys";
import LoginForm from "@/components/login-form/LoginForm.vue";
import showToast from "@/components/toast/toast";

const userStore = useUserStore();

const showSideBar = ref(true);
const expandBar = ref(false);

const toggleSideBarBus = useEventBus(toggleSidebarKey);
toggleSideBarBus.on((e) => {
  showSideBar.value = e;
  expandBar.value = false;
});

const route = useRoute();

type Entry = {
  key: string;
  name: string;
  icon: string;
  href?: string;
  onClick?: () => void;
};
const entries = ref<Entry[]>([
  {
    key: "dialog",
    name: "对话",
    icon: 'message',
    href: "/message",
  },
  {
    key: "start",
    name: "收藏",
    icon: 'star',
    href: "/star",
  },
  {
    key: 'setting',
    name: "设置",
    icon: 'setting-two',
    href: "/setting",
  },
]);

const router = useRouter();
function handleEntryClick(e: Event, entry: Entry) {
  if (entry.href) {
    if (entry.href == route.path) return;
    router.push(entry.href);
  } else if (entry.onClick) {
    entry.onClick();
  }
  showToast({text: entry.name, position: 'top'});
  expandBar.value = false;
}

const refLoginForm = ref();

function handleLogin() {
  if (userStore.isLogin) {
    userStore.logout();
  } else {
    refLoginForm.value?.open();
  }
}

function handleGithubClick() {
  window.open('https://github.com/HJH201314/openai-front');
}

</script>

<template>
  <div v-show="showSideBar" class="sidebar">
    <!-- 占位，避免sidebar-body变化（展开）时布局变化 -->
    <div v-show="showSideBar" class="sidebar-placeholder"></div>
    <div v-show="showSideBar" class="sidebar-body" :class="{'sidebar-body-expand': expandBar}">
      <div class="sidebar-top">
        <div v-if="expandBar" class="sidebar-logo sidebar-logo-animation">
          OpenChat
        </div>
        <div class="sidebar-expand" style="aspect-ratio: 1;" @click="() => expandBar = !expandBar">
          <MenuUnfold v-if="!expandBar" size="24"></MenuUnfold>
          <MenuFold v-else size="24"></MenuFold>
        </div>
      </div>
      <div class="sidebar-entries">
        <div v-for="entry in entries" :key="entry.key" class="sidebar-entry" :class="{'sidebar-entry-focus': entry.href == route.path}" @click="(e) => handleEntryClick(e, entry)">
          <component :is="entry.icon" v-if="!entry.href || entry.href != route.path" class="sidebar-entry-icon" theme="outline" size="24"></component>
          <component :is="entry.icon" v-else class="sidebar-entry-icon sidebar-entry-icon-focus" theme="outline" size="24"></component>
          <span class="sidebar-entry-name" :class="{'sidebar-entry-name-ext': expandBar}">{{ entry.name }}</span>
        </div>
        <Tooltip position="right" class="sidebar-entry-login" :text="userStore.isLogin ? '退出登录' : '登录'">
          <div @click="handleLogin" class="sidebar-entry">
            <Login v-if="userStore.isLogin" class="sidebar-entry-icon" size="24"></Login>
            <Logout v-else class="sidebar-entry-icon" size="24"></Logout>
            <span class="sidebar-entry-name" :class="{'sidebar-entry-name-ext': expandBar}">{{ userStore.isLogin ? '退出登录' : '登录' }}</span>
          </div>
        </Tooltip>
      </div>
      <div class="sidebar-footer">
        <div class="sidebar-entry">
          <Github class="sidebar-entry-icon" size="24" @click="handleGithubClick"></Github>
        </div>
      </div>
      <hr style="background: #4db6ac; height: 1px; width: 80%;" />
      <div class="sidebar-avatar sidebar-entry">
        <img class="sidebar-avatar-img" src="@/assets/image/default_avatar.jpg" alt="avatar"/>
        <span v-if="userStore.isLogin">{{ userStore.username }}</span>
      </div>
    </div>
    <LoginForm ref="refLoginForm" />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.sidebar {
  &-placeholder {
    width: 3.5rem;
    height: 100%;
  }

  &-body {
    position: fixed; // 统一fixed解决还原时占位异常
    left: 0;
    top: 0;
    background-color: $color-teal-10;
    height: 100%;
    width: 3.5rem;
    padding: .5rem;
    text-align: center;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    border-right: 1px solid $color-grey-200;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    transition: width .2s $ease-out-circ;
    z-index: 999;

    &-expand {
      width: 12rem;
    }
  }

  &-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &-logo {
    flex: 1;
    font-size: 24px;
    &-animation {
      // background-image: linear-gradient(-135deg, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3);
      background-image: linear-gradient(-135deg, #418ae0, #56a0d8, #dc8bc3, #56a0d8, #418ae0, #56a0d8, #dc8bc3, #56a0d8, #418ae0);
      -webkit-text-fill-color: rgba(0,0,0,0);
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
  &-expand {
    display: flex;
    padding: .5rem;
    border-radius: .5rem;
    transition: background-color .2s $ease-out-circ;
    cursor: pointer;
    &:hover {
      background: $color-hover;
    }
    &:active {
      background: $color-active;
    }
  }

  &-avatar {
    cursor: pointer;
    padding: 0 !important; // 取消sidebar-entry的padding

    &-img {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      transition: transform .2s $ease-out-circ;
      &:hover {
        transform: rotate(-360deg);
      }
    }
  }

  &-entries {
    margin-top: 1rem;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  &-entry {
    padding: .5rem;
    width: 100%;
    border-radius: .5rem;
    transition: background-color .2s $ease-out-circ;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    &:not(&-focus):hover {
      background: $color-hover;
    }
    &:active {
      background: $color-active;
    }
    &-focus {
      background: $color-teal-50;
      color: $color-primary;
    }

    &-icon {
      aspect-ratio: 1;
      &-focus {
        color: $color-primary;
      }
    }
    &-name {
      text-align: start;
      display: none;
      white-space: nowrap; /* 防止换行闪烁 */
      &-ext {
        display: inline;
        visibility: visible;
        font-weight: bold;
      }
      &-active {
        color: $color-primary;
      }
    }

    &-login {
      margin-top: auto;
    }
  }

  &-footer {
    margin-top: auto;
    width: 100%;
    font-size: 1.5rem;
  }
}
</style>