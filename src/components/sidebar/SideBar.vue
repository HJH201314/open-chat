<script setup lang="ts">

import { defineComponent, ref, VueElement } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SettingTwo } from "@icon-park/vue-next";

const extendBar = ref(false);

const currentPage = ref("");

const route = useRoute();

defineComponent({
  components: {
    SettingTwo,
  }
});

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
    key: 'setting',
    name: "设置",
    icon: 'setting-two',
    href: "/setting",
  },
]);

const router = useRouter();
function handleEntryClick(entry: Entry) {
  if (entry.href) {
    if (entry.href == route.path) return;
    router.push(entry.href);
  } else if (entry.onClick) {
    entry.onClick();
  }
}
</script>

<template>
  <div class="sidebar">
    <!-- 占位，避免sidebar-body变化（展开）时布局变化 -->
    <div class="sidebar-placeholder"></div>
    <div class="sidebar-body" :class="{'sidebar-body-extend': extendBar}">
      <div class="sidebar-icon" @click="() => extendBar = !extendBar">
        <font-awesome-icon class="sidebar-icon-bar" :class="{'sidebar-icon-bar-ext': extendBar}" :icon="['fas', 'bars']"></font-awesome-icon>
      </div>
      <div class="sidebar-avatar">
        <img class="sidebar-avatar-img" src="../../assets/image/default_avatar.png" alt="avatar"/>
      </div>
      <div class="sidebar-entries">
        <div v-for="entry in entries" :key="entry.key" class="sidebar-entry" :class="{'sidebar-entry-focus': entry.href == route.path}" @click="handleEntryClick(entry)">
          <component :is="entry.icon" v-if="!entry.href || entry.href != route.path" class="sidebar-entry-icon" theme="outline" size="24"></component>
          <component :is="entry.icon" v-else class="sidebar-entry-icon sidebar-entry-icon-focus" theme="filled" size="24"></component>
          <span class="sidebar-entry-name" :class="{'sidebar-entry-name-ext': extendBar}">{{ entry.name }}</span>
        </div>
      </div>
      <div class="sidebar-footer">
        <font-awesome-icon class="sidebar-footer-github" :icon="['fab', 'github']"></font-awesome-icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.sidebar {
  &-placeholder {
    width: 3.5rem;
    height: 100%;
  }

  &-body {
    position: fixed; // 统一fixed解决还原时占位异常
    left: 0;
    top: 0;
    background-color: $color-white;
    height: 100%;
    width: 3.5rem;
    // padding: .5rem;
    padding: .5rem 0;
    text-align: center;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    transition: width .2s $ease-out-circ;

    &-extend {
      width: 12rem;
      z-index: 999;
    }
  }

  &-avatar {
    cursor: pointer;
    margin: 0 .5rem;

    &-img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      transition: transform .2s $ease-out-circ;
      &:hover {
        transform: rotate(-360deg);
      }
    }
  }

  &-icon {
    padding: .5rem;
    width: 100%;
    transition: background-color .2s $ease-out-circ;
    cursor: pointer;
    &:hover {
      background: #efefef;
    }

    &-bar {
      margin: 0 auto;
      transition: transform .2s $ease-out-circ;
      &-ext {
        transform: rotate(90deg);
      }
    }
  }

  &-entries {
    width: 100%;
  }
  &-entry {
    padding: .5rem;
    width: 100%;
    transition: background-color .2s $ease-out-circ;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    &:hover {
      background: #efefef;
    }
    &-focus {
      background: #d5ebe1;
    }

    &-icon {
      margin: 0 auto;
      &-focus {
        color: $color-primary;
      }
    }
    &-name {
      margin: 0 auto;
      font-size: .75rem;
      text-align: start;
    }
  }

  &-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: .5rem;
    font-size: 1.5rem;

    &-github {
      color: $color-gray;
      transition: color .2s $ease-out-circ;
      cursor: pointer;
      margin: 0 auto; // 水平居中
      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>