import { type MaybeRefOrGetter, shallowRef, toValue, watchEffect } from 'vue';

/**
 * 控制模态框的显隐
 * @param defaultVisibility
 */
export const useModalVisible = (defaultVisibility: MaybeRefOrGetter<boolean>) => {
  const visible = shallowRef(toValue(defaultVisibility));
  const toggle = () => {
    visible.value = !visible.value;
  };
  const show = () => {
    visible.value = true;
  };
  const hide = () => {
    visible.value = false;
  };

  // 外部传入的 visible 值变化时，更新内部 visible 值
  watchEffect(() => {
    visible.value = toValue(defaultVisibility);
  });

  return {
    visible,
    toggle,
    show,
    hide,
  };
};
