<script setup lang="ts">
import ExamPage from '@/pages/user/tue/exam/ExamPage.vue';
import CommonModal from '@/components/modal/CommonModal.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { Close, FullScreenTwo, OffScreenTwo } from '@icon-park/vue-next';
import type { MessageExtensionBaseProps } from '@/pages/user/chat/message/components/extension/types.ts';
import { type ApiSchemaExam, type ApiSchemaExamUserRecord, ApiSchemaScoreStatus } from '@/api/gen/data-contracts.ts';
import { updateSessionMessageExtra } from '@/store/data/useSession.ts';
import ExamAnswerPage from '@/pages/user/tue/exam/answer/ExamAnswerPage.vue';
import { useStepper } from '@vueuse/core';
import genApi from '@/api/gen-api.ts';
import { useUserStore } from '@/store/useUserStore.ts';

const props = defineProps<
  {
    examId: string | number;
  } & MessageExtensionBaseProps
>();

const userStore = useUserStore();
const isOwner = computed(() => props.sessionInfo.userId == userStore.userId);

const examInfo = computed(() => (props.msgInfo.extra?.['exam'] || {}) as ApiSchemaExam);
const examRecordId = computed(() => (props.msgInfo.extra?.['exam-record-id'] || 0) as number);
const examRecords = computed(() => (props.msgInfo.extra?.['exam-records'] || []) as ApiSchemaExam[]);

watchEffect(async () => {
  // 作答完成，但评分记录不是最新的时候，根据记录 ID 获取最新的记录
  if (examRecordId.value && (examRecords.value.length == 0 || examRecords.value[0].id != examRecordId.value)) {
    const { data } = await genApi.Tue.examRecordsGet(examRecordId.value);
    if (data.data?.status == ApiSchemaScoreStatus.EnumStatusCompleted) {
      await updateSessionMessageExtra(props.msgInfo.sessionId, props.msgInfo.id, {
        'exam-record-id': examRecordId.value,
        'exam-records': [data.data],
      });
    }
  }
});

const { current: currentStep, goTo: goToStep } = useStepper(['exam', 'detail'], 'exam');
const visible = ref(false);
const fullscreen = ref(false);

const modalRef = useTemplateRef<InstanceType<typeof CommonModal>>('modal');
const examPageRef = useTemplateRef<InstanceType<typeof ExamPage>>('exam-page');

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};

// 模态框关闭时清除状态
watch(
  () => visible.value,
  (newVisible) => {
    if (!newVisible) {
      fullscreen.value = false;
    }
  }
);

// 处理 modal 内部导致的关闭（点击遮罩）
const onModalInnerClose = (prevent: () => void) => {
  prevent();
  if (visible.value && currentStep.value == 'exam') {
    examPageRef.value?.back();
  }
};
const onModalAfterClose = () => {
  visible.value = false;
};

// 打开模态框并进入结果页面
const onViewDetail = () => {
  goToStep('detail');
  visible.value = true;
};

// 打开模态框并进入考试页面
const onStartExam = () => {
  goToStep('exam');
  visible.value = true;
};

const onExamSubmitted = async (recordId: number) => {
  if (recordId && isOwner.value) {
    await updateSessionMessageExtra(props.msgInfo.sessionId, props.msgInfo.id, {
      'exam-record-id': recordId,
    });
  }
};

const onExamRated = async (record: ApiSchemaExamUserRecord) => {
  if (record.id && isOwner.value) {
    await updateSessionMessageExtra(props.msgInfo.sessionId, props.msgInfo.id, {
      'exam-record-id': record.id,
      'exam-records': [record],
    });
  }
};
</script>

<template>
  <div class="dialog-exam">
    <div class="dialog-exam-title">
      <div style="color: var(--text-primary)">主题：{{ examInfo.name }}</div>
      <div style="color: var(--text-secondary)">描述：{{ examInfo.description }}</div>
      <div v-if="examRecords.length" style="color: var(--color-primary); white-space: pre-line">
        已作答，得分：
        <span style="color: var(--color-primary-darker); font-weight: bold">{{
          (examRecords[0].total_score ?? 0) / 100
        }}</span>
        / {{ (examInfo.total_score ?? 0) / 100 }}
      </div>
    </div>
    <div class="dialog-exam-desc">
      <DiliButton
        v-if="examRecords.length"
        style="flex: 2 0 auto"
        :button-style="{ width: '100%' }"
        type="secondary"
        text="查看作答结果"
        @click="onViewDetail"
      />
      <DiliButton
        style="flex: 1 0 auto"
        :button-style="{ width: '100%' }"
        type="secondary"
        :text="examRecords.length ? '再次作答' : examRecordId ? '评分中' : '点我开测！'"
        @click="onStartExam"
      />
    </div>
    <CommonModal
      ref="modal"
      v-model:visible="visible"
      close-on-click-mask
      :show-close="false"
      @close="onModalInnerClose"
      @after-close="onModalAfterClose"
    >
      <ExamPage
        v-if="currentStep == 'exam' && visible"
        ref="exam-page"
        class="dialog-exam-page"
        :class="{ full: fullscreen }"
        :exam-id="String(examId)"
        @back="() => modalRef?.close()"
        @go-to-detail="() => goToStep('detail')"
        @submitted="(recordId) => onExamSubmitted(recordId)"
        @rated="(record) => onExamRated(record)"
      >
        <template #back>
          <Close />
        </template>
      </ExamPage>
      <ExamAnswerPage
        v-if="currentStep == 'detail' && visible"
        ref="detail-page"
        class="dialog-exam-page-detail"
        :class="{ full: fullscreen }"
        :exam-id="String(examId)"
        :record-id="examRecordId"
        @back="() => modalRef?.close()"
      >
        <template #back>
          <Close />
        </template>
      </ExamAnswerPage>
      <DiliButton
        ref="expand-icon"
        class="dialog-exam-action"
        :class="{ full: fullscreen }"
        type="secondary"
        @click="toggleFullscreen"
      >
        <FullScreenTwo v-if="!fullscreen" />
        <OffScreenTwo v-else />
      </DiliButton>
    </CommonModal>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.dialog-exam {
  &-title {
    display: flex;
    flex-direction: column;
  }

  &-desc {
    margin-top: 0.5em;
    display: flex;
    gap: 0.5em;
  }

  &-page,
  &-page-detail {
    width: calc(100vw - 2rem);
    height: calc(100 * var(--vh) - 2rem);
    border-radius: $border-radius;
    background-color: var(--color-white);
    transition: all 0.2s $ease-out-circ;

    &.full {
      width: 100vw;
      height: calc(100 * var(--vh));
      border-radius: 0;
    }
  }

  &-action {
    position: absolute;
    right: var(--padding-normal);
    top: var(--padding-normal);
  }
}
</style>
