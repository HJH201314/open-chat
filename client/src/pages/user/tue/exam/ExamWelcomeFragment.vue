<script setup lang="ts">
import type { ApiSchemaExam } from '@/api/gen/data-contracts.ts';
import DiliButton from '@/components/button/DiliButton.vue';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    exam?: ApiSchemaExam;
  }>(),
  {
    exam: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'start'): void;
}>();

const limitTimeText = computed(() => props.exam.limit_time ? `限时：${(props.exam.limit_time / 60).toFixed(2).replace('.00', '')} 分钟` : '')
</script>

<template>
  <main class="exam-welcome">
    <h1 class="exam-welcome-title">{{ exam?.name }}</h1>
    <p class="exam-welcome-description">{{ exam?.description }}</p>
    <p class="exam-welcome-time">{{ limitTimeText }}</p>
    <DiliButton class="exam-welcome-start" type="primary" text="开始作答" @click="$emit('start')" />
  </main>
</template>

<style scoped lang="scss">
.exam-welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-title {
    font-size: 1.1rem;
  }

  &-description {
    color: var(--text-secondary);
  }

  &-time {
    color: var(--text-secondary);
    margin-top: 1rem;
  }

  &-start {
    margin-top: 1rem;
  }
}
</style>