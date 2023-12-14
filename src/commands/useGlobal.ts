// 自定义组合函数，用于获取一些全局信息
import { useMediaQuery } from "@vueuse/core";

function useGlobal() {
  const isLargeScreen = useMediaQuery('(min-width: 768px);');
  const isSmallScreen = useMediaQuery('(max-width: 768px);');

  return {
    isLargeScreen: isLargeScreen,
    isSmallScreen: isSmallScreen,
  };
}

export default useGlobal;