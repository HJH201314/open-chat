<script setup lang="ts">
import ExamProblem from '@/pages/user/tue/exam/ExamProblem.vue';
import CusProgress from '@/components/progress/CusProgress.vue';
import CusPagination from '@/components/pagination/CusPagination.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import { computed, type CSSProperties, ref, watch } from 'vue';
import { DialogManager } from '@/components/dialog';
import type { ApiSchemaExam } from '@/api/gen/data-contracts.ts';
import { useTheme } from '@/components/theme/useTheme.ts';
import { getProblemCategory } from '@/pages/user/tue/exam/utils.ts';

const props = withDefaults(
  defineProps<{
    exam?: ApiSchemaExam;
  }>(),
  {
    exam: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'submit', payload: { answers: Record<number, number[] | string> }): void;
}>();

watch(
  () => props.exam,
  (newExam) => {
    // 初始化答案接收器
    newExam?.problems?.forEach((problem) => {
      answers.value[problem.problem_id!] = getProblemCategory(problem.problem?.type) == 'text' ? '' : ([] as number[]);
    });
  }
);

const { theme } = useTheme();
const currentPage = ref(1);
const maxPage = computed(() => props.exam?.problems?.length || 1);

function isPageAnswerValid(pageNum: number) {
  const problemId = props.exam?.problems?.[pageNum - 1]?.problem_id;
  if (problemId) {
    return isAnswerValid(problemId);
  }
  return false;
}

function isAnswerValid(problemId: number) {
  const answer = answers.value[problemId];
  return (typeof answer == 'string' && answer) || (typeof answer == 'object' && answer.length);
}

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

const highlightInvalidPage = ref(false);

function getPaginationItemStyle(pageNum: number) {
  if (isPageAnswerValid(pageNum)) {
    return {
      border: `1px solid ${theme.colorPrimary}`,
    } as CSSProperties;
  } else if (highlightInvalidPage.value) {
    return {
      border: `1px solid ${theme.colorDanger}`,
    } as CSSProperties;
  }
}

const answers = ref<Record<number, number[] | string>>({});

const answerFinishProgress = computed(() => {
  const totalProblemCount = maxPage.value;
  let finishedProblemCount = 0;
  Object.entries(answers.value).forEach(([problemId]) => {
    if (isAnswerValid(Number(problemId))) {
      finishedProblemCount += 1;
    }
  })
  return (finishedProblemCount / totalProblemCount) * 100;
});

watch(
  () => answers.value,
  (newAnswers) => {
    console.log(newAnswers);
  },
  { deep: true }
);

function handleExamSubmit() {
  const incompleteProblemPages: number[] = [];
  // 检查所有题目是否均已完成
  for (let i = 0; i < maxPage.value; i++) {
    if (!isPageAnswerValid(i + 1)) {
      incompleteProblemPages.push(i + 1);
    }
  }
  if (incompleteProblemPages.length) {
    DialogManager.commonDialog({
      type: 'danger',
      title: '确认提交？',
      content: `题目 ${incompleteProblemPages.join('、')} 未完成，请检查后提交！`,
      cancelButtonProps: {
        color: theme.colorDanger,
        type: 'secondary',
        text: '确认提交',
      },
      confirmButtonProps: {
        text: '去检查',
      },
      confirmHandler: () => {
        highlightInvalidPage.value = true;
        currentPage.value = incompleteProblemPages[0];
      },
    });
    return;
  } else {
    emit('submit', { answers: answers.value });
  }
}
</script>

<template>
  <header class="exam-header">
    <CusProgress :value="answerFinishProgress" show-text />
    <div style="display: flex; justify-content: space-between; align-items: center">
      <DiliButton class="exam-submit-btn" type="primary" @click="handleExamSubmit"> 提交试卷 </DiliButton>
    </div>
  </header>

  <main class="exam-content">
    <template v-for="(problem, i) in exam?.problems || []" :key="problem.problem_id">
      <ExamProblem
        v-show="currentPage - 1 == i"
        v-model:answer="answers[problem.problem_id!]"
        :page="i + 1"
        :exam-problem="problem"
      />
    </template>
  </main>

  <nav class="problem-navigation">
    <CusPagination
      v-model:current-page="currentPage"
      :page-count="exam?.problems?.length"
      :page-item-stsyle="getPaginationItemStyle"
    ></CusPagination>
    <div class="problem-navigation-step">
      <DiliButton type="secondary" :disabled="currentPage <= 1" @click="handleLastProblem"> 上一题</DiliButton>
      <DiliButton type="secondary" :disabled="currentPage >= maxPage" @click="handleNextProblem"> 下一题</DiliButton>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.exam-description {
  color: var(--text-secondary);
}

.exam-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
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