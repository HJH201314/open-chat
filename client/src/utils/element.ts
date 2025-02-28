export const scrollToBottom = (ele: Element, behavior: ScrollBehavior = 'smooth') => {
  ele.scrollTo({
    top: ele.scrollHeight,
    behavior: behavior,
  })
}