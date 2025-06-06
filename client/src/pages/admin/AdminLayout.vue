<script setup lang="ts">
import Logo from '@/components/logo/Logo.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, provide, ref, useTemplateRef, watch } from 'vue';
import { useTheme } from '@/components/theme/useTheme.ts';
import { useElementSize, useWindowSize } from '@vueuse/core';
import { AdminLayoutContentSizeKey } from '@/pages/admin/types.ts';
import useGlobal from '@/commands/useGlobal.ts';
import { MenuApplicationIcon, RollbackIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const entries = computed(() => router.getRoutes().find((route) => route.name === 'Admin')?.children || []);
const route = useRoute();
const currentRoute = ref(route.name);
watch(
  () => currentRoute.value,
  (newRouteName, oldRouteName) => {
    if (newRouteName != oldRouteName && route.name != newRouteName) {
      router.push({ name: newRouteName });
    }
  }
);
watch(
  () => route.name,
  (newRouteName) => {
    currentRoute.value = newRouteName;
  }
);

const { isSmallScreen } = useGlobal();

// toggle sidebar
const collapsed = ref(isSmallScreen.value);
const collapseIconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'));
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};
const showSidebar = ref(!isSmallScreen.value);

const contentRef = useTemplateRef<HTMLElement>('content');
const asideRef = useTemplateRef<HTMLElement>('aside');
const { width: asideWidth, height: asideHeight } = useElementSize(asideRef);
const { width: windowWidth, height: windowHeight } = useWindowSize();
const contentWidth = computed(() => {
  return windowWidth.value - asideWidth.value - 32 /* padding */;
});
provide(AdminLayoutContentSizeKey, {
  width: contentWidth,
  height: windowHeight,
  contentRef: contentRef,
});

const { currentTheme } = useTheme();
</script>

<template>
  <t-layout>
    <t-aside v-if="showSidebar" ref="aside" style="width: fit-content">
      <t-menu
        v-model:value="currentRoute"
        :theme="currentTheme"
        width="170px"
        :collapsed="collapsed"
        style="overflow-x: hidden"
      >
        <template #operations>
          <t-button class="t-demo-collapse-btn" variant="text" shape="square" @click="changeCollapsed">
            <template #icon>
              <t-icon :name="collapseIconName" />
            </template>
          </t-button>
        </template>
        <template #logo>
          <Logo :show-favicon="collapsed" :show-title="!collapsed" @click="router.push('/')" />
        </template>
        <template v-for="entry in entries" :key="entry.name">
          <!-- 有二级菜单 -->
          <t-submenu v-if="entry.children" :value="entry.name">
            <template #icon>
              <t-icon :name="entry.meta?.icon" />
            </template>
            <template #title>
              <span>{{ entry.meta?.title }}</span>
            </template>
            <t-menu-item v-for="subEntry in entry.children" :key="subEntry.name" :value="subEntry.name">
              <template v-if="subEntry.meta?.icon" #icon>
                <t-icon :name="subEntry.meta?.icon" />
              </template>
              <span>{{ subEntry.meta?.title }}</span>
            </t-menu-item>
          </t-submenu>
          <!-- 一级菜单 -->
          <t-menu-item v-else :value="entry.name">
            <template #icon>
              <t-icon :name="entry.meta?.icon" />
            </template>
            <span>{{ entry.meta?.title }}</span>
          </t-menu-item>
        </template>
      </t-menu>
    </t-aside>
    <t-layout class="admin-layout-right">
      <t-header style="padding: 1rem; background-color: transparent; display: flex; align-items: center; gap: 0.5rem">
        <t-button v-if="isSmallScreen" variant="outline" shape="circle" @click="showSidebar = !showSidebar">
          <template #icon>
            <menu-application-icon />
          </template>
        </t-button>
        <t-button v-else variant="outline" shape="circle" @click="router.back()">
          <template #icon>
            <rollback-icon />
          </template>
        </t-button>
        <t-breadcrumb>
          <t-breadcrumb-item v-for="match in route.matched" :key="match.name" :to="{ name: match.name }"
            >{{ match.meta?.title || '' }}
          </t-breadcrumb-item>
        </t-breadcrumb>
      </t-header>
      <t-content ref="content" style="padding: 0 1rem; flex: auto; min-height: 0">
        <RouterView style="height: 100%; display: flex; flex-direction: column; gap: 0.5rem" />
      </t-content>
      <!--      <t-footer>Copyright @ 2017-{{ new Date().getFullYear() }} FCraft. All Rights Reserved</t-footer>-->
    </t-layout>
  </t-layout>
</template>

<style scoped lang="scss">
:global(body) {
  user-select: text;
}

.admin-layout {
  &-right {
    height: calc(100 * var(--vh));
    max-height: calc(100 * var(--vh));
  }
}
</style>
