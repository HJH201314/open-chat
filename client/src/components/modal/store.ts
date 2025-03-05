import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommonModalStore = defineStore('CusUI-CommonModal', () => {
  const depth = ref(0);

  /**
   * 模态框开启时调用，返回开启时模态框的层级
   */
  function openModal() {
    depth.value += 1;
    return depth.value;
  }

  function closeModal() {
    depth.value -= 1;
  }

  return {
    depth,
    openModal,
    closeModal,
  }
});