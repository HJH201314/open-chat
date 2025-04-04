// 自定义组合函数，用于获取一些全局信息
import { useMediaQuery } from '@vueuse/core';
import { reactive, toRefs } from 'vue';

function useGlobal() {
  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isWideScreen = useMediaQuery('(min-aspect-ratio: 1 / 1)');

  return toRefs(reactive({
    isLargeScreen,
    isSmallScreen,
    isWideScreen,
  }));
}

export default useGlobal;
