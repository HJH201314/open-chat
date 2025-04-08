<script setup lang="ts">
import ExamProblem from '@/pages/user/tue/exam/ExamProblem.vue';
import type { MessageInfo } from '@/types/data.ts';
import type { ApiExamSubmitProblemResponse } from '@/api/gen/data-contracts.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import { ParticleManager } from '@/components/particle/ParticleManager.ts';
import { db } from '@/store/data/database.ts';
import genApi from '@/api/gen-api.ts';

const props = defineProps<{
  item: MessageInfo;
}>();

async function handleSubmitted(res: ApiExamSubmitProblemResponse) {
  const score = res.score || 0;
  if (score > 0) {
    if (score == 100) {
      ToastManager.success(`回答正确！`);
    } else {
      ToastManager.warning(`回答部分正确~`);
    }
    ParticleManager.show();
    try {
      await db.messages.where({ sessionId: props.item.sessionId, id: props.item.id }).modify((obj) => {
        obj['extra'] = {
          ...obj['extra'],
          'question-finished': true,
          'score': score,
        };
      });
      props.item.messageId && await genApi.Chat.messageUpdatePost(props.item.messageId, {
        extra: {
          'question-finished': true,
          'score': score,
        },
      });
    } finally {
      // do nothing
    }
  } else {
    ToastManager.danger('回答错误！');
  }
}
</script>

<template>
  <ExamProblem
    v-if="item.extra?.['question']"
    :problem="item.extra?.['question']"
    :show-answer="item.extra?.['question-finished']"
    choice-style="background"
    :choice-type="item.extra?.['question-finished'] ? 'normal' : 'highlight'"
    show-submit
    @submitted="handleSubmitted"
  >
    <template #header-score>
      <span v-if="item.extra?.['score']" style="color: var(--color-primary)">{{ item.extra?.['score'] }}</span><span v-if="item.extra?.['score']"> / 100</span>
    </template>
  </ExamProblem>
</template>

<style scoped lang="scss"></style>
