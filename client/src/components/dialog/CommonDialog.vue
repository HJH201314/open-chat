<!-- 基于Modal的基础对话框组件 -->
<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import type { CommonDialogEmits, CommonDialogExpose, CommonDialogProps } from '@/components/dialog/CommonDialog';
import type { CommonModalFunc } from '@/components/modal/CommonModal';
import CommonModal from '@/components/modal/CommonModal.vue';
import { ref } from 'vue';

const props = withDefaults(defineProps<CommonDialogProps>(), {
  title: '',
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

function handleConfirm() {
  emits('confirm'); // 传递关闭回调函数
  close(); // 不存在回调函数时默认自动关闭
}

function handleCancel() {
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
        <div class="dialog-title">{{ title }}</div>
      </header>
      <hr />
      <main>
        <div v-html="props.content"></div>
        <slot></slot>
      </main>
      <hr />
      <footer>
        <DiliButton text="取消" type="normal" v-bind="props.cancelButtonProps" @click="handleCancel" />
        <DiliButton text="确认" type="primary" v-bind="props.confirmButtonProps" @click="handleConfirm" />
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
}
</style>
