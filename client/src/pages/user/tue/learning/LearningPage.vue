<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import type { ApiSchemaExamUserRecord, ApiSchemaProblemUserRecord } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import ExamEntry from '@/pages/user/tue/learning/components/ExamEntry.vue';
import useGlobal from '@/commands/useGlobal.ts';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import ExamAnswerPage from '@/pages/user/tue/exam/answer/ExamAnswerPage.vue';
import CusInfiniteScroll from '@/components/infinite-scroll/CusInfiniteScroll.vue';
import type { InfiniteScrollState } from '@/components/infinite-scroll/types.ts';
import CusInput from '@/components/input/CusInput.vue';
import { refDebounced, useEventBus } from '@vueuse/core';
import ProblemEntry from '@/pages/user/tue/learning/components/ProblemEntry.vue';
import ExamProblem from '@/pages/user/tue/exam/ExamProblem.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import { Close, MenuUnfold } from '@icon-park/vue-next';
import IconButton from '@/components/IconButton.vue';
import { toggleSidebarExpandKey } from '@/constants/eventBusKeys.ts';
import { nextFrame } from '@/utils/element.ts';

// 小屏展开侧边栏
const toggleSideBarExpandBus = useEventBus(toggleSidebarExpandKey);
function handleSidebarUnfold() {
  toggleSideBarExpandBus.emit(true);
}

const currentType = ref<'exam' | 'problem'>('exam');
const searchInput = ref<string>('');
const searchInputDebounced = refDebounced<string>(searchInput, 500);

// ========== 考试数据部分 ==========
const examData = reactive({
  list: [] as ApiSchemaExamUserRecord[],
  currentPage: 1,
  total: 0,
  totalPage: 1,
  pageSize: 25,
  loading: false,
  selectedExamId: 0,
  selectedRecordId: 0,
});
const viewingExam = computed(() => currentType.value == 'exam' && examData.selectedRecordId);

// 获取考试记录
const getExamUserRecords = async (_page?: number, _size?: number, append: boolean = true) => {
  const page = _page || examData.currentPage;
  const size = _size || examData.pageSize;
  try {
    const { data } = await genApi.Tue.examRecordListPost(
      {
        search_data: { everything: searchInput.value },
      },
      {
        page_num: page,
        page_size: size,
        sort_expr: 'id DESC',
      }
    );
    if (data.data?.total != undefined && data.data?.list != undefined) {
      if (append) {
        examData.list.push(...data.data.list);
      } else {
        examData.list = data.data.list || [];
      }
      examData.total = data.data.total;
      examData.totalPage = Math.ceil(data.data.total / size);
      return data.data.list.length;
    }
  } catch (_) {
    //
  }
  return 0;
};

const infiniteScrollRef = useTemplateRef('infinite-scroll');

watch(
  () => searchInputDebounced.value,
  async (newSearch) => {
    examData.currentPage = 1;
    if (infiniteScrollRef.value) {
      infiniteScrollRef.value.resume();
      await onLoadMoreExam(infiniteScrollRef.value);
    }
  }
);

const onLoadMoreExam = async (state: InfiniteScrollState) => {
  if (examData.loading) return;

  examData.loading = true;
  const count = await getExamUserRecords(examData.currentPage, examData.pageSize, examData.currentPage > 1);
  examData.currentPage += 1;
  if (count == 0) {
    state.pause();
  }
  examData.loading = false;
};

const onExamDetail = (item: ApiSchemaExamUserRecord) => {
  const isViewing = viewingExam.value;
  examData.selectedRecordId = item.id || 0;
  examData.selectedExamId = item.exam_id || 0;
  nextFrame(() => {
    !isViewing && document.querySelector(`#exam-entry-${item.id}`)?.scrollIntoView();
  });
};

const onExamBack = () => {
  examData.selectedRecordId = 0;
  examData.selectedExamId = 0;
};

// ========== 题目数据部分 ==========
const problemData = reactive({
  list: [] as ApiSchemaProblemUserRecord[],
  currentPage: 1,
  total: 0,
  totalPage: 1,
  pageSize: 25,
  loading: false,
  selectedRecordId: 0,
  selectedProblem: {} as ApiSchemaProblemUserRecord,
});
const viewingProblem = computed(() => currentType.value == 'problem' && problemData.selectedRecordId);

// 获取题目记录
const getProblemUserRecords = async (_page?: number, _size?: number, append: boolean = true) => {
  const page = _page || problemData.currentPage;
  const size = _size || problemData.pageSize;
  try {
    const { data } = await genApi.Tue.examSingleProblemRecordListPost(
      {
        search_data: { everything: searchInput.value },
      },
      {
        page_num: page,
        page_size: size,
        sort_expr: 'id DESC',
      }
    );
    if (data.data?.total != undefined && data.data?.list != undefined) {
      if (append) {
        problemData.list.push(...data.data.list);
      } else {
        problemData.list = data.data.list || [];
      }
      problemData.total = data.data.total;
      problemData.totalPage = Math.ceil(data.data.total / size);
      return data.data.list.length;
    }
  } catch (_) {
    //
  }
  return 0;
};

const problemInfiniteScrollRef = useTemplateRef('problem-infinite-scroll');

watch(
  () => searchInputDebounced.value,
  async (newSearch) => {
    problemData.currentPage = 1;
    if (problemInfiniteScrollRef.value) {
      problemInfiniteScrollRef.value.resume();
      await onLoadMoreProblem(problemInfiniteScrollRef.value);
    }
  }
);

const onLoadMoreProblem = async (state: InfiniteScrollState) => {
  if (problemData.loading) return;

  problemData.loading = true;
  const count = await getProblemUserRecords(problemData.currentPage, problemData.pageSize, problemData.currentPage > 1);
  problemData.currentPage += 1;
  if (count == 0) {
    state.pause();
  }
  problemData.loading = false;
};

const onProblemDetail = (item: ApiSchemaExamUserRecord) => {
  const isViewing = viewingProblem.value;
  problemData.selectedRecordId = item.id || 0;
  problemData.selectedProblem = item;
  nextFrame(() => {
    !isViewing && document.querySelector(`#problem-entry-${item.id}`)?.scrollIntoView();
  });
};

const onProblemBack = () => {
  problemData.selectedRecordId = 0;
  problemData.selectedProblem = {};
};

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div class="learning-page" :class="{ mobile: isSmallScreen }">
    <LoadingModal :visible="examData.loading" />
    <div class="list-area">
      <div class="header-container" :class="{ viewing: viewingExam || viewingProblem || isSmallScreen }">
        <IconButton
          v-if="isSmallScreen"
          type="secondary"
          color="var(--color-grey-500)"
          no-normal-background
          @click="handleSidebarUnfold"
        >
          <MenuUnfold size="1.2em" />
        </IconButton>
        <CusRadioGroup v-model="currentType" class="toggle-exam-problem" name="toggle-exam-problem">
          <CusRadioButton class="toggle-item" label="测验" value="exam"></CusRadioButton>
          <CusRadioButton class="toggle-item" label="题目" value="problem"></CusRadioButton>
        </CusRadioGroup>
        <div class="header-right">
          <CusInput
            v-model="searchInput"
            class="header-input"
            :placeholder="`搜索${currentType == 'exam' ? '测验' : '答题'}记录...`"
          />
          <!--          <DiliButton type="tertiary" @click="getExamUserRecords()">-->
          <!--            <Refresh></Refresh>-->
          <!--          </DiliButton>-->
        </div>
      </div>
      <div v-if="currentType == 'exam'" class="exam-container" :class="{ viewing: viewingExam || isSmallScreen }">
        <ExamEntry
          v-for="item in examData.list"
          :id="`exam-entry-${item.id}`"
          :key="item.id"
          class="exam-item"
          :class="{ active: examData.selectedRecordId == item.id }"
          :data="item"
          @detail="onExamDetail(item)"
        />
        <CusInfiniteScroll ref="infinite-scroll" @load="onLoadMoreExam" />
      </div>
      <div
        v-if="currentType == 'problem'"
        class="problem-container"
        :class="{ viewing: viewingProblem || isSmallScreen }"
      >
        <ProblemEntry
          v-for="item in problemData.list"
          :id="`problem-entry-${item.id}`"
          :key="item.id"
          class="problem-item"
          :class="{ active: problemData.selectedRecordId == item.id }"
          :data="item"
          @detail="onProblemDetail(item)"
        />
        <CusInfiniteScroll ref="problem-infinite-scroll" @load="onLoadMoreProblem" />
      </div>
    </div>
    <hr v-if="examData.selectedRecordId" class="split" />
    <div v-if="viewingExam" class="view-area-exam">
      <ExamAnswerPage
        :exam-id="String(examData.selectedExamId)"
        :record-id="examData.selectedRecordId"
        :show-back="false"
        no-padding
      />
      <DiliButton style="position: absolute; left: 0.5rem; top: 0.5rem" type="tertiary" @click="onExamBack">
        <Close />
      </DiliButton>
    </div>
    <div v-else-if="viewingProblem" class="view-area-problem">
      <DiliButton style="position: absolute; left: 0.5rem; top: 0.5rem" type="tertiary" @click="onProblemBack">
        <Close />
      </DiliButton>
      <ExamProblem
        style="margin-inline: 1rem"
        disabled
        :problem="problemData.selectedProblem.problem"
        :user-answer="problemData.selectedProblem.answer"
        :show-answer="true"
        :answer="problemData.selectedProblem.problem?.answer?.answer"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.learning-page {
  height: 100%;
  display: flex;

  .split {
    flex-shrink: 0;
    width: 2px;
    height: 100%;
    background-color: var(--color-grey-100);
    opacity: 0.233;
  }
}

.list-area {
  height: 100%;
  flex: auto;
  display: flex;
  flex-direction: column;

  .header-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem;

    .toggle-exam-problem {
      min-width: 15rem;

      .mobile & {
        flex: auto;
      }

      .toggle-item {
        flex: auto;
        justify-content: center;
      }
    }

    .header-right {
      flex: auto;

      .header-input {
        width: 100%;
      }
    }
  }
}

.exam-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 0.5rem;
  padding-inline: 0.5rem;
  padding-bottom: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: auto;

  .mobile & {
    grid-template-columns: 1fr;
    margin-inline: 0.5rem;
  }

  > .exam-item {
  }

  &.viewing {
    gap: 0;
    padding: 0;

    > :deep(.exam-entry) {
      border-radius: 0;
      background: unset !important;

      &:not(.active) .header-title {
        color: var(--text-primary);
      }

      &:not(.active):hover {
        background: var(--color-grey-100) !important;
      }

      &.active {
        background: var(--color-primary-50) !important;
      }
    }
  }
}

.problem-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  gap: 0.5rem;
  padding-inline: 0.5rem;
  padding-bottom: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: auto;

  .mobile & {
    grid-template-columns: 1fr;
    margin-inline: 0.5rem;
  }

  &.viewing {
    gap: 0;
    padding: 0;

    > :deep(.problem-entry) {
      border-radius: 0;
      background: unset !important;

      &:not(.active) .header-title {
        color: var(--text-primary);
      }

      &:not(.active):hover {
        background: var(--color-grey-100) !important;
      }

      &.active {
        background: var(--color-primary-50) !important;
      }
    }
  }
}

.view-area-exam {
  position: relative;
  min-width: calc(100% - 15rem);
  height: 100%;
  background-color: var(--color-white);

  .mobile & {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
}

.view-area-problem {
  position: relative;
  min-width: calc(100% - 30rem);
  height: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white);

  .mobile & {
    padding: 0;
    position: absolute;
    inset: 0;
    z-index: 1;
  }
}
</style>

<style lang="scss">
@use '@/assets/variables' as *;

.slide-in-right-full {
  &-enter-active {
    animation: slide-in-right-full-anim 0.25s $ease-out-circ;
  }

  &-leave-active {
    animation: slide-in-right-full-anim 0.25s $ease-in-out-circ reverse;
  }

  @keyframes slide-in-right-full-anim {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }
}
</style>
