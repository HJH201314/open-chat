<script setup lang="ts">
import { Left, Right } from '@icon-park/vue-next';
import { computed, type CSSProperties, useId, useTemplateRef, watch } from 'vue';
import DiliButton from '@/components/button/DiliButton.vue';
import { useTheme } from '@/components/theme/useTheme.ts';

type CusPaginationProps = {
  pageCount?: number; // 总页数
  showArrow?: boolean;
  allowNumberWrap?: boolean;
  activeColor?: string;
  pageItemStyle?: Record<number, CSSProperties>; // 分页按钮样式
};

const props = withDefaults(defineProps<CusPaginationProps>(), {
  pageCount: 0,
  showArrow: true,
  allowNumberWrap: false,
  activeColor: () => useTheme().theme.colorPrimary,
  pageItemStyle: () => ({}),
});

const emit = defineEmits<{
  (event: 'update:currentPage', page: number): void;
  (event: 'change', page: number): void;
}>();

const pageNums = computed(() => {
  const pageNums = [];
  for (let i = 0; i < props.pageCount; i++) {
    pageNums.push(i + 1);
  }
  return pageNums;
});

const id = useId();

const currentPageVM = defineModel<number>('currentPage', { default: 1 });
const pageNumbersRef = useTemplateRef('page-numbers');
watch(
  () => currentPageVM.value,
  (newPage, oldPage) => {
    document.getElementById(`cus-pagination-num-${id}-${newPage}`)?.scrollIntoView({
      behavior: 'smooth',
      inline: newPage > oldPage ? 'end' : 'start',
    });
  }
);

function handleChangePage(page: number) {
  currentPageVM.value = page;
  emit('change', page);
}

function handleIncPage() {
  handleChangePage(currentPageVM.value + 1);
}

function handleDecPage() {
  handleChangePage(currentPageVM.value - 1);
}
</script>

<template>
  <div ref="pagination" class="cus-pagination">
    <DiliButton v-if="showArrow" :disabled="currentPageVM - 1 < 1" @click="handleDecPage">
      <Left class="button" size="1rem" />
    </DiliButton>
    <div ref="page-numbers" class="page-numbers">
      <DiliButton
        v-for="i in pageNums"
        :id="`cus-pagination-num-${id}-${i}`"
        :key="i"
        :color="activeColor"
        :button-style="{ 'min-width': `1.875em`, ...pageItemStyle[i] }"
        :type="currentPageVM == i ? 'primary' : 'normal'"
        @click="handleChangePage(i)"
      >
        {{ i }}
      </DiliButton>
    </div>
    <DiliButton v-if="showArrow" :disabled="currentPageVM + 1 > pageNums.length" @click="handleIncPage">
      <Right class="button" size="1rem" />
    </DiliButton>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/extension' as *;

.cus-pagination {
  display: flex;
  gap: 0.25rem;
  line-height: 1;

  > .page-numbers {
    @include no-scrollbar;
    display: flex;
    gap: 0.25rem;
    overflow-x: auto;

    &.warp {
      flex-wrap: wrap;
    }
  }
}
</style>
