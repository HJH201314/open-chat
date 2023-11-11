<script setup lang="ts">

</script>

<template>
  <div class="panel">
    <RouterView v-slot="{ Component }">
      <Transition name="slide-fade">
        <component class="child-view" :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
@import "@/assets/animations";
.panel {
  position: relative;
  background-color: white;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  // border: 2px solid $color-grey;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.01);
  border-radius: .5rem;
  // padding: .5rem;
  max-width: 1240px;
  margin: 0 auto;
}

/* 路由动画 */
.child-view {
  position: absolute;
  width:100%;
  overflow: hidden;
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}
</style>