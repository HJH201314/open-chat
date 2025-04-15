<script setup lang="ts">
import { type ApiSchemaExamUserRecord, ApiSchemaScoreStatus } from '@/api/gen/data-contracts.ts';
import { computed } from 'vue';

const props = defineProps<{
  data: ApiSchemaExamUserRecord;
}>();

const myScore = computed(() => {
  return (props.data.total_score || 0) / 100;
});
const fullScore = computed(() => {
  return (props.data.exam?.total_score || 0) / 100;
});
const scorePercent = computed(() => {
  return myScore.value / fullScore.value;
});

defineEmits<{
  (e: 'detail'): void;
}>();
</script>

<template>
  <div class="exam-entry" @click="$emit('detail')">
    <header class="header">
      <!--      <span class="header-tag">#{{ data.exam?.subjects }}</span>-->
      <span class="header-title">{{ data.exam?.name || '' }}</span>
      <span v-if="data.status == ApiSchemaScoreStatus.EnumStatusCompleted" class="header-score"
        ><span class="header-score-mine" :class="{ red: scorePercent < 0.6, green: scorePercent >= 0.6 }">{{
          myScore
        }}</span>
        / {{ (data.exam?.total_score || 0) / 100 }}</span
      >
      <span v-else-if="data.status == ApiSchemaScoreStatus.EnumStatusFailed" class="header-score">评分失败</span>
      <span v-else class="header-score">评分中...</span>
    </header>
    <div class="body">
      <div class="body-desc">{{ data.exam?.description || '' }}</div>
      <div class="body-time">{{ data.updated_at ? new Date(data.updated_at).toLocaleDateString() : '' }}</div>
    </div>
    <footer class="footer"></footer>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.exam-entry {
  padding: 0.5rem;
  border-radius: $border-radius;
  background: var(--color-primary-50);
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
      color: var(--color-primary);
      flex: 1 1 auto;
    }

    &-score {
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
