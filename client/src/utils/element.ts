export const scrollToBottom = (ele: Element, behavior: ScrollBehavior = 'smooth') => {
  requestAnimationFrame(() => {
    ele.scrollTo({
      top: ele.scrollHeight,
      behavior: behavior,
    });
  });
};
