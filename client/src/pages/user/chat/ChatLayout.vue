<script setup lang="ts">
import Panel from '@/components/panel/Panel.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import { h, onMounted, ref, useTemplateRef, watchEffect } from 'vue';
import { useEventBus } from '@vueuse/core';
import { noPaddingKey } from '@/constants/eventBusKeys.ts';
import useGlobal from '@/commands/useGlobal.ts';
import { Book, Message, SettingTwo } from '@icon-park/vue-next';
import { DialogManager } from '@/components/dialog';
import SettingDialog from '@/pages/user/chat/setting/SettingDialog.vue';
import type { SidebarEntry } from '@/components/sidebar/types.ts';

const sidebarRef = useTemplateRef('sidebar');
const showPadding = ref(true);
const noPaddingBus = useEventBus(noPaddingKey);
noPaddingBus.on((v) => {
  showPadding.value = !v;
});

const { isLargeScreen, isSmallScreen } = useGlobal();

watchEffect(() => {
  // 大屏时展示边栏、关闭零内衬
  if (isLargeScreen.value) {
    noPaddingBus.emit(false);
  }
  // 进入对话时侧边栏收起，退出后展开
  else {
    noPaddingBus.emit(true);
  }
});

// 在 onMounted 后再初始化 entries，否则会报错
const entries = ref<SidebarEntry[]>([]);
onMounted(() => {
  entries.value = [
    {
      key: 'dialog',
      name: '对话',
      icon: h(Message),
      href: '/chat/message',
      active: (path) => path.startsWith('/chat/share'),
    },
    {
      key: 'learn',
      name: '学习',
      icon: h(Book),
      href: '/chat/learning',
    },
    {
      key: 'setting',
      name: '设置',
      icon: h(SettingTwo),
      href: '/chat/setting',
      onClick() {
        // 打开设置对话框
        DialogManager.renderDialog(h(SettingDialog));
      },
    },
  ];
});
</script>

<template>
  <div class="chat-layout">
    <SideBar ref="sidebar" :default-show="isLargeScreen" :entries="entries" />
    <div
      :class="{ 'no-padding': !showPadding, 'left-padding': !sidebarRef?.isShowing || isSmallScreen }"
      class="chat-panel-wrapper"
    >
      <Panel class="panel">
        <slot />
        <RouterView v-slot="{ Component }">
          <Transition name="slide-fade">
            <component :is="Component" class="child-view" />
          </Transition>
        </RouterView>
      </Panel>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.chat-layout {
  position: relative;
  display: flex;
  flex-direction: row;
}

.chat-panel-wrapper {
  --padding: 0.5rem;
  --padding-sidebar: 0;
  flex: 1;
  box-sizing: border-box;
  padding: var(--padding) var(--padding) var(--padding) var(--padding-sidebar);
  transition: padding 0.1s $ease-out-cubic;
  @media screen and (max-width: $screen-sm) {
    --padding: 0.5rem;
  }

  &.no-padding {
    --padding: 0;

    > .panel {
      border-radius: 0 !important;
      box-shadow: none;
    }
  }

  &.left-padding {
    --padding-sidebar: var(--padding);
  }
}

/* 路由动画 */
.child-view {
  position: absolute;
  width: 100%;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  background: var(--color-white);
}
</style>
