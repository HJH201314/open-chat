<script setup lang="ts">
import DiliButton from '@/components/button/DiliButton.vue';

defineEmits<{
  (e: 'back'): void;
}>();

function handleGoPersonal() {
  // TODO
}
</script>

<template>
  <main class="exam-finished">
    <p class="exam-finished-description">恭喜你完成了测验！</p>
    <p class="exam-finished-description">请稍后查看分数</p>
    <DiliButton class="exam-finished-back" type="primary" text="个人中心" @click="handleGoPersonal" />
    <DiliButton class="exam-finished-back" type="secondary" text="返回首页" @click="$emit('back')" />
  </main>
</template>

<style scoped lang="scss">
.exam-finished {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-description {
    color: var(--text-secondary);
  }

  &-back {
    margin-top: 1rem;
  }
}
</style>