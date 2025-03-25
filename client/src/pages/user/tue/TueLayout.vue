<script setup lang="ts">

import Panel from '@/components/panel/Panel.vue';
</script>

<template>
  <Panel>
    <RouterView v-slot="{ Component }">
      <Transition name="slide-fade">
        <component :is="Component" class="child-view"/>
      </Transition>
    </RouterView>
  </Panel>
</template>

<style scoped lang="scss">

</style>