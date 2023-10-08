<script setup lang="ts">
type DialogProps = {
  title?: string;
  content?: string;
  closable?: boolean;
  confirmText?: string;
  cancelText?: string;
};
const props = withDefaults(defineProps<DialogProps>(), {
  title: '提示',
  content: '',
  closable: true,
  confirmText: '确定',
  cancelText: '取消'
});
const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function handleConfirm() {
  emit('confirm');
}
function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <div class="">

  </div>
</template>

<style scoped lang="scss">

</style>