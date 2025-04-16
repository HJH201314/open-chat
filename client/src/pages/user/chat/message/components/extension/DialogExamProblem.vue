<script setup lang="ts">
import ExamProblem from '@/pages/user/tue/exam/ExamProblem.vue';
import type { ApiCourseSubmitProblemResponse } from '@/api/gen/data-contracts.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import { ParticleManager } from '@/components/particle/ParticleManager.ts';
import type { MessageExtensionBaseProps } from '@/pages/user/chat/message/components/extension/types.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import type { AnswerType } from '@/pages/user/tue/exam/types.ts';
import { updateSessionMessageExtra } from '@/store/data/useSession.ts';

const props = defineProps<MessageExtensionBaseProps>();

const userStore = useUserStore();

async function handleSubmitted(res: ApiCourseSubmitProblemResponse, answer?: AnswerType) {
  const score = res.score || 0;
  if (score > 0) {
    if (score == 100) {
      ToastManager.success(`回答正确！`);
    } else {
      ToastManager.warning(`回答部分正确~`);
    }
    ParticleManager.show();
    try {
      console.log('updateSessionMessageExtra', props.msgInfo.sessionId, props.msgInfo.id, answer);
      await updateSessionMessageExtra(props.msgInfo.sessionId, props.msgInfo.id, {
        'question-finished': true,
        'my-answer': answer,
        score: score,
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
    v-if="msgInfo.extra?.['question']"
    :answer="msgInfo.extra?.['my-answer']"
    :user-answer="{ answer: msgInfo.extra?.['my-answer'] }"
    :problem="msgInfo.extra?.['question']"
    :show-answer="msgInfo.extra?.['question-finished']"
    choice-style="background"
    :disabled="userStore.userId != sessionInfo.userId"
    :choice-type="msgInfo.extra?.['question-finished'] ? 'normal' : 'highlight'"
    show-submit
    @submitted="handleSubmitted"
  >
    <template #header-score>
      <span v-if="msgInfo.extra?.['score']" style="color: var(--color-primary)">{{ msgInfo.extra?.['score'] }}</span
      ><span v-if="msgInfo.extra?.['score']"> / 100</span>
    </template>
  </ExamProblem>
</template>

<style scoped lang="scss"></style>
