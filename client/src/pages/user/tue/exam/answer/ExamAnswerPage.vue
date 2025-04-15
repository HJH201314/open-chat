<script setup lang="ts">
import { onMounted, ref } from 'vue';
import genApi from '@/api/gen-api.ts';
import { type ApiSchemaExam, type ApiSchemaExamUserRecord } from '@/api/gen/data-contracts.ts';
import useGlobal from '@/commands/useGlobal.ts';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import { DialogManager } from '@/components/dialog';
import { useRoute, useRouter } from 'vue-router';
import { Back } from '@icon-park/vue-next';
import ExamAnswerView from '@/pages/user/tue/exam/answer/ExamAnswerView.vue';
import DiliButton from '@/components/button/DiliButton.vue';

const props = withDefaults(
  defineProps<{
    examId: string;
    recordId?: number; // 用户回答 ID
  }>(),
  {
    recordId: 0,
  }
);

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const exam = ref<ApiSchemaExam>();
const record = ref<ApiSchemaExamUserRecord>();

const router = useRouter();

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
    console.error(e);
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

// 加载用户作答记录
const loadUserRecord = async () => {
  if (!props.recordId) return;

  const res = await genApi.Tue.examRecordGet(props.recordId);
  if (res.status == 200) {
    record.value = res.data.data!;
  }
};
// 处理用户作答记录加载
const handleLoadUserRecord = async () => {
  try {
    await loadUserRecord();
  } catch (e) {
    console.error(e);
  } finally {
  }
};

const route = useRoute();
onMounted(async () => {
  await Promise.all([await handleLoadExam(), await handleLoadUserRecord()]);
});

const handleBack = () => {
  if (typeof route.name == 'string' && route.name.startsWith('ExamAnswerPage')) {
    router.back();
  } else {
    emit('back');
  }
};

const { isSmallScreen } = useGlobal();

defineSlots<{
  back: () => any;
}>();

defineExpose({
  back: handleBack,
});
</script>

<template>
  <div class="exam-page" :class="{ small: isSmallScreen }">
    <LoadingModal :visible="loadingExam" />
    <DiliButton ref="button-back" class="exam-page-back" type="secondary" @click="handleBack">
      <slot v-if="$slots.back" name="back" />
      <Back v-else />
    </DiliButton>
    <ExamAnswerView
      ref="fragment-answering"
      class="exam-page-fragment-full"
      :exam="exam"
      :record="record"
      :single-problem="true"
    />
  </div>
</template>

<style scoped lang="scss">
.exam-page {
  --padding: var(--padding-normal);

  position: relative;
  height: 100%;
  margin: 0 auto;
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &-back {
    position: absolute;
    left: var(--padding);
    top: var(--padding);
    z-index: 1;
  }

  &-fragment-full {
    width: 100%;
    height: 100%;
  }
}
</style>
