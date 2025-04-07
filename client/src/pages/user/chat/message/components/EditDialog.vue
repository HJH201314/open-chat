<script setup lang="ts">
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import CusInput from '@/components/input/CusInput.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import { Edit, SaveOne } from '@icon-park/vue-next';
import { h, onMounted, reactive, watch } from 'vue';
import type { SessionInfo } from '@/types/data.ts';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import { db } from '@/store/data/database.ts';

const props = defineProps<{
  sessionId: string;
  session?: SessionInfo;
}>();

const form = reactive({
  name: '',
  system_prompt: '',
});

watch(
  () => props.session,
  (newVal) => {
    if (newVal) {
      form.name = newVal.title || '';
    }
  },
  { immediate: true }
);

onMounted(() => {
  getSessionInfo();
});

async function getSessionInfo() {
  try {
    const { data: remoteSessionResp } = await genApi.Chat.sessionGet(props.sessionId);
    if (remoteSessionResp.data) {
      form.system_prompt = remoteSessionResp.data.system_prompt || '';
    }
  } catch (_) {
    ToastManager.danger('请求失败，请稍后重试！');
  }
}

// 远程字段和本地字段映射
const keyNameMap: Record<string, string> = {
  name: 'title',
};

async function handleSave(key: 'name' | 'system_prompt') {
  try {
    if (keyNameMap[key]) {
      await db.sessions.where({ id: props.sessionId }).modify((session) => {
        session[keyNameMap[key]] = form[key];
      });
    }
  } catch (_) {
    ToastManager.danger('保存失败！');
  }
  try {
    const { data: editResp } = await genApi.Chat.sessionUpdatePost(props.sessionId, {
      data: {
        [key]: form[key],
      },
      updates: [key],
    });
    if (editResp.data) ToastManager.normal('保存成功！');
    else ToastManager.danger('修改失败！');
  } catch (_) {
    ToastManager.danger('请求失败，请稍后重试！');
  }
}
</script>

<template>
  <CommonDialog title="编辑会话" :icon="h(Edit)">
    <form class="form" @submit.prevent>
      <div class="form-item">
        <div class="label">会话标题:</div>
        <div class="input-area">
          <CusInput v-model="form.name" placeholder="会话名称" />
          <DiliButton type="secondary" @click="handleSave('name')">
            <SaveOne />
          </DiliButton>
        </div>
      </div>
      <div class="form-item">
        <div class="label">系统提示:</div>
        <div class="sub-label">部分模型对系统提示不敏感</div>
        <div class="input-area">
          <CusInput v-model="form.system_prompt" placeholder="系统提示词" />
          <DiliButton type="secondary" @click="handleSave('system_prompt')">
            <SaveOne />
          </DiliButton>
        </div>
      </div>
    </form>
  </CommonDialog>
</template>

<style scoped lang="scss">
.form {
  &-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    > .label {
      font-size: 0.95rem;
    }

    > .sub-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    > .input-area {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
}
</style>