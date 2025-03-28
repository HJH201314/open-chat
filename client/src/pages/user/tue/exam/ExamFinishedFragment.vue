<script setup lang="ts">
import DiliButton from '@/components/button/DiliButton.vue';
import { useIntervalFn } from '@vueuse/core';
import { ref, watch, watchEffect } from 'vue';
import genApi from '@/api/gen-api.ts';
import { ApiSchemaScoreStatus } from '@/api/gen/data-contracts.ts';
import { ParticleManager } from '@/components/particle/ParticleManager.ts';

const props = defineProps<{
  timeSpent?: number; // 耗时
  examTotalScore?: number; // 测验满分
  answerRecordId?: number; // 提交成功后的答题记录 ID
}>();

defineEmits<{
  (e: 'back'): void;
}>();

const score = ref<number>();
const requestTimes = ref(0);
const { resume: resumeRequest, pause: pauseRequest } = useIntervalFn(
  async () => {
    if (!props.answerRecordId) {
      pauseRequest();
      return;
    }
    requestTimes.value++;
    if (requestTimes.value >= 4) {
      pauseRequest();
    }
    try {
      const res = await genApi.Tue.examRecordsGet(props.answerRecordId);
      if (res.status == 200) {
        switch (res.data.data?.status) {
          case ApiSchemaScoreStatus.EnumStatusCompleted:
            score.value = res.data.data?.total_score;
            pauseRequest();
            break;
          case ApiSchemaScoreStatus.EnumStatusFailed:
            pauseRequest();
            break;
          default:
            break;
        }
      }
    } catch (_) {
      pauseRequest();
    }
  },
  15000,
  {
    immediate: false,
    immediateCallback: true,
  }
);
watch(
  () => props.answerRecordId,
  (newVal, oldVal) => {
    if (!oldVal && newVal && newVal > 0) {
      ParticleManager.show();
      setTimeout(() => {
        // 开始轮询
        resumeRequest();
      }, 1000);
    } else {
      pauseRequest();
    }
  },
  { immediate: true }
);

watchEffect(() => {
  console.log(props);
});

function handleGoDetail() {
  // TODO
}

function handleGoPersonal() {
  // TODO
}
</script>

<template>
  <main class="exam-finished">
    <p class="exam-finished-description">恭喜！{{ timeSpent ? `耗时: ${timeSpent} 秒` : '' }}</p>
    <p v-if="score !== undefined">
      <span class="exam-finished-score">{{ score }} </span>
      <span v-if="examTotalScore" class="exam-finished-total-score"> / {{ examTotalScore }}</span>
    </p>
    <p v-else class="exam-finished-description">你已完成测验，请稍后查看分数~</p>
    <DiliButton v-if="score !== undefined" class="exam-finished-back" type="primary" text="查看详情" @click="handleGoDetail" />
    <DiliButton v-else class="exam-finished-back" type="primary" text="个人中心" @click="handleGoPersonal" />
    <DiliButton class="exam-finished-back" type="secondary" text="再来一次" @click="$emit('back')" />
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

  &-score {
    color: var(--color-primary);
    font-size: 2em;
  }

  &-total-score {
    color: var(--text-secondary);
    font-size: 1.5em;
  }

  &-back {
    margin-top: 1rem;
  }
}
</style>