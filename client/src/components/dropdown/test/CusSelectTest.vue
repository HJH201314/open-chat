<template>
  <div class="select-test-container">
    <h2>CusSelect 组件测试</h2>

    <!--    <div class="test-item">-->
    <!--      <h3>基础用法</h3>-->
    <!--      <CusSelect-->
    <!--        v-model="selectedValue"-->
    <!--        :options="options"-->
    <!--        placeholder="请选择"-->
    <!--        @change="handleChange"-->
    <!--      />-->
    <!--      <p>当前选中值：{{ selectedValue }}</p>-->
    <!--    </div>-->

    <!--    <div class="test-item">-->
    <!--      <h3>禁用状态</h3>-->
    <!--      <CusSelect-->
    <!--        v-model="selectedValue2"-->
    <!--        :options="options"-->
    <!--        disabled-->
    <!--        placeholder="禁用状态"-->
    <!--      />-->
    <!--    </div>-->

    <!--    <div class="test-item">-->
    <!--      <h3>自定义选项</h3>-->
    <!--      <CusSelect-->
    <!--        v-model="selectedValue3"-->
    <!--        :options="customOptions"-->
    <!--        placeholder="带有图标的选项"-->
    <!--      />-->
    <!--    </div>-->

    <div class="test-item">
      <h3>多层级嵌套菜单</h3>
      <CusSelect v-model="selectedValue4" :options="nestedOptions" placeholder="多级菜单选择" @change="handleChange" />
      <p>当前选中值：{{ selectedValue4 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CusSelect from '@/components/dropdown/CusSelect.vue';

const selectedValue = ref('');
const selectedValue2 = ref('');
const selectedValue3 = ref('A');
const selectedValue4 = ref('1-2-1');

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
];

const customOptions = [
  { label: '选项A', value: 'A', icon: '📌' },
  { label: '选项B', value: 'B', icon: '🔍' },
  { label: '选项C', value: 'C', icon: '💡' },
];

const nestedOptions = [
  {
    label: '选项1',
    value: '1',
    children: [
      { label: '选项1-1', value: '1-1' },
      {
        label: '选项1-2',
        value: '1-2',
        children: [
          { label: '选项1-2-1', value: '1-2-1' },
          { label: '选项1-2-2', value: '1-2-2' },
        ],
      },
    ],
  },
  {
    label: '选项2',
    value: '2',
    children: [
      { label: '选项2-1', value: '2-1' },
      { label: '选项2-2', value: '2-2' },
    ],
  },
];

const handleChange = (value: string) => {
  console.debug('选中值变化：', value);
};
</script>

<style scoped>
.select-test-container {
  padding: 20px;
  max-width: min(50rem, 100vw);
  margin: 0 auto;
}

.test-item {
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 7px;
}

h3 {
  margin-bottom: 4px;
  color: #666;
}

p {
  margin-top: 4px;
  color: #666;
}
</style>
