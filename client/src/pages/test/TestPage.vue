<script setup lang="ts">
import ChatLayout from '@/pages/user/chat/ChatLayout.vue';
import { computed, reactive } from 'vue';
import tinycolor from 'tinycolor2';
import CusSelectTest from '@/components/dropdown/test/CusSelectTest.vue';

const colorTest = reactive({
  colors: computed(() => {
    return [tinycolor.mix('#fff', '#252525', 50).toHexString(), tinycolor.mix('#fff', '#252525', 75).toHexString()];
  }),
});
</script>

<template>
  <ChatLayout>
    <div class="color-test">
      颜色测试
      <div v-for="c in colorTest.colors" :key="c" class="color-block" :style="{ 'background-color': c }"></div>
    </div>
    <div class="select-test">
      popup 菜单测试
      <CusSelectTest />
    </div>
  </ChatLayout>
</template>

<style scoped lang="scss">
.color-test {
  display: flex;
  gap: 0.5rem;

  .color-block {
    width: 2rem;
    height: 2rem;
  }
}
</style>
