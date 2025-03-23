<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import { type ApiSchemaExamProblem, type ApiSchemaProblem, ApiSchemaProblemType } from '@/api/gen/data-contracts.ts';
import CusTextarea from '@/components/textarea/CusTextarea.vue';
import CusInput from '@/components/input/CusInput.vue';
import { useElementSize } from '@vueuse/core';
import CusCheckboxGroup from '@/components/checkbox/CusCheckboxGroup.vue';
import CusCheckboxButton from '@/components/checkbox/CusCheckboxButton.vue';

const props = defineProps<{
  index?: number;
  examProblem: ApiSchemaExamProblem;
}>();

// 双向绑定已选中的答案
const answerVM = defineModel<string | number[]>('answer');

const emit = defineEmits<{
  (e: 'answer-change', answer: string | number[]): void;
}>();

const problemInfo = computed(() => props.examProblem.problem || ({} as ApiSchemaProblem));

const typeName = computed(() => {
  switch (problemInfo.value.type) {
    case ApiSchemaProblemType.EnumSingleChoice:
      return '单选题';
    case ApiSchemaProblemType.EnumMultipleChoice:
      return '多选题';
    case ApiSchemaProblemType.EnumShortAnswer:
      return '简答题';
    case ApiSchemaProblemType.EnumFillBlank:
      return '填空题';
    case ApiSchemaProblemType.EnumTrueFalse:
      return '判断题';
  }
  return '未知题型';
});

const innerTextAnswer = ref('');
const innerOptionAnswer = ref<number[]>([]);

// 问题变化时，清除保存的选项
watch(() => problemInfo.value, () => {
  innerTextAnswer.value = '';
  innerOptionAnswer.value = [];
}, { deep: false });

// 观测外部传入 answer 的变化并赋值
watch(
  () => answerVM.value,
  (value) => {
    if (value !== undefined) {
      switch (problemInfo.value.type) {
        case ApiSchemaProblemType.EnumSingleChoice:
        case ApiSchemaProblemType.EnumMultipleChoice:
        case ApiSchemaProblemType.EnumTrueFalse:
          innerOptionAnswer.value = value as number[];
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
  () => innerTextAnswer.value,
  (newTextAns, oldTextAns) => {
    console.log('text answer change', newTextAns);
    if (newTextAns !== oldTextAns) {
      answerVM.value = newTextAns;
      emit('answer-change', newTextAns);
    }
  }
);
watch(
  () => innerOptionAnswer.value,
  (newOptionAns, oldOptionAns) => {
    console.log('options answer change', newOptionAns);
    if (newOptionAns !== oldOptionAns) {
      answerVM.value = newOptionAns;
      emit('answer-change', newOptionAns);
    }
  }
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
</script>

<template>
  <div class="exam-problem">
    <div class="problem-header">
      <span class="problem-score">{{ typeName }}&nbsp;&nbsp;&nbsp;{{ (examProblem.score || 0) / 100 }} 分</span>
    </div>

    <div class="problem-content" v-html="problemInfo.description" />

    <div ref="answer-section" class="answer-section">
      <template v-if="problemInfo.type === ApiSchemaProblemType.EnumShortAnswer">
        <CusTextarea
          v-model="innerTextAnswer"
          :textarea-attr="{ placeholder: '请在此输入你的答案...' }"
          class="answer-section-textarea"
        />
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumFillBlank">
        <CusInput v-model="innerTextAnswer" placeholder="输入你的答案..." />
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumSingleChoice">
        <CusRadioGroup
          :model-value="innerOptionAnswer[0]"
          class="answer-section-select"
          direction="column"
          display-style="icon"
          @change="(val) => (innerOptionAnswer = [val])"
        >
          <CusRadioButton
            v-for="(option, i) in problemInfo.options"
            :key="option.id"
            class="answer-section-select-item"
            :value="String(option.id)"
            :label="`${indexToOption(i)}. ${option.content}`"
          >
            {{ option.content }}
          </CusRadioButton>
        </CusRadioGroup>
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumTrueFalse">
        <CusRadioGroup
          :model-value="innerOptionAnswer[0]"
          class="answer-section-select"
          direction="column"
          display-style="icon"
          @change="(val) => (innerOptionAnswer = [val])"
        >
          <CusRadioButton class="answer-section-select-item" value="true" label="A. 正确"> 正确</CusRadioButton>
          <CusRadioButton class="answer-section-select-item" value="false" label="B. 错误"> 错误</CusRadioButton>
        </CusRadioGroup>
      </template>

      <template v-else-if="problemInfo.type === ApiSchemaProblemType.EnumMultipleChoice">
        <CusCheckboxGroup
          :model-value="innerOptionAnswer"
          type="highlight"
          class="answer-section-select"
          display-style="icon"
          @change="(val) => (innerOptionAnswer = [...val])"
        >
          <CusCheckboxButton
            v-for="(option, i) in problemInfo.options"
            :key="option.id"
            class="answer-section-select-item"
            :value="String(option.id)"
            :label="`${indexToOption(i)}. ${option.content}`"
          >
            {{ option.content }}
          </CusCheckboxButton>
        </CusCheckboxGroup>
      </template>

      <template v-else>
        <div style="color: var(--color-danger)">【暂不支持此题目的作答】</div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.exam-problem {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.problem-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.problem-score {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: preserve;
}

.problem-content {
  line-height: 1.6;
}

.answer-section {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
  overflow-y: auto;

  &-textarea {
    min-height: 5rem;
    max-height: v-bind(maxAnswerSectionHeight);
  }

  &-select {
    background: transparent;
    width: 100%;
    padding: 0;

    &-item {
      font-size: 1.1rem;
      width: 100%;
      padding: 1rem;
    }
  }
}

.submit-btn {
  align-self: flex-end;
  margin-top: 1rem;
}
</style>