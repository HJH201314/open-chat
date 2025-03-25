<script setup lang="ts"></script>

<template>
  <div class="tue-layout">
    <RouterView v-slot="{ Component }">
      <Transition name="slide-fade">
        <component :is="Component" class="child-view" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.tue-layout {
  width: 100vw;
  height: calc(100 * var(--vh));
  position: relative;
}

/* 路由动画 */
.child-view {
  position: absolute;
  inset: 0;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
