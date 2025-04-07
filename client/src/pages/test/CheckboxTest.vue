<script setup lang="ts">
import { ref } from 'vue';
import CusCheckboxGroup from '@/components/checkbox/CusCheckboxGroup.vue';
import CusCheckboxButton from '@/components/checkbox/CusCheckboxButton.vue';

const selectedFruits = ref<string[]>(['apple']);
const selectedColors = ref<string[]>(['red', 'blue']);

function handleFruitsChange(values: string[]) {
  console.debug('水果选择变化:', values);
}

function handleColorsChange(values: string[]) {
  console.debug('颜色选择变化:', values);
}
</script>

<template>
  <div class="test-container">
    <h2>多选组件测试</h2>
    
    <div class="test-section">
      <h3>行排列 (Row) - 普通样式 (Normal)</h3>
      <div class="values-display">已选值: {{ selectedFruits.join(', ') }}</div>
      <CusCheckboxGroup
        v-model="selectedFruits"
        type="normal"
        direction="row"
        @change="handleFruitsChange"
      >
        <CusCheckboxButton value="apple" label="苹果" />
        <CusCheckboxButton value="banana" label="香蕉" />
        <CusCheckboxButton value="orange" label="橙子" />
        <CusCheckboxButton value="grape" label="葡萄" />
        <CusCheckboxButton value="watermelon" label="西瓜" disabled />
      </CusCheckboxGroup>
    </div>
    
    <div class="test-section">
      <h3>列排列 (Column) - 高亮样式 (Highlight)</h3>
      <div class="values-display">已选值: {{ selectedColors.join(', ') }}</div>
      <CusCheckboxGroup
        v-model="selectedColors"
        type="highlight"
        direction="column"
        @change="handleColorsChange"
      >
        <CusCheckboxButton value="red" label="红色" />
        <CusCheckboxButton value="blue" label="蓝色" />
        <CusCheckboxButton value="green" label="绿色" />
        <CusCheckboxButton value="yellow" label="黄色" />
        <CusCheckboxButton value="purple" label="紫色" disabled />
      </CusCheckboxGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.test-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
}

.test-section {
  margin-bottom: 40px;
  
  h3 {
    margin-bottom: 10px;
  }
  
  .values-display {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-family: monospace;
  }
}
</style> 