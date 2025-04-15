<script setup lang="ts">
import { type ApiSchemaProblemUserRecord } from '@/api/gen/data-contracts.ts';
import { computed } from 'vue';

const props = defineProps<{
  data: ApiSchemaProblemUserRecord;
}>();

const myScore = computed(() => {
  return props.data.score || 0;
});
const scorePercent = computed(() => {
  return myScore.value / 100;
});

defineEmits<{
  (e: 'detail'): void;
}>();
</script>

<template>
  <div class="problem-entry" @click="$emit('detail')">
    <header class="header">
      <span class="header-title">{{ data.problem?.description || '' }}</span>
      <span class="header-score"
        ><span class="header-score-mine" :class="{ red: scorePercent < 0.6, green: scorePercent >= 0.6 }">{{
          myScore
        }}</span>
        / 100</span
      >
    </header>
    <div class="body">
      <div class="body-time">{{ data.created_at ? new Date(data.created_at).toLocaleDateString() : '' }}</div>
    </div>
    <footer class="footer"></footer>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.problem-entry {
  padding: 0.5rem;
  border-radius: $border-radius;
  background: var(--color-primary-40);
  cursor: pointer;
  transition: background-color 0.2s $ease-out-circ;

  &:hover {
    background: var(--color-primary-80);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;

    &-title {
      @include line-clamp-1;
      word-break: break-all;
      color: var(--color-primary);
      flex: 1 1 auto;
    }

    &-score {
      flex-shrink: 0;
      font-size: 0.9rem;
      margin-left: auto;
      color: var(--color-grey-500);

      &-mine {
        &.green {
          color: var(--color-success);
        }

        &.red {
          color: var(--color-danger);
        }
      }
    }
  }

  .body {
    font-size: 0.9rem;

    &-desc {
      @include line-clamp-1;
      color: var(--color-trans-1500);
    }

    &-time {
      font-size: 0.9em;
      color: var(--color-trans-1000);
    }
  }
}
</style>
