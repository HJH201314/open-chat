<script setup lang="ts">
import { type ApiSchemaProblem, type ApiSchemaProblemOption, ApiSchemaProblemType } from '@/api/gen/data-contracts.ts';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';
import type { SelectProps, TableProps } from 'tdesign-vue-next';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { CloseIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import DiliButton from '@/components/button/DiliButton.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';

type T = ApiSchemaProblem;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}问题`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(ID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');
const formData: T & {
  [key: string]: any;
} = reactive({
  type: ApiSchemaProblemType.EnumSingleChoice,
  description: '',
  explanation: '',
  difficulty: 3,
  subject: '',
});

const problemTypeOptions: SelectProps['options'] = [
  {
    label: '单选题',
    value: ApiSchemaProblemType.EnumSingleChoice,
  },
  {
    label: '多选题',
    value: ApiSchemaProblemType.EnumMultipleChoice,
  },
  {
    label: '判断题',
    value: ApiSchemaProblemType.EnumTrueFalse,
  },
  {
    label: '填空题',
    value: ApiSchemaProblemType.EnumFillBlank,
  },
  {
    label: '简答题',
    value: ApiSchemaProblemType.EnumShortAnswer,
  },
];

const optionTableColumns: PrimaryTableCol<ApiSchemaProblemOption>[] = [
  {
    title: '选项',
    align: 'center',
    width: '4rem',
    colKey: 'id',
  },
  {
    title: '描述',
    align: 'center',
    ellipsis: true,
    minWidth: '20rem',
    colKey: 'content',
  },
  {
    title: '是否正确',
    align: 'center',
    width: '6rem',
    colKey: 'correct',
  },
  {
    title: '操作',
    align: 'center',
    width: '4rem',
    colKey: 'operation',
  },
];
const problemOptions = ref<ApiSchemaProblemOption[]>([]);
const problemBoolAnswer = ref<boolean | undefined>(undefined);
const problemTextAnswer = ref('');
const problemKeywordsAnswer = ref<string[]>([]);
const handleOptionDragSort: TableProps['onDragSort'] = (params) => {
  problemOptions.value = params.newData.map((item, index) => {
    return {
      ...item,
      id: index + 1,
    };
  });
};
// 限制单选题的正确选项数目
const handleOptionCorrectChange = (id: number, correct: boolean) => {
  if (correct && formData.type == ApiSchemaProblemType.EnumSingleChoice) {
    problemOptions.value.forEach((item) => {
      if (item.id != id) item.correct = false;
    });
  }
};
const handleDeleteOption = (row: ApiSchemaProblemOption) => {
  const index = problemOptions.value.findIndex((item) => item.id == row.id);
  if (index != -1) {
    problemOptions.value.splice(index, 1);
  }
};

watch(
  () => formData.type,
  (newType) => {
    if (newType == ApiSchemaProblemType.EnumSingleChoice) {
      problemOptions.value.forEach((item) => {
        item.correct = false;
      });
    }
  }
);

const initFields = (data: T) => {
  formData.type = data.type || ApiSchemaProblemType.EnumSingleChoice; // 默认单选
  formData.description = data.description || '';
  formData.explanation = data.explanation || '';
  formData.difficulty = data.difficulty || 3;
  formData.subject = data.subject || '';
  switch (data.type) {
    case ApiSchemaProblemType.EnumSingleChoice:
    case ApiSchemaProblemType.EnumMultipleChoice:
      problemOptions.value = JSON.parse(JSON.stringify(data.options)) || [];
      break;
    case ApiSchemaProblemType.EnumTrueFalse:
      problemBoolAnswer.value = data.answer?.answer as boolean;
      break;
    case ApiSchemaProblemType.EnumFillBlank:
      problemKeywordsAnswer.value = JSON.parse(JSON.stringify(data.answer?.answer || [])) as string[];
      break;
    case ApiSchemaProblemType.EnumShortAnswer:
      problemTextAnswer.value = data.answer?.answer as string;
      break;
  }
};

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      initFields(newData);
    }
  },
  { immediate: true }
);

const handleReset = () => {
  props.data && initFields(props.data);
};

const checkAnswerData = () => {
  switch (formData.type) {
    case ApiSchemaProblemType.EnumSingleChoice:
      if (problemOptions.value.filter((item) => item.content == '').length > 0) {
        ToastManager.danger('选项描述不能为空');
        return false;
      }
      if (problemOptions.value.filter((item) => item.correct).length != 1) {
        ToastManager.danger('单选题不能不选或多选');
        return false;
      }
      break;
    case ApiSchemaProblemType.EnumMultipleChoice:
      if (problemOptions.value.filter((item) => item.content == '').length > 0) {
        ToastManager.danger('选项描述不能为空');
        return false;
      }
      if (problemOptions.value.filter((item) => item.correct).length <= 1) {
        ToastManager.danger('多选题不能不选或单选');
        return false;
      }
      break;
    case ApiSchemaProblemType.EnumTrueFalse:
      if (problemBoolAnswer.value == undefined) {
        ToastManager.danger('判断题不能不判断');
        return false;
      }
      break;
    case ApiSchemaProblemType.EnumFillBlank:
      if (problemKeywordsAnswer.value.filter((item) => item == '').length > 0) {
        ToastManager.danger('关键词不能为空');
        return false;
      }
      if (problemKeywordsAnswer.value.length == 0) {
        ToastManager.danger('填空题不能不填');
        return false;
      }
      break;
    case ApiSchemaProblemType.EnumShortAnswer:
      if (problemTextAnswer.value.length == 0) {
        ToastManager.danger('简答题不能不填');
        return false;
      }
      break;
  }
  return true;
};

const getAnswerData = () => {
  switch (formData.type) {
    case ApiSchemaProblemType.EnumSingleChoice:
    case ApiSchemaProblemType.EnumMultipleChoice:
      return problemOptions.value.filter((item) => item.correct).map((item) => item.id);
    case ApiSchemaProblemType.EnumTrueFalse:
      return problemBoolAnswer.value;
    case ApiSchemaProblemType.EnumFillBlank:
      return problemKeywordsAnswer.value;
    case ApiSchemaProblemType.EnumShortAnswer:
      return problemTextAnswer.value;
  }
};

const handleConfirm: CommonDialogProps['confirmHandler'] = async (_, prevent) => {
  const res = (await formRef.value?.validate()) || {};
  if (!checkFormValidateResult(res)) {
    ToastManager.danger('请正确填写数据');
    prevent();
    return;
  }
  if (props.mode == 'create') {
    if (!checkAnswerData()) {
      prevent();
      return;
    }
    await genApi.Tue.problemCreatePost({
      type: formData.type,
      description: formData.description,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      subject: formData.subject,
      options: problemOptions.value,
      answer: {
        answer: getAnswerData(),
      },
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    await genApi.Tue.problemUpdatePost(props.data?.id, {
      data: updateData,
      updates: Object.keys(updateData),
    });
  }
};

const generateLoading = ref(false);
const handleGenerate = async () => {
  if (!formData.description || !formData.type) {
    ToastManager.danger('请填写题目描述和题型');
    return;
  }
  try {
    generateLoading.value = true;
    const res = await genApi.Tue.problemMakePost({
      description: formData.description,
      type: formData.type,
    });
    if (res.data.data) {
      initFields(res.data.data);
    }
  } catch (_) {
    ToastManager.danger('生成失败了，换个描述再试试？');
  } finally {
    generateLoading.value = false;
  }
};
</script>

<template>
  <CommonDialog :title="title" :subtitle="subtitle" :confirm-handler="handleConfirm" :dialog-style="{ width: '789px' }">
    <template #action>
      <DiliButton
        v-if="mode == 'create'"
        type="secondary"
        :text="generateLoading ? '生成中...' : 'AI 辅助'"
        :disabled="generateLoading"
        @click="handleGenerate"
      ></DiliButton>
      <DiliButton v-if="mode == 'edit'" type="secondary" text="重置" @click="handleReset"></DiliButton>
      <LoadingModal v-if="formRef" :visible="generateLoading" tip="奋力生成中" />
    </template>
    <template #default>
      <t-form ref="form" label-align="top" :data="formData" style="margin-bottom: 1rem">
        <t-form-item label="题型" name="type" :rules="[{ required: true }]">
          <t-select v-model="formData.type" placeholder="题型" :options="problemTypeOptions"></t-select>
        </t-form-item>
        <t-form-item label="题目描述" name="description" :rules="[{ required: true }]">
          <t-textarea v-model="formData.description" placeholder="题目描述"></t-textarea>
        </t-form-item>
        <t-form-item
          v-if="
            formData.type == ApiSchemaProblemType.EnumSingleChoice ||
            formData.type == ApiSchemaProblemType.EnumMultipleChoice
          "
          label="选项"
          name="display_name"
          required-mark
        >
          <div style="overflow-x: auto">
            <t-table
              row-key="id"
              :columns="optionTableColumns"
              :data="problemOptions"
              bordered
              max-height="100%"
              :allow-resize-column-width="false"
              table-layout="fixed"
              @drag-sort="handleOptionDragSort"
            >
              <template #content="{ row }">
                <t-input v-model="row.content" />
              </template>
              <template #correct="{ row }">
                <t-switch v-model="row.correct" @change="(e) => handleOptionCorrectChange(row.id, e)" />
              </template>
              <template #footer-summary>
                <t-button
                  theme="primary"
                  @click="
                    problemOptions.push({
                      id: problemOptions.length + 1,
                      content: '',
                      correct: false,
                    })
                  "
                  >添加选项
                </t-button>
              </template>
              <template #operation="{ row }">
                <ActionSet>
                  <t-tooltip :delay="10" content="删除">
                    <t-link theme="danger" hover="color" @click="handleDeleteOption(row)">
                      <delete-icon />
                    </t-link>
                  </t-tooltip>
                </ActionSet>
              </template>
            </t-table>
          </div>
        </t-form-item>
        <t-form-item
          v-if="formData.type == ApiSchemaProblemType.EnumTrueFalse"
          label="正确答案"
          name="problem_bool_answer"
          required-mark
        >
          <t-radio-group v-model="problemBoolAnswer" variant="primary-filled" placeholder="正确答案">
            <t-radio-button :value="true" label="正确" />
            <t-radio-button :value="false" label="错误" />
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="formData.type == ApiSchemaProblemType.EnumShortAnswer"
          label="参考答案"
          name="problem_text_answer"
          required-mark
        >
          <t-textarea v-model="problemTextAnswer" placeholder="参考答案"></t-textarea>
        </t-form-item>
        <t-form-item
          v-if="formData.type == ApiSchemaProblemType.EnumFillBlank"
          label="答案"
          name="problem_keywords_answer"
          required-mark
        >
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
            <div
              v-for="(keyword, index) in problemKeywordsAnswer"
              :key="index"
              style="display: flex; align-items: center; gap: 0.25rem"
            >
              <t-input v-model="problemKeywordsAnswer[index]" />
              <t-button style="flex-shrink: 0" variant="outline" shape="circle">
                <template #icon>
                  <close-icon @click="problemKeywordsAnswer.splice(index, 1)" />
                </template>
              </t-button>
            </div>
            <t-button theme="primary" @click="problemKeywordsAnswer.push('')">添加关键词</t-button>
          </div>
        </t-form-item>
        <hr />
        <t-form-item label="解析" name="explanation" :rules="[{ required: false }]">
          <t-textarea v-model="formData.explanation" placeholder="解析"></t-textarea>
        </t-form-item>
        <t-form-item label="难度等级" name="difficulty" :rules="[{ required: false }]">
          <t-rate v-model="formData.difficulty" placeholder="展示名"></t-rate>
        </t-form-item>
        <!--        <t-form-item label="主题" name="subject" :rules="[{ required: false }]">-->
        <!--          <t-input v-model="formData.subject" placeholder="主题"></t-input>-->
        <!--        </t-form-item>-->
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
