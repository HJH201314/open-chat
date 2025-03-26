<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import genApi from '@/api/gen-api.ts';
import { type ApiSchemaExam } from '@/api/gen/data-contracts.ts';
import useGlobal from '@/commands/useGlobal.ts';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import { DialogManager } from '@/components/dialog';
import router from '@/plugins/router.ts';
import ExamAnsweringFragment from '@/pages/user/tue/exam/ExamAnsweringFragment.vue';
import ExamWelcomeFragment from '@/pages/user/tue/exam/ExamWelcomeFragment.vue';
import { until, useStepper } from '@vueuse/core';
import ExamFinishedFragment from '@/pages/user/tue/exam/ExamFinishedFragment.vue';
import { useRoute } from 'vue-router';
import ToastManager from '@/components/toast/ToastManager.ts';
import IconButton from '@/components/IconButton.vue';
import { Back } from '@icon-park/vue-next';

const props = withDefaults(
  defineProps<{
    examId: string;
  }>(),
  {}
);

const exam = ref<ApiSchemaExam>();
const {
  current: currentStep,
  goToNext: goToNextStep,
  goTo: goToStep,
} = useStepper(['welcome', 'answering', 'finished'], 'welcome');
const fragmentAnsweringRef = useTemplateRef('fragment-answering');
watch(
  () => currentStep.value,
  (newStep) => {
    if (newStep == 'answering') {
      until(fragmentAnsweringRef)
        .not.toBeNull()
        .then(() => {
          fragmentAnsweringRef.value?.start();
        });
    }
  }
);

const loadingExam = ref(false);
// 加载考试信息
const loadExam = async () => {
  const res = await genApi.Tue.examGet(props.examId);
  if (res.status == 200) {
    exam.value = res.data.data!;
  }
};
// 处理考试信息加载
const handleLoadExam = async () => {
  loadingExam.value = true;
  try {
    await loadExam();
  } catch (e) {
    DialogManager.commonDialog({
      type: 'danger',
      title: '加载失败',
      content: '加载失败，请稍后重试！',
      confirmButtonProps: {
        text: '返回',
      },
      confirmHandler: () => {
        router.back();
      },
    });
  } finally {
    loadingExam.value = false;
  }
};

const route = useRoute();
onMounted(async () => {
  await handleLoadExam();
  // 带参数自动开始考试
  if (route.query['autoStart'] || route.query['auto-start']) {
    goToNextStep();
  }
});

const handleBack = () => {
  switch (currentStep.value) {
    case 'welcome':
    case 'finished':
      router.back();
      return;
    case 'answering':
      DialogManager.commonDialog({
        title: '退出测验',
        content: '退出后讲清空已作答内容，确定要退出测验吗？',
        presetType: 'danger',
        confirmButtonProps: {
          text: '退出',
        },
        confirmHandler: () => {
          router.back();
          // TODO： 退出测验记录
        },
      });
      return;
  }
};

// 提交回答
const handleAnswerSubmit = async (payload: { answers: Record<number, number[] | string>; timeSpent: number }) => {
  if (!props.examId) return;

  const examId = Number(props.examId);
  try {
    const res = await genApi.Tue.examSubmitPost(examId, {
      answers: Object.entries(payload.answers).map(([problemId, answer]) => ({
        problem_id: Number(problemId),
        answer: answer,
      })),
      time_spent: payload.timeSpent,
    });
    if (res.status == 200) {
      goToNextStep();
    }
  } catch (_) {
    ToastManager.danger('提交失败，请稍后重试！');
  }
};

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div class="exam-page" :class="{ small: isSmallScreen }">
    <LoadingModal :visible="loadingExam" />
    <IconButton type="secondary" :color="currentStep == 'answering' ? 'danger' : ''" @click="handleBack">
      <Back />
    </IconButton>
    <ExamWelcomeFragment
      v-if="currentStep == 'welcome'"
      class="exam-page-fragment-full"
      :exam="exam"
      @start="goToNextStep"
    />
    <ExamAnsweringFragment
      v-if="currentStep == 'answering'"
      ref="fragment-answering"
      class="exam-page-fragment-full"
      :exam="exam"
      @submit="handleAnswerSubmit"
    />
    <ExamFinishedFragment
      v-if="currentStep == 'finished'"
      class="exam-page-fragment-full"
      :exam="exam"
      @back="goToStep('welcome')"
    />
  </div>
</template>

<style scoped lang="scss">
.exam-page {
  position: relative;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &-fragment-full {
    width: 100%;
    height: 100%;
  }
}
</style>
