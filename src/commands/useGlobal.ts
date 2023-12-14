// 自定义组合函数，用于获取一些全局信息
import { useMediaQuery } from "@vueuse/core";
import { reactive, toRef } from "vue";

const useGlobal = () => {
  const isLargeScreen = useMediaQuery('(min-width: 768px);');
  const isSmallScreen = useMediaQuery('(max-width: 768px);');

  return reactive({
    // toRef是vue3.3新增的工具函数，可以将value/refs/getter规范为ref，这里传getter使其只读
    isLargeScreen: toRef(() => isLargeScreen.value),
    isSmallScreen: toRef(() => isSmallScreen.value),
  })
}

export default useGlobal;