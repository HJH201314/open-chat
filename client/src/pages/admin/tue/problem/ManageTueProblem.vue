<template>
  <div>
    <TableTitleArea title="题库" subtitle="">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getProblems()">
          <template #icon>
            <refresh-icon />
          </template>
        </t-button>
        <t-button theme="primary" @click="handleEdit({})">
          <template #icon>
            <add-icon />
          </template>
          创建
        </t-button>
      </template>
    </TableTitleArea>
    <TableWrapper v-slot="{ maxHeight }">
      <t-table
        ref="table"
        row-key="id"
        size="small"
        table-layout="fixed"
        :max-height="maxHeight"
        :allow-resize-column-width="false"
        :data="data"
        :loading="loading"
        :columns="columns"
        :bordered="true"
        :hover="true"
        :pagination="pagination"
        :footer-affixed-bottom="true"
        style="width: 100%; background-color: transparent"
        cell-empty-content="-"
        lazy-load
      >
        <template #type="{ row }">
          {{ getProblemTypeName(row.type || '') }}
        </template>
        <template #difficulty="{ row }">
          <t-rate :default-value="row.difficulty" size="16" disabled />
        </template>
        <template #operation="{ row }">
          <ActionSet>
            <t-tooltip :delay="10" content="编辑">
              <t-link theme="primary" hover="color" @click="handleEdit(row)">
                <edit-icon />
              </t-link>
            </t-tooltip>
            <t-tooltip :delay="10" content="删除">
              <t-link theme="danger" hover="color" @click="handleDelete(row)">
                <delete-icon />
              </t-link>
            </t-tooltip>
          </ActionSet>
        </template>
      </t-table>
    </TableWrapper>
  </div>
</template>

<script setup lang="tsx">
import { h, onMounted, reactive, ref, watchEffect } from 'vue';
import type { ApiSchemaProblem } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';
import DialogCreateProblem from '@/pages/admin/tue/problem/DialogCreateProblem.vue';
import { getProblemTypeName } from '@/pages/user/tue/exam/utils.ts';

type T = ApiSchemaProblem;

const data = ref<T[]>([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(15);
const pagination = reactive({
  pageSizeOptions: [5, 10, 15, 20],
  defaultCurrent: pageNum,
  defaultPageSize: pageSize,
  onChange(param: { current: number; previous: number; pageSize: number }) {
    pageNum.value = param.current;
    pageSize.value = param.pageSize;
  },
  total,
});

onMounted(() => {
  watchEffect(() => {
    getProblems(pageNum.value, pageSize.value);
  });
});

const loading = ref(false);

async function getProblems(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Tue.problemListGet({
      page_num: finalPageNum,
      page_size: finalPageSize,
      sort_expr: 'id DESC',
    });
    if (res.status == 200 && res.data.data) {
      total.value = res.data.data.total || 0;
      data.value = res.data.data.list || [];
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

const columns = ref<PrimaryTableCol<T>[]>([
  { colKey: 'serial-number', title: 'NO', width: '3rem', align: 'center' },
  { colKey: 'type', title: '类型', width: '10rem' },
  { colKey: 'description', title: '题目描述', ellipsis: true },
  { colKey: 'subject', title: '主题', width: '5rem' },
  { colKey: 'difficulty', title: '难度', width: '7rem' },
  { colKey: 'operation', title: '操作', width: '4rem', fixed: 'right' },
]);

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<T>({});

function handleEdit(row: T) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateProblem, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getProblems();
      },
    })
  );
}

function handleDelete(row: T) {
  DialogManager.commonDialog({
    title: '删除题目',
    content: `确定要删除题目 ${row.description} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Tue.problemDeletePost(row.id);
        if (res.status == 200) {
          getProblems();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
</script>

<style scoped lang="scss"></style>
