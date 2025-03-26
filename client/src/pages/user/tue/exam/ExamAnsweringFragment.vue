<script setup lang="ts">
import ExamProblem from '@/pages/user/tue/exam/ExamProblem.vue';
import CusProgress from '@/components/progress/CusProgress.vue';
import CusPagination from '@/components/pagination/CusPagination.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import { computed, type CSSProperties, ref, useTemplateRef, watch } from 'vue';
import { DialogManager } from '@/components/dialog';
import type { ApiSchemaExam } from '@/api/gen/data-contracts.ts';
import { useTheme } from '@/components/theme/useTheme.ts';
import { getProblemCategory } from '@/pages/user/tue/exam/utils.ts';
import { StopwatchStart } from '@icon-park/vue-next';
import Panel from '@/components/panel/Panel.vue';
import { useCountdown, useElementBounding } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    buttonBackLeft?: number; // 返回按钮的 clientLeft, 用来避让返回按钮
    exam?: ApiSchemaExam;
  }>(),
  {
    buttonBackLeft: 0,
    exam: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'submit', payload: { answers: Record<number, number[] | string>; timeSpent: number }): void;
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

const countdownTime = 24 * 60 * 60;
// 这是一个一天的倒计时，单位为秒
const {
  remaining: oneDayCountdownRemaining,
  start: startCountdown,
  reset: resetCountdown,
  pause: pauseCountdown,
} = useCountdown(countdownTime, { immediate: false });
const examCountdownRemaining = computed(() => {
  return props.exam?.limit_time
    ? props.exam?.limit_time - (countdownTime - oneDayCountdownRemaining.value)
    : oneDayCountdownRemaining.value;
});
// 这是经过转换后的考试剩余时间
const remainingTimeText = computed(() => {
  const remaining = examCountdownRemaining.value;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});
watch(
  () => examCountdownRemaining.value,
  (newRemaining) => {
    if (newRemaining <= 0) {
      doSubmit();
    }
  }
);

const currentPage = ref(1);
const maxPage = computed(() => props.exam?.problems?.length || 1);

const examContentRef = useTemplateRef('exam-content');
watch(
  () => currentPage.value,
  (newCurrentPage) => {
    const problemElement = document.getElementById(`problem-${newCurrentPage - 1}`);
    if (!problemElement) return;
    examContentRef.value?.scrollTo({
      top: problemElement.offsetTop - 16, // offset 减去 padding
      behavior: 'smooth',
    });
  }
);

function isPageAnswerValid(pageNum: number) {
  const problemId = props.exam?.problems?.[pageNum - 1]?.problem_id;
  const valid = isAnswerValid(problemId);
  if (problemId) {
    return valid;
  }
  return false;
}

function isAnswerValid(problemId?: number) {
  if (!problemId) return false;
  const answer = answers.value[problemId];
  return (
    (typeof answer == 'string' && answer) || typeof answer == 'boolean' || (typeof answer == 'object' && answer.length)
  );
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

const answers = ref<Record<number, number[] | string>>({});

const answerFinishProgress = computed(() => {
  const totalProblemCount = maxPage.value;
  let finishedProblemCount = 0;
  Object.entries(answers.value).forEach(([problemId]) => {
    if (isAnswerValid(Number(problemId))) {
      finishedProblemCount += 1;
    }
  });
  return (finishedProblemCount / totalProblemCount) * 100;
});

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

watch(
  () => answers.value,
  (newAnswers) => {
    console.log(newAnswers);
  },
  { deep: true }
);

const paginationItemStyle = computed(() => {
  const res = {} as Record<number, CSSProperties>;
  for (let i = 1; i <= maxPage.value; i++) {
    res[i] = getPaginationItemStyle(i) ?? {};
  }
  return res;
});

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
      cancelHandler: () => {
        doSubmit();
      },
      confirmHandler: () => {
        highlightInvalidPage.value = true;
        currentPage.value = incompleteProblemPages[0];
      },
    });
    return;
  } else {
    doSubmit();
  }
}

function doSubmit() {
  const timeSpent = countdownTime - oneDayCountdownRemaining.value;
  resetCountdown();
  pauseCountdown();
  emit('submit', { answers: answers.value, timeSpent: timeSpent });
}

// 专门用来避让返回按钮
const examPanelRef = useTemplateRef('exam-panel');
const { left: examPanelLeft } = useElementBounding(examPanelRef);
const headerPaddingLeft = computed(() => {
  const deltaX = 40 - (examPanelLeft.value - props.buttonBackLeft);
  return deltaX > 0 ? deltaX : 0;
})

defineExpose({
  start: startCountdown,
});
</script>

<template>
  <div class="exam-answering-fragment">
    <header class="exam-header" :style="{'padding-left': `${headerPaddingLeft}px`}">
      <div v-if="exam?.limit_time" class="exam-countdown" :title="`倒计时${examCountdownRemaining}秒`">
        <StopwatchStart />
        {{ remainingTimeText }}
      </div>
      <CusProgress :value="answerFinishProgress" foreground-color="var(--color-primary-lighter)" show-text />
      <div style="display: flex; justify-content: space-between; align-items: center">
        <DiliButton class="exam-submit-btn" type="primary" @click="handleExamSubmit"> 提交试卷</DiliButton>
      </div>
    </header>

    <Panel ref="exam-panel" class="exam-panel">
      <main ref="exam-content" class="exam-content">
        <template v-for="(problem, i) in exam?.problems || []" :key="problem.problem_id">
          <ExamProblem
            :id="`problem-${i}`"
            v-model:answer="answers[problem.problem_id!]"
            :page="i + 1"
            :exam-problem="problem"
          />
        </template>
      </main>
    </Panel>

    <nav class="problem-navigation">
      <CusPagination
        v-model:current-page="currentPage"
        class="problem-navigation-page"
        :show-arrow="false"
        :page-count="exam?.problems?.length"
        :page-item-style="paginationItemStyle"
      ></CusPagination>
      <div class="problem-navigation-step">
        <DiliButton type="secondary" :disabled="currentPage <= 1" @click="handleLastProblem"> 上一题</DiliButton>
        <DiliButton type="secondary" :disabled="currentPage >= maxPage" @click="handleNextProblem"> 下一题</DiliButton>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.exam-answering-fragment {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  > .exam-header {
    width: 100%;
    max-width: 54rem;
    display: flex;
    gap: 0.5rem;

    > .exam-countdown {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-secondary);
    }
  }
}

.exam-description {
  color: var(--text-secondary);
}

.exam-panel {
  position: relative;
  width: 100%;
  max-width: 54rem;
  margin-inline: 1rem;
  padding: 1rem;
  box-shadow: none;
}

.exam-content {
  position: absolute;
  inset: 0;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.problem-navigation {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 54rem;

  .small & {
    flex-direction: column-reverse;
  }

  &-page {
    max-width: 100%;
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