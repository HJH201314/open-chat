<!-- 基于Modal的基础对话框组件 -->
<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import type { CommonDialogEmits, CommonDialogExpose, CommonDialogProps } from '@/components/dialog/types.ts';
import CommonModal from '@/components/modal/CommonModal.vue';
import { type Component, computed, h, ref, shallowRef, watch } from 'vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import { Alarm, Caution, Info, Success } from '@icon-park/vue-next';
import { useTheme } from '@/components/theme/useTheme.ts';

const props = withDefaults(defineProps<CommonDialogProps>(), {
  type: 'none',
  visible: false,
  title: '',
  subtitle: '',
  showCancel: true,
  showConfirm: true,
  showHr: true,
});

const emits = defineEmits<CommonDialogEmits>();
const modalVisible = ref(false);

watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) show();
    else close();
  },
  { immediate: true }
);

// 展示模态框
function show() {
  modalVisible.value = true;
}

// 关闭模态框
function close() {
  modalVisible.value = false;
}

function afterClose() {
  emits('after-close');
}

const confirming = shallowRef(false);
let abortController: AbortController = new AbortController();

async function handleConfirm() {
  if (confirming.value) return;
  if (props.confirmHandler) {
    confirming.value = true;
    abortController = new AbortController();
    // 向 handler 传递信号
    const res = props.confirmHandler({
      signal: abortController.signal,
      abort() {
        abortController.abort('handler abort');
        confirming.value = false;
      },
    });
    if (res instanceof Promise) {
      await res;
    }
    confirming.value = false;
  }
  emits('confirm'); // 传递关闭回调函数
  close(); // 不存在回调函数时默认自动关闭
}

function handleCancel() {
  // 取消时中断确认的处理
  if (confirming.value) abortController.abort('cancel');
  emits('cancel'); // 传递关闭回调函数
  close(); // 不存在回调函数时默认自动关闭
}

const { theme } = useTheme();
const iconElement = computed(() => {
  const baseIconProps = {
    size: '1.25rem',
    theme: 'filled',
    style: 'margin-right: 0.5rem',
  } as any;
  switch (props.type) {
    case 'success':
      return h(Success, { fill: theme.colorSuccess, ...baseIconProps });
    case 'warning':
      return h(Caution, { fill: theme.colorWarning, ...baseIconProps });
    case 'danger':
      return h(Alarm, { fill: theme.colorDanger, ...baseIconProps });
    case 'info':
      return h(Info, { fill: theme.colorInfo, ...baseIconProps });
    default:
      return null;
  }
});

defineExpose<CommonDialogExpose>({
  show,
  close,
  confirm: handleConfirm,
});
</script>

<template>
  <CommonModal
    :modal-style="{ ...props.modalStyle }"
    :show-close="false"
    :visible="modalVisible"
    @after-close="afterClose"
  >
    <div class="dialog">
      <header>
        <Component :is="iconElement" v-if="!!iconElement" />
        <div v-if="title" class="dialog-title" :style="titleStyle">{{ title }}</div>
        <div v-if="subtitle" class="dialog-sub-title" :style="subtitleStyle">{{ subtitle }}</div>
      </header>
      <hr v-if="showHr && (title || (subtitle && content))" />
      <main>
        <div class="dialog-content" v-html="content"></div>
        <slot></slot>
      </main>
      <footer>
        <div style="flex: 1">
          <slot name="action"></slot>
        </div>
        <DiliButton
          v-if="showCancel"
          style="margin-left: auto"
          text="取消"
          type="text"
          v-bind="cancelButtonProps"
          @click="handleCancel"
        ></DiliButton>
        <DiliButton v-if="showConfirm" text="确认" type="primary" v-bind="confirmButtonProps" @click="handleConfirm">
          <cus-spin v-if="confirming" :show="true" />
        </DiliButton>
      </footer>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.dialog {
  width: 512px; // 默认宽度
  max-width: calc(100% - 2rem);
  max-height: calc(100% - 2rem);
  background-color: $color-white;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;

  > hr {
    margin-inline: 45%;
    height: 3px;
    border: none;
    border-radius: 3px;
    background-color: rgba(0 0 0 / 5%);
  }

  > header {
    line-height: 1;
    margin: 1rem 1rem 0 1rem;
    display: flex;
    align-items: flex-end;
    row-gap: 0.25rem;
    flex-wrap: wrap;
  }

  > main {
    flex: 1;
    margin-inline: 1rem;
    min-height: 0;
    overflow-y: auto;
  }

  > footer {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    box-shadow: $box-shadow;
  }

  &-title {
    font-weight: bold;
    font-size: 1.25rem;
    margin-right: 1rem;
  }

  &-sub-title {
    position: relative;
    font-weight: normal;
    font-size: 0.75rem;
    margin: {
      right: 1rem;
    }
  }

  &-content {
    white-space: preserve;
  }
}
</style>
