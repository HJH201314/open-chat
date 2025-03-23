import { type MaybeRefOrGetter, shallowRef, toValue, watchEffect } from 'vue';
import { tryOnMounted } from '@vueuse/core';

/**
 * 控制模态框的显隐
 * @param defaultVisibility 默认显示与否（动态创建组件时不生效，需手动调用 show 方法）
 */
export const useModalVisible = (defaultVisibility: MaybeRefOrGetter<boolean> = true) => {
  const visible = shallowRef(false);

  const toggle = () => {
    visible.value = !visible.value;
  };
  const show = () => {
    visible.value = true;
  };
  const hide = () => {
    visible.value = false;
  };

  tryOnMounted(() => {
    // 外部传入的 visible 值变化时，更新内部 visible 值；onMounted 后再观测以展示模态框开启动画
    watchEffect(() => {
      visible.value = toValue(defaultVisibility);
    });
  });

  return {
    visible,
    toggle,
    show,
    hide,
  };
};
