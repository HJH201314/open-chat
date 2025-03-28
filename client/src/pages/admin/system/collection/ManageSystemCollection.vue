<template>
  <t-table
    row-key="index"
    :data="data"
    :columns="columns"
    :bordered="true"
    :hover="true"
    :pagination="pagination"
    style="background-color: transparent"
    cell-empty-content="-"
    resizable
    lazy-load
    @row-click="handleRowClick"
  />
</template>

<script setup lang="tsx">

import { data } from 'autoprefixer';
import { ref } from 'vue';
import { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue-next';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'primary', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};
const data = [];
const total = 28;
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

const columns = ref([
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    cell: (h, { row }) => {
      return (
        <t-tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
        {statusNameListMap[row.status].icon}
      {statusNameListMap[row.status].label}
      </t-tag>
    );
    },
  },
  { colKey: 'channel', title: '签署方式' },
  { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '申请时间' },
]);

const handleRowClick = (e) => {
  console.log(e);
};

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 5,
  total,
};
</script>

<style scoped lang="scss">

</style>