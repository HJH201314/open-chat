<script setup lang="ts">
import { ref } from 'vue';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import CusCheckboxGroup from '@/components/checkbox/CusCheckboxGroup.vue';
import CusCheckboxButton from '@/components/checkbox/CusCheckboxButton.vue';

// 单选组件数据
const selectedRadioValue = ref('option2');
const selectedRadioValue2 = ref('option2');
const selectedRadioValue3 = ref('option2');

// 多选组件数据
const selectedCheckboxValues = ref(['option1', 'option3']);
const selectedCheckboxValues2 = ref(['option1', 'option3']);
const selectedCheckboxValues3 = ref(['option1', 'option3']);
</script>

<template>
  <div class="styles-test-container">
    <h1 class="page-title">样式测试页面</h1>

    <section class="component-section">
      <h2>单选组件 (Radio) 样式</h2>
      
      <div class="style-example">
        <h3>背景样式 (Background)</h3>
        <div class="values-display">已选值: {{ selectedRadioValue }}</div>
        <CusRadioGroup 
          v-model="selectedRadioValue"
          displayStyle="background"
        >
          <CusRadioButton value="option1" label="选项1" />
          <CusRadioButton value="option2" label="选项2" />
          <CusRadioButton value="option3" label="选项3" />
        </CusRadioGroup>
      </div>

      <div class="style-example">
        <h3>图标样式 (Icon)</h3>
        <div class="values-display">已选值: {{ selectedRadioValue2 }}</div>
        <CusRadioGroup 
          v-model="selectedRadioValue2"
          displayStyle="icon"
        >
          <CusRadioButton value="option1" label="选项1" />
          <CusRadioButton value="option2" label="选项2" />
          <CusRadioButton value="option3" label="选项3" />
        </CusRadioGroup>
      </div>

      <div class="style-example">
        <h3>混合样式 (Both)</h3>
        <div class="values-display">已选值: {{ selectedRadioValue3 }}</div>
        <CusRadioGroup 
          v-model="selectedRadioValue3"
          displayStyle="both"
        >
          <CusRadioButton value="option1" label="选项1" />
          <CusRadioButton value="option2" label="选项2" />
          <CusRadioButton value="option3" label="选项3" />
        </CusRadioGroup>
      </div>
    </section>

    <section class="component-section">
      <h2>多选组件 (Checkbox) 样式</h2>
      
      <div class="style-example">
        <h3>背景样式 (Background)</h3>
        <div class="values-display">已选值: {{ selectedCheckboxValues.join(', ') }}</div>
        <CusCheckboxGroup 
          v-model="selectedCheckboxValues"
          displayStyle="background"
        >
          <CusCheckboxButton value="option1" label="选项1" />
          <CusCheckboxButton value="option2" label="选项2" />
          <CusCheckboxButton value="option3" label="选项3" />
        </CusCheckboxGroup>
      </div>

      <div class="style-example">
        <h3>图标样式 (Icon)</h3>
        <div class="values-display">已选值: {{ selectedCheckboxValues2.join(', ') }}</div>
        <CusCheckboxGroup 
          v-model="selectedCheckboxValues2"
          displayStyle="icon"
        >
          <CusCheckboxButton value="option1" label="选项1" />
          <CusCheckboxButton value="option2" label="选项2" />
          <CusCheckboxButton value="option3" label="选项3" />
        </CusCheckboxGroup>
      </div>

      <div class="style-example">
        <h3>混合样式 (Both)</h3>
        <div class="values-display">已选值: {{ selectedCheckboxValues3.join(', ') }}</div>
        <CusCheckboxGroup 
          v-model="selectedCheckboxValues3"
          displayStyle="both"
        >
          <CusCheckboxButton value="option1" label="选项1" />
          <CusCheckboxButton value="option2" label="选项2" />
          <CusCheckboxButton value="option3" label="选项3" />
        </CusCheckboxGroup>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.styles-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  margin-bottom: 30px;
  text-align: center;
}

.component-section {
  margin-bottom: 40px;
  
  h2 {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
}

.style-example {
  margin-bottom: 30px;
  
  h3 {
    margin-bottom: 10px;
  }
  
  .values-display {
    margin-bottom: 10px;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-family: monospace;
  }
}
</style> 