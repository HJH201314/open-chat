<script setup lang="ts">
import { computed, ref, useTemplateRef, type VNode, watch } from 'vue';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import {
  type ApiCourseSubmitProblemResponse,
  type ApiSchemaExamUserRecordAnswer,
  type ApiSchemaProblem,
  ApiSchemaProblemType,
} from '@/api/gen/data-contracts.ts';
import CusTextarea from '@/components/textarea/CusTextarea.vue';
import CusInput from '@/components/input/CusInput.vue';
import { useElementSize } from '@vueuse/core';
import CusCheckboxGroup from '@/components/checkbox/CusCheckboxGroup.vue';
import CusCheckboxButton from '@/components/checkbox/CusCheckboxButton.vue';
import { getProblemTypeName } from '@/pages/user/tue/exam/utils.ts';
import type { AnswerType } from '@/pages/user/tue/exam/types.ts';
import useMarkdownIt from '@/commands/useMarkdownIt';
import DiliButton from '@/components/button/DiliButton.vue';
import { Redo } from '@icon-park/vue-next';
import CusTooltip from '@/components/tooltip/CusTooltip.vue';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import CusSpin from '@/components/spinning/CusSpin.vue';
import type { CusRadioGroupProps } from '@/components/radio/types.ts';

const props = withDefaults(
  defineProps<{
    page?: number; // 题目序号
    score?: number; // 本题分数
    sortOrder?: number;
    problem?: ApiSchemaProblem; // 问题数据
    disabled?: boolean; // 禁用状态
    choiceStyle?: CusRadioGroupProps['displayStyle']; // 自定义选项展示样式
    choiceType?: CusRadioGroupProps['type']; // 自定义选项展示类型

    userAnswer?: ApiSchemaExamUserRecordAnswer; // 用户回答，传入后会特殊展示用户的选择
    showSubmit?: boolean; // 展示单题提交按钮
    showExplainAfterSubmit?: boolean; // 提交后是否展示答案？
    showAnswer?: boolean; // 展示答案
  }>(),
  {
    choiceStyle: 'icon',
    choiceType: 'highlight',
    showSubmit: false,
    showExplainAfterSubmit: false,
  }
);

// 双向绑定已选中的答案
const answerVM = defineModel<AnswerType>('answer');

const emit = defineEmits<{
  (e: 'answer-change', answer: AnswerType): void;
  (e: 'submitted', result: ApiCourseSubmitProblemResponse): void;
}>();

const problemInfo = computed(() => props.problem || ({} as ApiSchemaProblem));
const { result: description } = useMarkdownIt(() => problemInfo.value.description || '');

const typeName = computed(() => getProblemTypeName(props.problem?.type || ''));

const innerTextAnswer = ref('');
const innerBoolAnswer = ref<boolean>();
const innerOptionAnswer = ref<number[]>([]);

const formattedUserAnswer = computed(() => {
  const ans = props.userAnswer?.answer;
  switch (problemInfo.value.type) {
    case ApiSchemaProblemType.EnumSingleChoice:
    case ApiSchemaProblemType.EnumMultipleChoice: {
      if (typeof ans === 'object' && ans.length) {
        return ans.map((v) => indexToOption(Number(v) - 1)).join(', ');
      }
      break;
    }
    case ApiSchemaProblemType.EnumTrueFalse: {
      if (typeof ans == 'boolean') {
        return ans ? '正确' : '错误';
      }
      break;
    }
    case ApiSchemaProblemType.EnumShortAnswer:
    case ApiSchemaProblemType.EnumFillBlank: {
      if (ans != undefined) {
        return ans;
      }
      break;
    }
  }
  return '';
});

// 问题变化时，清除保存的选项
watch(
  () => problemInfo.value,
  () => {
    innerTextAnswer.value = '';
    innerBoolAnswer.value = undefined;
    innerOptionAnswer.value = [];
  },
  { deep: false }
);

// 观测外部传入 answer 的变化并赋值
watch(
  () => answerVM.value,
  (value) => {
    if (value !== undefined) {
      switch (problemInfo.value.type) {
        case ApiSchemaProblemType.EnumSingleChoice:
        case ApiSchemaProblemType.EnumMultipleChoice:
          innerOptionAnswer.value = value as number[];
          break;
        case ApiSchemaProblemType.EnumTrueFalse:
          innerBoolAnswer.value = value as boolean;
          break;
        case ApiSchemaProblemType.EnumShortAnswer:
        case ApiSchemaProblemType.EnumFillBlank:
          innerTextAnswer.value = value as string;
          break;
      }
    }
  },
  { deep: true }
);

// 观测内部 answer 的变化
watch(
  () => [innerTextAnswer.value, innerBoolAnswer.value, innerOptionAnswer.value],
  (newAns, oldAns) => {
    console.debug(`[ExamProblem:${props.page}] answer change`, newAns);
    for (let i = 0; i < newAns.length; i++) {
      if (newAns[i] !== oldAns[i]) {
        answerVM.value = newAns[i];
        answerVM.value != undefined && emit('answer-change', answerVM.value);
        break;
      }
    }
  }
);

// show answer
watch(
  () => props.showAnswer,
  (newShowAnswer) => {
    if (newShowAnswer) {
      switch (problemInfo.value.type) {
        case ApiSchemaProblemType.EnumSingleChoice:
        case ApiSchemaProblemType.EnumMultipleChoice:
          innerOptionAnswer.value = props.problem?.answer?.answer || ([] as number[]);
          break;
        case ApiSchemaProblemType.EnumTrueFalse:
          innerBoolAnswer.value = props.problem?.answer?.answer as boolean;
          break;
        case ApiSchemaProblemType.EnumShortAnswer:
          innerTextAnswer.value = props.problem?.answer?.answer || ('' as string);
          break;
        case ApiSchemaProblemType.EnumFillBlank:
          innerTextAnswer.value = (props.problem?.answer?.answer || ([] as string[])).join(', ');
          break;
      }
    }
  },
  { immediate: true }
);

function indexToOption(index: number): string {
  if (index < 0) {
    throw new Error('Index must be a non-negative integer');
  }
  let result = '';
  while (index >= 0) {
    const remainder = index % 26;
    result = String.fromCharCode(65 + remainder) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
}

const answerSectionRef = useTemplateRef('answer-section');
const { height: answerSectionHeight } = useElementSize(answerSectionRef);
const maxAnswerSectionHeight = computed(() => `${answerSectionHeight.value - 12}px`);

function handleResetInput() {
  if (innerTextAnswer.value != '') {
    innerTextAnswer.value = '';
    answerVM.value = '';
  } else if (innerOptionAnswer.value.length > 0) {
    innerOptionAnswer.value = [];
    answerVM.value = [];
  } else if (innerBoolAnswer.value != undefined) {
    innerBoolAnswer.value = undefined;
    answerVM.value = undefined;
  }
}

const submitLoading = ref(false);

// 内部单题提交
async function handleSubmit() {
  try {
    if (!problemInfo.value.id) {
      ToastManager.warning('信息缺失，提交失败');
      return;
    }
    submitLoading.value = true;
    const res = await genApi.Tue.examSingleProblemSubmitPost({
      answers: [
        {
          answer: answerVM.value,
          problem_id: problemInfo.value.id,
        },
      ],
      time_spent: 0,
    });
    if (res.data.data) {
      emit('submitted', res.data.data);
    }
  } finally {
    submitLoading.value = false;
  }
}

defineSlots<{
  'header-score': () => VNode;
}>();
</script>

<template>
  <div class="exam-problem" :class="{ disabled: disabled || showAnswer }">
    <header class="problem-header">
      <span class="problem-score">
        {{ page != undefined ? `${page}. ` : '' }}{{ typeName }}
        <span v-if="score !== undefined"
          >&nbsp;&nbsp;&nbsp;<span v-if="userAnswer?.score != undefined" style="color: var(--color-primary)"
            >{{ userAnswer.score! / 100 }}&nbsp;/&nbsp;</span
          >{{ (score || 0) / 100 }} 分
        </span>
        <slot name="header-score" />
      </span>
      <section v-if="showSubmit" class="problem-submit">
        <CusTooltip v-if="!showAnswer" text="重置输入" position="top">
          <DiliButton type="normal" @click="handleResetInput">
            <Redo />
          </DiliButton>
        </CusTooltip>
        <DiliButton
          v-if="!showAnswer"
          :disabled="
            (innerTextAnswer === '' && innerBoolAnswer == undefined && !innerOptionAnswer.length) || submitLoading
          "
          type="primary"
          text="提交"
          @click="handleSubmit"
        >
          <CusSpin v-if="submitLoading" :show="true" />
        </DiliButton>
        <div v-else class="problem-score">已完成作答</div>
      </section>
    </header>

    <section class="problem-content" v-html="description" />

    <section v-if="showAnswer" class="problem-explanation">
      <span v-if="userAnswer" class="problem-explanation-title">我的回答：</span>{{ formattedUserAnswer }}
    </section>

    <section v-if="showAnswer" class="problem-explanation">
      <span class="problem-explanation-title">标准答案：</span>
    </section>

    <section ref="answer-section" class="problem-answer-section">
      <template v-if="problemInfo.type === ApiSchemaProblemType.EnumShortAnswer">
        <CusTextarea
          v-model="innerTextAnswer"
          :textarea-attr="{ placeholder: '请在此输入你的答案...' }"
          class="problem-answer-section-textarea"
        />
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumFillBlank">
        <CusInput v-model="innerTextAnswer" placeholder="输入你的答案..." />
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumSingleChoice">
        <CusRadioGroup
          :model-value="innerOptionAnswer[0]"
          class="problem-answer-section-select"
          direction="column"
          :type="choiceType"
          :display-style="choiceStyle"
          background-mode="transparent"
          @change="(val) => (innerOptionAnswer = [val])"
        >
          <CusRadioButton
            v-for="(option, i) in problemInfo.options"
            :key="option.id"
            class="problem-answer-section-select-item"
            :value="option.id"
            :label="`${indexToOption(i)}. ${option.content}`"
          >
            {{ option.content }}
          </CusRadioButton>
        </CusRadioGroup>
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumTrueFalse">
        <CusRadioGroup
          :model-value="String(innerBoolAnswer)"
          class="problem-answer-section-select"
          direction="column"
          :type="choiceType"
          :display-style="choiceStyle"
          background-mode="transparent"
          @change="(val) => (innerBoolAnswer = val === 'true')"
        >
          <CusRadioButton class="problem-answer-section-select-item" value="true" label="A. 正确"> 正确</CusRadioButton>
          <CusRadioButton class="problem-answer-section-select-item" value="false" label="B. 错误">
            错误
          </CusRadioButton>
        </CusRadioGroup>
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumMultipleChoice">
        <CusCheckboxGroup
          :model-value="innerOptionAnswer"
          class="problem-answer-section-select"
          :type="choiceType"
          :display-style="choiceStyle"
          background-mode="transparent"
          @change="(val) => (innerOptionAnswer = [...val])"
        >
          <CusCheckboxButton
            v-for="(option, i) in problemInfo.options"
            :key="option.id"
            class="problem-answer-section-select-item"
            :value="Number(option.id)"
            :label="`${indexToOption(i)}. ${option.content}`"
          >
            {{ option.content }}
          </CusCheckboxButton>
        </CusCheckboxGroup>
      </template>

      <template v-else>
        <div style="color: var(--color-danger)">【暂不支持此题目的作答】</div>
      </template>
    </section>

    <section v-if="showAnswer" class="problem-explanation">
      <span class="problem-explanation-title">解析：</span>{{ problemInfo.explanation }}
    </section>
  </div>
</template>

<style scoped lang="scss">
.exam-problem {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  user-select: none;

  &.disabled {
    pointer-events: none;
  }
}

.problem {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-score {
    color: var(--text-secondary);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  &-submit {
    display: flex;
    gap: 8px;
  }

  &-content {
    line-height: 1.5;
  }

  &-answer-section {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    &-textarea {
      min-height: 5rem;
      max-height: v-bind(maxAnswerSectionHeight);

      .disabled & {
        min-height: fit-content;
      }
    }

    &-select {
      background: transparent;
      width: 100%;

      &-item {
        font-size: 1rem;
        width: 100%;
      }
    }
  }

  &-explanation {
    color: var(--color-black);

    &-title {
      color: var(--text-secondary);
    }
  }
}

.submit-btn {
  align-self: flex-end;
  margin-top: 1rem;
}
</style>