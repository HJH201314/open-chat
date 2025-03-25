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

const limitTimeText = computed(() => props.exam.limit_time ? `限时：${props.exam.limit_time / 60} 分钟` : '')
</script>

<template>
  <main class="exam-welcome">
    <h1>{{ exam?.name }}</h1>
    <p class="exam-welcome-description">{{ exam?.description }}</p>
    <p class="exam-welcome-description">{{ limitTimeText }}</p>
    <DiliButton class="exam-welcome-start" type="primary" text="开始作答" @click="$emit('start')" />
  </main>
</template>

<style scoped lang="scss">
.exam-welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-description {
    color: var(--text-secondary);
  }

  &-start {
    margin-top: 1rem;
  }
}
</style>