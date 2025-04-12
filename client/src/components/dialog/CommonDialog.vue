<!-- 基于Modal的基础对话框组件 -->
<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import type { CommonDialogEmits, CommonDialogExpose, CommonDialogProps } from '@/components/dialog/types.ts';
import CommonModal from '@/components/modal/CommonModal.vue';
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import { Alarm, Caution, Close, Info, Success } from '@icon-park/vue-next';
import { useTheme } from '@/components/theme/useTheme.ts';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<CommonDialogProps>(), {
  type: 'none',
  title: '',
  subtitle: '',
  showCancel: true,
  showConfirm: true,
  showHr: true,
});

const visible = defineModel<boolean>('visible', { default: false });
const emits = defineEmits<CommonDialogEmits>();
const modalVisible = ref(false);

watch(
  () => visible.value,
  (newVisible) => {
    if (newVisible) show();
    else close();
  },
  { immediate: true }
);

// 展示模态框
function show() {
  modalVisible.value = true;
  if (!visible.value) visible.value = true;
}

// 关闭模态框
function close() {
  modalVisible.value = false;
  if (visible.value) visible.value = false;
}

function afterClose() {
  emits('after-close');
}

const confirming = shallowRef(false);
const canceling = shallowRef(false);
let confirmAbortCtrl: AbortController = new AbortController();
let cancelAbortCtrl: AbortController = new AbortController();

async function handleConfirm() {
  if (confirming.value) return;
  let preventClose = false;
  if (props.confirmHandler) {
    confirming.value = true;
    confirmAbortCtrl = new AbortController();
    // 向 handler 传递信号
    const res = props.confirmHandler(
      {
        signal: confirmAbortCtrl.signal,
        abort() {
          confirmAbortCtrl.abort('handler abort');
          confirming.value = false;
        },
      },
      () => (preventClose = true)
    );
    try {
      if (res instanceof Promise) {
        await res;
      }
    } catch (e) {
      console.error(e);
    } finally {
      confirming.value = false;
    }
  }
  if (preventClose) return;
  emits('confirm'); // 传递关闭回调函数
  close(); // 不存在回调函数时默认自动关闭
}

async function handleCancel() {
  // 取消时中断确认的处理
  if (confirming.value) confirmAbortCtrl.abort('cancel');
  let preventClose = false;
  if (props.cancelHandler) {
    canceling.value = true;
    cancelAbortCtrl = new AbortController();
    // 向 handler 传递信号
    const res = props.cancelHandler(
      {
        signal: cancelAbortCtrl.signal,
        abort() {
          cancelAbortCtrl.abort('handler abort');
          canceling.value = false;
        },
      },
      () => (preventClose = true)
    );
    try {
      if (res instanceof Promise) {
        await res;
      }
    } catch (e) {
      console.error(e);
    } finally {
      canceling.value = false;
    }
  }
  if (preventClose) return;
  emits('cancel'); // 传递关闭回调函数
  close(); // 不存在回调函数时默认自动关闭
}

const { theme } = reactive(storeToRefs(useTheme()));
const iconElement = computed(() => {
  const baseIconProps = {
    size: '1.25rem',
    style: 'margin-right: 0.25rem',
  } as any;
  if (props.icon) return h(props.icon, baseIconProps);
  switch (props.type) {
    case 'success':
      return h(Success, { fill: theme.colorSuccess, theme: 'filled', ...baseIconProps });
    case 'warning':
      return h(Caution, { fill: theme.colorWarning, theme: 'filled', ...baseIconProps });
    case 'danger':
      return h(Alarm, { fill: theme.colorDanger, theme: 'filled', ...baseIconProps });
    case 'info':
      return h(Info, { fill: theme.colorInfo, theme: 'filled', ...baseIconProps });
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
    :modal-style="{ ...modalStyle }"
    :show-close="false"
    :close-on-click-mask="closeOnClickMask || showCancel"
    :visible="modalVisible"
    @after-close="afterClose"
  >
    <div class="dialog" :style="{ ...dialogStyle }">
      <header :style="{ marginRight: showClose ? '3rem' : '1rem' }">
        <Component :is="iconElement" v-if="!!iconElement" />
        <div v-if="title" class="dialog-title" :style="titleStyle">{{ title }}</div>
        <div v-if="subtitle" class="dialog-sub-title" :style="subtitleStyle">{{ subtitle }}</div>
        <DiliButton v-if="showClose" class="header-close" @click="handleCancel">
          <Close size="1rem" />
        </DiliButton>
      </header>
      <hr v-if="showHr && (title || (subtitle && content))" />
      <main>
        <div class="dialog-content" v-html="content"></div>
        <slot></slot>
        <div style="height: 0.5rem"></div>
        <!-- 高度占位 -->
      </main>
      <footer v-if="$slots.action || showCancel || showConfirm">
        <div style="flex: 1">
          <slot name="action"></slot>
        </div>
        <div class="action-buttons" :class="{ reversed: actionReversed }">
          <DiliButton
            v-if="showCancel"
            style="margin-left: auto"
            text="取消"
            type="text"
            v-bind="cancelButtonProps"
            @click="handleCancel"
          >
            <cus-spin v-if="canceling" :show="true" />
          </DiliButton>
          <DiliButton v-if="showConfirm" text="确认" type="primary" v-bind="confirmButtonProps" @click="handleConfirm">
            <cus-spin v-if="confirming" :show="true" />
          </DiliButton>
        </div>
      </footer>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.dialog {
  position: relative;
  width: 512px; // 默认宽度
  max-width: calc(100vw - 2rem);
  max-height: calc(100 * var(--vh) - 2rem);
  color: var(--color-black);
  background-color: var(--color-white);
  border-radius: 0.5rem;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > hr {
    margin-inline: 45%;
    margin-block: 0.5rem;
    height: 3px;
    border: none;
    border-radius: 3px;
    background-color: rgba(0 0 0 / 5%);
  }

  > header {
    line-height: 1;
    margin: 1rem 1rem 0 1rem;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    row-gap: 0.25rem;
    flex-wrap: wrap;

    > .header-close {
      position: absolute;
      right: 0.875rem;
      top: 0.875rem;
    }
  }

  > main {
    flex: 1;
    padding: 0 1rem;
    min-height: 0;
    overflow-y: auto;
  }

  > footer {
    width: 100%;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    box-shadow: $box-shadow;

    > .action-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;

      &.reversed {
        flex-direction: row-reverse;
      }
    }
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
