<!-- 基于Modal的基础对话框组件 -->
<script setup lang="ts">
import CommonModal from '@/components/modal/CommonModal.vue';
import { ref } from 'vue';
import type { CommonModalFunc } from '@/components/modal/CommonModal';
import DiliButton from '@/components/button/DiliButton.vue';
import type { CommonDialogEmits, CommonDialogExpose, CommonDialogProps } from '@/components/dialog/CommonDialog';
import { DialogManager } from '@/components/dialog';

const props = withDefaults(defineProps<CommonDialogProps>(), {
  title: '',
});

const emits = defineEmits<CommonDialogEmits>();

const modalRef = ref<CommonModalFunc>();

function show() {
  modalRef.value?.open();
}

function close(callback?: () => void) {
  modalRef.value?.close(callback);
  if (props._id) {
    // 如果有props.id，需要在manager中销毁自身
    DialogManager.destroy(props._id);
  }
}

function handleConfirm() {
  if (props.onConfirm) {
    props.onConfirm(close);
    emits('onConfirm', close); // 传递关闭回调函数
  } else {
    close(); // 不存在回调函数时默认自动关闭
  }
}

function handleCancel() {
  if (props.onCancel) {
    props.onCancel(close);
    emits('onCancel', close); // 传递关闭回调函数
  } else {
    close(); // 不存在回调函数时默认自动关闭
  }
}

defineExpose<CommonDialogExpose>({
  show,
  close,
});
</script>

<template>
  <CommonModal :modal-style="{ 'background-color': 'white', ...props.modalStyle }" ref="modalRef" :show-close="false">
    <div class="dialog">
      <header>
        <div class="dialog-title">{{ title }}</div>
      </header>
      <hr />
      <main>
        <div v-html="props.content"></div>
        <slot></slot>
      </main>
      <hr />
      <footer>
        <DiliButton text="取消" type="normal" @click="handleCancel" v-bind="props.cancelButtonProps" />
        <DiliButton text="确认" type="primary" @click="handleConfirm" v-bind="props.confirmButtonProps" />
      </footer>
    </div>
  </CommonModal>
</template>

<style scoped lang="scss">
.dialog {
  width: 100%;
  padding: 0.25rem 0.5rem 0.5rem 0.5rem;
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
  }
}
</style>