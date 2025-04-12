import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { getRandomString } from '@/utils/string.ts';

/**
 * 全局 Modal - 模态框 状态管理，用于控制模态框的层级
 */
export const useCommonModalStore = defineStore('CusUI-CommonModal', () => {
  // 当前最大层级
  const currentDepth = ref(0);
  // 记录 modal => depth
  const modalMap: Record<string, number> = reactive({});

  /**
   * 模态框开启时调用，返回模态框 ID
   * @return modalId 模态框 ID，用于从 modalMap 查询层级、关闭模态框
   */
  function openModal() {
    currentDepth.value += 1;
    const modalId = getRandomString(10);
    modalMap[modalId] = currentDepth.value;
    return modalId;
  }

  /**
   * 模态框关闭时调用
   * @param modalId 模态框 ID
   */
  function closeModal(modalId: string) {
    const modalDepth = modalMap[modalId];
    if (modalDepth) {
      currentDepth.value -= 1;
      // 删除记录
      delete modalMap[modalId];
      // 降低关闭的模态框上方的模态框深度
      Object.entries(modalMap).forEach(([key, value]) => {
        if (value > modalDepth) {
          modalMap[key] -= 1;
        }
      });
    }
  }

  return {
    currentDepth,
    modalMap,
    openModal,
    closeModal,
  };
});
