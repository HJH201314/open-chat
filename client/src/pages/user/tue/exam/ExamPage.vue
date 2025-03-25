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

const props = withDefaults(
  defineProps<{
    examId: string;
  }>(),
  {},
);

const exam = ref<ApiSchemaExam>();
const { current: currentStep, goToNext: goToNextStep } = useStepper(['welcome', 'answering', 'finished'], 'welcome');
const fragmentAnsweringRef = useTemplateRef('fragment-answering');
watch(() => currentStep.value, (newStep) => {
  if (newStep == 'answering') {
    until(fragmentAnsweringRef).not.toBeNull().then(() => {
      fragmentAnsweringRef.value?.start();
    });
  }
});

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

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div class="exam-page" :class="{ small: isSmallScreen }">
    <LoadingModal :visible="loadingExam" />
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
    />
    <ExamFinishedFragment v-if="currentStep == 'finished'" class="exam-page-fragment-full" :exam="exam" />
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
