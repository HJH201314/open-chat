<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  line1?: string;
  line2?: string;
}>();

// 不传入或传入默认值都是默认值
const displayLine1 = computed(() => props.line1 || '╮(￣▽￣)╭');
const displayLine2 = computed(() => props.line2 || '这里空空如也');
</script>

<template>
  <div class="empty-tip">{{ displayLine1 }}<br />{{ displayLine2 }}<br /></div>
</template>

<style scoped lang="scss">
.empty-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--color-primary);
  font-size: 2rem;
}
</style>