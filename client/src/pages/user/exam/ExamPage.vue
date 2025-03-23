<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import genApi from '@/api/gen-api.ts';
import { type ApiSchemaExam, ApiSchemaProblemType } from '@/api/gen/data-contracts.ts';
import ExamProblem from '@/pages/user/exam/ExamProblem.vue';
import CusProgress from '@/components/progress/CusProgress.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import CusPagination from '@/components/pagination/CusPagination.vue';
import useGlobal from '@/commands/useGlobal.ts';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import { DialogManager } from '@/components/dialog';

const props = withDefaults(
  defineProps<{
    examId: string;
  }>(),
  {}
);

const exam = ref<ApiSchemaExam | null>(null);
const currentPage = ref(1);
const maxPage = computed(() => (exam.value?.problems?.length || 1));
const currentProblem = computed(() => exam.value?.problems?.[currentPage.value - 1]);

const loadingExam = ref(false);
const loadExam = async () => {
  loadingExam.value = true;
  try {
    const res = await genApi.Tue.examGet(props.examId);
    if (res.status == 200) {
      exam.value = res.data.data!;
    }
  } catch (e) {
    DialogManager.commonDialog({
      type: 'danger',
      title: '加载失败',
      content: '加载失败，请稍后重试！',
      showCancel: false,
    })
  } finally {
    loadingExam.value = false;
  }
};

onMounted(() => {
  loadExam();
});

function handleLastProblem() {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
}

function handleNextProblem() {
  if (currentPage.value < maxPage.value) {
    currentPage.value++;
  }
}

const answers: Record<number, number[] | string> = {};

function handleExamSubmit() {
  console.log('submit');
}

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div class="exam-page" :class="{ small: isSmallScreen }">
    <LoadingModal :visible="loadingExam" />
    <header class="exam-header">
      <CusProgress :value="((currentPage - 1) / (exam?.problems?.length || 1)) * 100" show-text />
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div class="exam-info">
          <h1>{{ exam?.name }}</h1>
          <p class="exam-description">{{ exam?.description }}</p>
        </div>
        <DiliButton class="exam-submit-btn" disabled type="primary" @click="handleExamSubmit"> 提交试卷 </DiliButton>
      </div>
    </header>

    <main class="exam-content">
      <template v-if="currentProblem">
        <ExamProblem
          v-model:answer="answers[currentPage - 1]"
          :exam-problem="currentProblem"
        />
      </template>
    </main>

    <nav class="problem-navigation">
      <CusPagination v-model:current-page="currentPage" :page-count="exam?.problems?.length"></CusPagination>
      <div class="problem-navigation-step">
        <DiliButton type="secondary" :disabled="currentPage <= 1" @click="handleLastProblem">
          上一题
        </DiliButton>
        <DiliButton type="secondary" :disabled="currentPage >= maxPage" @click="handleNextProblem">
          下一题
        </DiliButton>
      </div>
    </nav>
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
}

.exam-description {
  color: var(--text-secondary);
}

.exam-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  //overflow-y: auto;
}

.problem-navigation {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .small & {
    flex-direction: column-reverse;
  }

  &-step {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
</style>