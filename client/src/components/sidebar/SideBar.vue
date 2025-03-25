<script lang="ts" setup>
import Tooltip from '@/components/tooltip/CusTooltip.vue';
import { toggleSidebarExpandKey, toggleSidebarKey } from '@/constants/eventBusKeys';
import { goToLogin } from '@/pages/user/login';
import { useUserStore } from '@/store/useUserStore';
import { Login, Logout, MenuFold, MenuUnfold, Moon, SunOne } from '@icon-park/vue-next';
import { onClickOutside, useEventBus, useMediaQuery } from '@vueuse/core';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from '@/components/theme/useTheme.ts';
import type { SidebarEntry } from '@/components/sidebar/types.ts';

const props = withDefaults(
  defineProps<{
    title?: string;
    defaultShow?: boolean;
    entries?: SidebarEntry[];
  }>(),
  {
    title: 'OpenChat',
    defaultShow: true,
    entries: () => [],
  }
);
const userStore = useUserStore();

const showSideBar = ref(props.defaultShow);
const expandBar = ref(false);
const isAutoExpand = ref(false);

const toggleSideBarBus = useEventBus(toggleSidebarKey);
const toggleSidebarExpandBus = useEventBus(toggleSidebarExpandKey);
const { toggleTheme, currentTheme } = useTheme();

onMounted(() => {
  toggleSideBarBus.on((e) => {
    showSideBar.value = e;
    expandBar.value = false;
  });
  toggleSidebarExpandBus.on((e) => {
    if (e) {
      if (!props.defaultShow) {
        // 若默认没有展示侧边栏，则先展示并渲染后再展开
        showSideBar.value = true;
        setTimeout(() => {
          expandBar.value = true;
        }, 0);
      } else {
        expandBar.value = true;
      }
    } else {
      if (!props.defaultShow) {
        expandBar.value = false;
        setTimeout(() => {
          showSideBar.value = false;
        }, 0);
      }
      expandBar.value = false;
    }
  });
});

const isLargeScreen = useMediaQuery('(min-width: 768px)');

function handleExpandBar() {
  toggleSidebarExpandBus.emit(!expandBar.value);
}

const mouseEnterTimeout = ref<number>();
const mouseLeaveTimeout = ref<number>();

function handleMouseEnter() {
  clearTimeout(mouseLeaveTimeout.value);
  clearTimeout(mouseEnterTimeout.value);
  if (!expandBar.value && isLargeScreen.value) {
    // 如果已经打开，不能重复触发
    mouseEnterTimeout.value = window.setTimeout(() => {
      isAutoExpand.value = true;
      expandBar.value = true;
    }, 750);
  }
}

function handleMouseLeave() {
  clearTimeout(mouseEnterTimeout.value);
  clearTimeout(mouseLeaveTimeout.value);
  if (expandBar.value && isAutoExpand.value) {
    // 只有在打开并且是自动打开的情况下才能触发关闭
    mouseLeaveTimeout.value = window.setTimeout(() => {
      isAutoExpand.value = false;
      expandBar.value = false;
    }, 100);
  }
}

const route = useRoute();
const router = useRouter();

function getEntryActive(entry: SidebarEntry) {
  if (entry.href) {
    return route.path.startsWith(entry.href);
  }
  return false;
}

function handleEntryClick(_: Event, entry: SidebarEntry) {
  if (entry.onClick) {
    entry.onClick();
  } else if (entry.href) {
    if (entry.href == route.path) return;
    router.replace(entry.href);
  }
  expandBar.value && toggleSidebarExpandBus.emit(false);
}

function handleLogin() {
  if (userStore.isLogin) {
    userStore.logout();
  } else {
    goToLogin();
  }
}

// 点击 Sidebar 外部隐藏
onClickOutside(useTemplateRef('sidebar-body'), () => {
  expandBar.value && toggleSidebarExpandBus.emit(false);
});

defineExpose({
  isShowing: showSideBar,
});
</script>

<template>
  <!-- place: 控制是否占据宽度；hidden：控制是否隐藏（当 defaultShow == false 时，不应用 hidden，否则无法实现动画收起） -->
  <div class="sidebar" :class="{ place: props.defaultShow, hidden: !showSideBar && props.defaultShow }">
    <div
      ref="sidebar-body"
      :class="{ 'sidebar-body-expand': expandBar, hidden: !showSideBar }"
      class="sidebar-body"
      @mouseleave="handleMouseLeave"
    >
      <div class="sidebar-top">
        <div v-if="expandBar" class="sidebar-logo sidebar-logo-animation">{{ title }}</div>
        <div class="sidebar-expand" style="aspect-ratio: 1" @click="handleExpandBar">
          <MenuUnfold v-if="!expandBar" size="24"></MenuUnfold>
          <MenuFold v-else size="24"></MenuFold>
        </div>
      </div>
      <div class="sidebar-entries" @mouseenter="handleMouseEnter" @mousemove="handleMouseEnter">
        <div
          v-for="entry in entries"
          :key="entry.key"
          :class="{ 'sidebar-entry--active': getEntryActive(entry) }"
          class="sidebar-entry"
          @click="(e) => handleEntryClick(e, entry)"
        >
          <component
            :is="entry.icon"
            class="sidebar-entry-icon"
            :class="{ 'sidebar-entry-icon--active': entry.href && getEntryActive(entry) }"
            size="24"
            theme="outline"
          ></component>
          <span :class="{ 'sidebar-entry-name-ext': expandBar }" class="sidebar-entry-name">{{ entry.name }}</span>
        </div>
      </div>
      <Tooltip :text="userStore.isLogin ? '退出登录' : '登录'" class="sidebar-entry-login" position="right">
        <div class="sidebar-entry" @click="handleLogin">
          <Login v-if="userStore.isLogin" class="sidebar-entry-icon" size="24"></Login>
          <Logout v-else class="sidebar-entry-icon" size="24"></Logout>
          <span :class="{ 'sidebar-entry-name-ext': expandBar }" class="sidebar-entry-name">{{
            userStore.isLogin ? '退出登录' : '登录'
          }}</span>
        </div>
      </Tooltip>
      <div class="sidebar-footer">
        <Tooltip position="right" text="切换主题">
          <div class="sidebar-entry sidebar-footer-item">
            <SunOne
              v-if="currentTheme == 'dark'"
              class="sidebar-entry-icon"
              size="1.5rem"
              @click="toggleTheme"
            ></SunOne>
            <Moon v-if="currentTheme == 'light'" class="sidebar-entry-icon" size="1.5rem" @click="toggleTheme"></Moon>
          </div>
        </Tooltip>
      </div>
      <hr style="background: #4db6ac; height: 1px; width: 80%" />
      <div class="sidebar-avatar sidebar-entry" @click="!userStore.isLogin ? handleLogin() : void 0">
        <div class="sidebar-avatar-img">
          <img alt="avatar" src="/favicon.ico" />
          <div
            :class="{
              'sidebar-avatar-status--logout': userStore.loginStatus == 'logout',
              'sidebar-avatar-status--offline': userStore.loginStatus == 'offline',
            }"
            class="sidebar-avatar-status"
          ></div>
        </div>
        <span v-if="expandBar" class="sidebar-avatar-name">{{ userStore.username }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;
@use '@/assets/functions' as *;

.sidebar {
  height: 100%;
  transition: width 0.2s ease;

  &.place {
    width: 3.5rem;
  }

  &.hidden {
    width: 0;
  }

  &-body {
    position: fixed; // 统一fixed解决还原时占位异常
    left: 0;
    top: 0;
    bottom: 0;
    // 融入 body 渐变
    background: $body-background;
    background-size: calc(100 * var(--vh)) 100vw;
    width: 3.5rem;
    padding: 0.5rem 0.5rem 1rem 0.5rem;
    text-align: center;
    // box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    // border-right: 1px solid $color-grey-200;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition:
      width 0.2s $ease-out-circ,
      transform 0.2s $ease-out-circ;
    z-index: 999;

    &-expand {
      width: 12rem;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }

    &.hidden {
      transform: translateX(-100%);
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

  &-expand {
    display: flex;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s $ease-out-circ;
    cursor: pointer;

    &:not(&--active):hover {
      background: shade-color($color-teal-20, 5%);
    }

    &:not(&--active):active {
      background: shade-color($color-teal-20, 10%);
    }
  }

  &-avatar {
    cursor: pointer;
    padding: 0.5rem 0 !important; // 取消sidebar-entry的padding

    &:hover &-img > img {
      transform: rotate(-360deg); // 头像旋转
    }

    &-img {
      position: relative;

      > img {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        transition: transform 0.2s $ease-out-circ;
      }
    }

    &-status {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      box-sizing: content-box;
      border: 2px solid $color-teal-20;
      background-color: $color-success;

      &--offline {
        background-color: orange;
      }

      &--logout {
        background-color: $color-danger;
      }
    }

    &-name {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--color-primary);
    }
  }

  &-entries {
    margin-top: 1rem;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: auto;
  }

  &-entry {
    padding: 0.5rem;
    width: 100%;
    border-radius: 0.5rem;
    transition: background-color 0.2s $ease-out-circ;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    &:not(&--active):hover {
      background: shade-color($color-teal-20, 5%);
    }

    &:not(&--active):active {
      background: shade-color($color-teal-20, 10%);
    }

    &--active {
      background: $color-teal-50;
      color: var(--color-primary);
    }

    &-icon {
      aspect-ratio: 1;

      &--active {
        color: var(--color-primary);
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
        color: var(--color-primary);
      }
    }

    &-login {
      width: 100%;
      margin-top: auto;
    }
  }

  &-footer {
    margin-top: auto;
    width: 100%;
    font-size: 1.5rem;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;

    &-item {
      width: max-content;
    }
  }
}
</style>
