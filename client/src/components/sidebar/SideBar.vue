<script lang="ts" setup>
import CusTooltip from '@/components/tooltip/CusTooltip.vue';
import { toggleSidebarExpandKey, toggleSidebarKey } from '@/constants/eventBusKeys';
import { goToLogin } from '@/pages/user/login';
import { useUserStore } from '@/store/useUserStore';
import { DashboardOne, Login, Logout, MenuFold, MenuUnfold, Moon, SunOne } from '@icon-park/vue-next';
import { useEventBus, useMediaQuery } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from '@/components/theme/useTheme.ts';
import type { SidebarEntry } from '@/components/sidebar/types.ts';
import Logo from '@/components/logo/Logo.vue';
import CusPopover from '@/components/tooltip/CusPopover.vue';
import CommonModal from '@/components/modal/CommonModal.vue';
import CusAvatar from '@/components/avatar/CusAvatar.vue';
import { useSettingStore } from '@/store/useSettingStore.ts';
import { storeToRefs } from 'pinia';

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
const settingStore = useSettingStore();

const showSideBar = ref(props.defaultShow);
const expandBar = ref(false);
const isAutoExpand = ref(false);

watch(
  () => props.defaultShow,
  (newVal) => {
    showSideBar.value = newVal;
  }
);

const toggleSideBarBus = useEventBus(toggleSidebarKey);
const toggleSidebarExpandBus = useEventBus(toggleSidebarExpandKey);
const { currentTheme } = storeToRefs(useTheme());
const toggleTheme = () => {
  if (currentTheme.value === 'dark') {
    settingStore.saveSetting('theme', 'light');
  } else if (currentTheme.value === 'light') {
    settingStore.saveSetting('theme', 'dark');
  }
};

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

// 获取 entry 是否激活
function getEntryActive(entry: SidebarEntry) {
  return [entry.href && route.path.startsWith(entry.href), entry.active && entry.active(route.path)].some((v) => !!v);
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

defineExpose({
  isShowing: showSideBar,
});
</script>

<template>
  <!-- place: 控制是否占据宽度；hidden：控制是否隐藏（当 defaultShow == false 时，不应用 hidden，否则无法实现动画收起） -->
  <div class="sidebar" :class="{ place: props.defaultShow, hidden: !showSideBar && props.defaultShow }">
    <!-- 这里用 Modal 来实现：展开后的侧边栏和内容区域的隔离、点击外部收起 -->
    <CommonModal
      :force-z-index="4096"
      :visible="expandBar"
      :show-close="false"
      :mask-style="{ background: 'rgba(0 0 0 / 10%)' }"
      close-on-click-mask
      @update:visible="(v) => !v && toggleSidebarExpandBus.emit(false)"
    />
    <div
      ref="sidebar-body"
      :style="{ 'z-index': expandBar ? 4097 : undefined }"
      :class="{ 'sidebar-body-expand': expandBar, hidden: !showSideBar }"
      class="sidebar-body"
      @mouseleave="handleMouseLeave"
    >
      <div class="sidebar-top">
        <Logo v-if="expandBar" style="flex: 1; padding-left: 0.75rem">{{ title }}</Logo>
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
      <CusTooltip
        v-if="!userStore.isLogin"
        :text="userStore.isLogin ? '退出登录' : '登录'"
        class="sidebar-entry-login"
        position="right"
      >
        <div class="sidebar-entry" @click="handleLogin">
          <Login v-if="userStore.isLogin" class="sidebar-entry-icon" size="24"></Login>
          <Logout v-else class="sidebar-entry-icon" size="24"></Logout>
          <span :class="{ 'sidebar-entry-name-ext': expandBar }" class="sidebar-entry-name">{{
            userStore.isLogin ? '退出登录' : '登录'
          }}</span>
        </div>
      </CusTooltip>
      <div class="sidebar-footer">
        <CusTooltip
          style="flex: auto; display: flex; justify-content: center"
          position="right"
          :text="`切换${currentTheme == 'dark' ? '浅色' : '深色'}`"
          @click="toggleTheme"
        >
          <div class="sidebar-entry">
            <SunOne v-if="currentTheme == 'dark'" class="sidebar-entry-icon" size="1.5rem"></SunOne>
            <Moon v-if="currentTheme == 'light'" class="sidebar-entry-icon" size="1.5rem"></Moon>
          </div>
        </CusTooltip>
      </div>
      <hr style="background: #4db6ac; height: 1px; width: 80%" />
      <CusPopover
        position="right"
        class="sidebar-avatar sidebar-entry"
        @click="!userStore.isLogin ? handleLogin() : void 0"
      >
        <div class="sidebar-avatar-img">
          <CusAvatar
            :name="userStore.isLogin ? userStore.username : '?'"
            color="var(--color-primary)"
            size="2.25rem"
            alt="avatar"
            gradient
          />
          <div
            :class="{
              'sidebar-avatar-status--logout': userStore.loginStatus == 'logout',
              'sidebar-avatar-status--offline': userStore.loginStatus == 'offline',
            }"
            class="sidebar-avatar-status"
          ></div>
        </div>
        <span v-if="expandBar" class="sidebar-avatar-name">{{ userStore.username }}</span>
        <template v-if="userStore.isLogin" #popover>
          <div class="sidebar-user-action">
            <div v-if="userStore.isAdmin" class="sidebar-user-action-item" @click="router.push('/admin')">
              <DashboardOne />
              <span class="sidebar-user-action-item-name">管理面板</span>
            </div>
            <div v-if="userStore.isLogin" class="sidebar-user-action-item" @click="userStore.logout()">
              <Login />
              <span class="sidebar-user-action-item-name">退出登录</span>
            </div>
          </div>
        </template>
      </CusPopover>
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
    // 使用 body 渐变并放大以融入
    background: var(--body-background);
    background-size: calc(100 * var(--vh)) 100vw;
    width: 3.5rem;
    padding: 0.5rem 0.5rem 1rem 0.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition:
      width 0.2s $ease-out-circ,
      transform 0.2s $ease-out-circ;
    z-index: 2;

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

  &-expand {
    display: flex;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s $ease-out-circ;
    cursor: pointer;

    &:not(&--active):hover {
      background: var(--color-trans-50);
    }

    &:not(&--active):active {
      background: var(--color-trans-100);
    }
  }

  &-avatar {
    cursor: pointer;
    padding: 0.5rem 0 !important; // 取消sidebar-entry的padding

    &:hover &-img > :deep(.cus-avatar) {
      transform: rotate(-360deg); // 头像旋转
    }

    &-img {
      position: relative;

      > :deep(.cus-avatar) {
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
      border: 2px solid var(--color-primary-20);
      background-color: $color-success;

      &--offline {
        background-color: $color-warning;
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
    color: var(--color-black);
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
      background: var(--color-primary-60);
    }

    &:not(&--active):active {
      background: var(--color-primary-90);
    }

    &--active {
      background: var(--color-primary-80);
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
  }

  &-user-action {
    padding: 0.25rem;
    border-radius: 0.4rem;
    background-color: var(--color-white);

    &-item {
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 0.4rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-black);

      &:hover {
        background-color: var(--color-trans-100);
      }
    }
  }
}
</style>
