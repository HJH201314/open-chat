<script setup lang="ts">
import ChatLayout from '@/pages/user/chat/ChatLayout.vue';
import { computed, reactive } from 'vue';
import tinycolor from 'tinycolor2';
import CusSelectTest from '@/components/dropdown/test/CusSelectTest.vue';
import CusMenu from '@/components/dropdown/CusMenu.vue';

const colorTest = reactive({
  colors: computed(() => {
    return [
      tinycolor.mix('#fff', '#252525', 2.5).toHexString(),
      tinycolor.mix('#fff', '#252525', 5).toHexString(),
      tinycolor.mix('#fff', '#252525', 10).toHexString(),
      tinycolor.mix('#fff', '#252525', 15).toHexString(),
      tinycolor.mix('#fff', '#252525', 20).toHexString(),
      tinycolor.mix('#fff', '#252525', 25).toHexString(),
      tinycolor.mix('#fff', '#252525', 30).toHexString(),
      tinycolor.mix('#fff', '#252525', 35).toHexString(),
      tinycolor.mix('#fff', '#252525', 40).toHexString(),
      tinycolor.mix('#fff', '#252525', 45).toHexString(),
    ];
  }),
});
</script>

<template>
  <ChatLayout>
    <CusMenu>
      <div class="color-test">
        颜色测试
        <div v-for="c in colorTest.colors" :key="c" class="color-block" :style="{ 'background-color': c }"></div>
      </div>
    </CusMenu>
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
