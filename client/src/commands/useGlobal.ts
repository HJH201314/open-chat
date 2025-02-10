// 自定义组合函数，用于获取一些全局信息
import { useMediaQuery } from "@vueuse/core";
import { reactive, toRef } from "vue";

function useGlobal() {
  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return {
    isLargeScreen: toRef(isLargeScreen), // 第三方ref似乎要转换为vue的ref才会具有响应性
    isSmallScreen: toRef(isSmallScreen),
  };
}

export default useGlobal;