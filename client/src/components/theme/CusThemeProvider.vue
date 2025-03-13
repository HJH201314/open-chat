<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { computed, provide, useAttrs } from 'vue';
import { ThemeInjectionKey } from '@/components/theme/types.ts';

const props = defineProps<{
  theme: Record<string, string>;
}>();

// 转换驼峰式命名到CSS自定义属性格式
const cssVars = computed(() => {
  const variables = {} as Record<string, string>;
  for (const key in props.theme) {
    const cssVarName = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
    variables[cssVarName] = props.theme[key];
  }
  return variables;
});

// 通过provide暴露原始theme对象
provide(ThemeInjectionKey, props.theme);

const attrs = useAttrs();
</script>

<template>
  <div :style="cssVars">
    <slot v-bind="attrs" />
  </div>
</template>
