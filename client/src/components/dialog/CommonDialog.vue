<!-- 基于Modal的基础对话框组件 -->
<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import type { CommonDialogEmits, CommonDialogExpose, CommonDialogProps } from '@/components/dialog/CommonDialog';
import type { CommonModalFunc } from '@/components/modal/CommonModal';
import CommonModal from '@/components/modal/CommonModal.vue';
import { ref, shallowRef } from 'vue';
import CusSpin from '@/components/spinning/CusSpin.vue';

const props = withDefaults(defineProps<CommonDialogProps>(), {
  title: '',
  subtitle: '',
  showCancel: true,
  showConfirm: true,
});

const emits = defineEmits<CommonDialogEmits>();

const modalRef = ref<CommonModalFunc>();

function show() {
  modalRef.value?.open();
}

function close() {
  modalRef.value?.close();
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

defineExpose<CommonDialogExpose>({
  show,
  close,
});
</script>

<template>
  <CommonModal
    ref="modalRef"
    :modal-style="{ 'background-color': 'white', ...props.modalStyle }"
    :show-close="false"
    @after-close="afterClose"
  >
    <div class="dialog">
      <header>
        <div v-if="title" class="dialog-title" :style="titleStyle">{{ title }}</div>
        <div v-if="subtitle" class="dialog-sub-title" :style="subtitleStyle">{{ subtitle }}</div>
      </header>
      <hr v-if="title || subtitle && content" />
      <main>
        <div v-html="content"></div>
        <slot></slot>
      </main>
      <hr v-if="showCancel || showConfirm && content" />
      <footer>
        <DiliButton v-if="showCancel" text="取消" type="normal" v-bind="cancelButtonProps" @click="handleCancel"></DiliButton>
        <DiliButton v-if="showConfirm" text="确认" type="primary" v-bind="confirmButtonProps" @click="handleConfirm">
          <cus-spin :show="confirming" />
        </DiliButton>
      </footer>
    </div>
  </CommonModal>
</template>

<style lang="scss" scoped>
.dialog {
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  > header {
  }

  > main {
    padding: 0 0.5rem;
  }

  > footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &-title {
    font-weight: bold;
    font-size: 1.25rem;
    padding-left: 0.5rem;
  }

  &-sub-title {
    font-weight: normal;
    font-size: 0.75rem;
    padding-left: 0.5rem;
  }
}
</style>
