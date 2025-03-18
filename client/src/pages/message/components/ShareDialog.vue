<script setup lang="ts">
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import { useModalVisible } from '@/components/modal/util/useModalVisible.ts';
import useSession from '@/store/data/useSession.ts';
import CusInput from '@/components/input/CusInput.vue';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import CusToggle from '@/components/toggle/CusToggle.vue';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import DiliButton from '@/components/button/DiliButton.vue';
import { useClipboard } from '@vueuse/core';
import type { ApiSchemaShareInfo } from '@/api/gen/data-contracts.ts';

const props = defineProps<{
  sessionId: string;
}>();

const { session: sessionInfo } = useSession(props.sessionId);

const savedRemoteUserSessionShare = ref({} as ApiSchemaShareInfo);
const expiredTimeText = computed(() =>
  savedRemoteUserSessionShare.value.permanent
    ? ' (永久)'
    : new Date(savedRemoteUserSessionShare.value.expired_at || 0).getTime() > Date.now()
      ? ` (${new Date(savedRemoteUserSessionShare.value.expired_at || 0).toLocaleString()}到期)`
      : ''
);
const form = reactive<{
  isActive: boolean;
  title: string;
  code: string;
  link: string;
  expirePeriod: '1hour' | '1day' | '7day' | '30day' | 'forever' | 'any';
  expireDays: number;
}>({
  isActive: false,
  title: '',
  code: '',
  link: computed(() => `${window.location.origin}/chat/share/${props.sessionId}`),
  expirePeriod: 'forever',
  expireDays: 1,
});

watchEffect(() => {
  form.title = sessionInfo.value.title;
});
watchEffect(() => {
  if (form.expireDays < 1) {
    form.expireDays = 1;
  }
});

const loadFinished = ref(false);

async function refreshSessionShareInfo(type: 'refresh' | 'get' = 'get') {
  type == 'get' && (loadFinished.value = false);
  try {
    const sessionRes = await genApi.Chat.sessionUserGet(props.sessionId);
    const shareInfo = sessionRes.data.data?.share_info;
    if (shareInfo) {
      savedRemoteUserSessionShare.value = JSON.parse(JSON.stringify(shareInfo)) as ApiSchemaShareInfo;
      console.log(savedRemoteUserSessionShare.value);
      form.isActive = shareInfo.permanent || new Date(shareInfo.expired_at || 0).getTime() > Date.now();
      form.code = shareInfo.code || '';
      type == 'get' && (form.title = shareInfo.title || '');
    }
  } catch (_) {
    ToastManager.danger('加载失败，请稍后重试~');
  }
  type == 'get' && (loadFinished.value = true);
}

watch(
  () => props.sessionId,
  async (value) => {
    if (value) {
      await refreshSessionShareInfo('get');
    }
  },
  { immediate: true }
);

async function handleToggleActive(active: boolean) {
  try {
    let res: Awaited<ReturnType<typeof genApi.Chat.sessionSharePost>>;
    if (active) {
      // 计算到期时间
      const expiredTime = new Date();
      switch (form.expirePeriod) {
        case '1hour':
          expiredTime.setHours(expiredTime.getHours() + 1);
          break;
        case '1day':
          expiredTime.setDate(expiredTime.getDate() + 1);
          break;
        case '7day':
          expiredTime.setDate(expiredTime.getDate() + 7);
          break;
        case '30day':
          expiredTime.setDate(expiredTime.getDate() + 30);
          break;
        default:
          expiredTime.setTime(0);
      }
      res = await genApi.Chat.sessionSharePost(props.sessionId, {
        active: true,
        share_info: {
          permanent: form.expirePeriod == 'forever',
          expired_at: expiredTime.getTime() || 0,
          title: form.title,
        },
      });
    } else {
      res = await genApi.Chat.sessionSharePost(props.sessionId, {
        active: false,
      });
    }
    if (res.data.data) {
      ToastManager.success(`${!active ? '取消' : ''}分享成功`);
      await refreshSessionShareInfo('refresh');
    }
  } catch (_) {
    ToastManager.danger('请求失败，请稍后重试~');
  }
}

const { isSupported, copied, copy } = useClipboard({ source: form.link });

function handleLinkCopy() {
  if (isSupported) {
    copy();
  } else {
    ToastManager.info('您的浏览器不支持复制，请手动复制');
  }
}

const { visible, hide, show } = useModalVisible(true);
defineExpose({
  show,
  hide,
});
</script>

<template>
  <CommonDialog
    :visible="visible"
    title="分享对话"
    :subtitle="form.isActive ? `取消分享后可修改设置` : '分享对话将生成一个链接，通过此链接可以查看此对话的聊天记录'"
    :show-confirm="false"
    :cancel-button-props="{ text: '关闭' }"
  >
    <template #default>
      <div v-if="loadFinished" class="share-dialog__body">
        <CusInput v-model="form.title" placeholder="分享名称（默认为对话标题）" :disabled="form.isActive" />
        <Transition mode="out-in">
          <div v-if="!form.isActive" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <CusRadioGroup v-model="form.expirePeriod" style="flex-shrink: 0">
              <CusRadioButton value="forever" label="永久" />
              <CusRadioButton value="1hour" label="1小时" />
              <CusRadioButton value="1day" label="1天" />
              <CusRadioButton value="7day" label="7天" />
              <CusRadioButton value="30day" label="30天" />
              <CusRadioButton value="any" label="自定义" />
            </CusRadioGroup>
            <div style="flex: 1; display: flex; align-items: center; gap: 0.5rem;">
              <CusInput
                v-if="form.expirePeriod == 'any'"
                v-model.number="form.expireDays"
                :input-attrs="{ type: 'number' }"
                placeholder="时间（天）"
                style="flex-shrink: 1; flex-basis: 5rem"
              />
              <span v-if="form.expirePeriod == 'any'">天</span>
            </div>
          </div>
          <div v-else style="display: flex; gap: 0.5rem; align-items: center">
            <CusInput v-model="form.link" placeholder="分享链接" disabled />
            <DiliButton
              :button-style="{ width: '4rem' }"
              :text="copied ? '✔' : '复制'"
              type="secondary"
              background-color="#e3f1f1"
              font-color="#52a49a"
              @click="handleLinkCopy"
            />
          </div>
        </Transition>
      </div>
    </template>
    <template #action>
      <div v-if="loadFinished" style="display: flex; gap: 0.5rem; align-items: center;">
        <CusToggle
          v-model="form.isActive"
          :label="form.isActive ? `已公开${expiredTimeText}` : '未公开'"
          :highlight="form.isActive"
          style="flex-shrink: 0"
          @change="handleToggleActive"
        />
      </div>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss">
.share-dialog {
  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>