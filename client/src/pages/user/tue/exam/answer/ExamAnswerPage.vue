<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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
    noPadding?: boolean;
    showBack?: boolean;
  }>(),
  {
    recordId: 0,
    noPadding: false,
    showBack: true,
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
  watch(
    () => [props.examId, props.recordId],
    async () => {
      await Promise.all([await handleLoadExam(), await handleLoadUserRecord()]);
    },
    { immediate: true }
  );
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
  <div
    class="exam-page"
    :class="{ small: isSmallScreen }"
    :style="{ '--padding': noPadding ? '0' : 'var(--padding-normal)' }"
  >
    <LoadingModal :visible="loadingExam" />
    <DiliButton v-if="showBack" ref="button-back" class="exam-page-back" type="tertiary" @click="handleBack">
      <slot v-if="$slots.back" name="back" />
      <Back v-else />
    </DiliButton>
    <ExamAnswerView
      ref="fragment-answering"
      class="exam-page-answer-full"
      :exam="exam"
      :record="record"
      :single-problem="true"
    >
      <template #header>
        <div v-if="exam" class="exam-page-action">
          <div class="exam-page-title">
            <div>{{ exam?.name || '' }}</div>
            <div class="exam-page-title-sub">{{ exam?.description || '' }}</div>
          </div>
          <div></div>
        </div>
      </template>
    </ExamAnswerView>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/extension' as *;

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

  &-action {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-primary);
    line-height: 1.2;
    font-size: 1.1rem;

    &-sub {
      @include line-clamp-1;
      color: var(--color-trans-1000);
      font-size: 0.9rem;
    }
  }

  &-record {
    color: var(--color-trans-1500);
  }

  &-answer-full {
    width: 100%;
    height: 100%;
  }
}
</style>
