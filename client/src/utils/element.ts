export const scrollToBottom = (ele: Element, behavior: ScrollBehavior = 'smooth') => {
  requestAnimationFrame(() => {
    ele.scrollTo({
      top: ele.scrollHeight,
      behavior: behavior,
    });
  });
};

/**
 * requestAnimationFrame twice，能够在刚刚修改的响应式数据驱动布局完成后执行回调，此时可以获取到刚刚更新的布局
 * @param cb 执行回调
 */
export const nextFrame = (cb: () => any) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cb();
    });
  });
};