<script setup lang="ts">
import DialogDetail from '@/pages/user/chat/message/components/DialogDetail.vue';
import genApi from '@/api/gen-api.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';
import { computed, onMounted, ref, watchEffect } from 'vue';
import type { ApiSchemaMessage } from '@/api/gen/data-contracts.ts';
import { renderMarkdown } from '@/commands/useMarkdownIt';
import DialogAction from '@/pages/user/chat/message/components/DialogAction.vue';
import { useRouter } from 'vue-router';
import { useEventBus, useTitle } from '@vueuse/core';
import { noPaddingKey } from '@/constants/eventBusKeys.ts';
import useGlobal from '@/commands/useGlobal.ts';
import { BizErrNoPermission, BizErrNoRecord, BizErrOutdated } from '@/constants/bizErrorCode.ts';
import { showLoginDialog } from '@/pages/user/login';
import { useUserStore } from '@/store/useUserStore.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import { useRouteQuery } from '@vueuse/router';
import { DialogManager } from '@/components/dialog';
import { AxiosError } from 'axios';
import CusInput from '@/components/input/CusInput.vue';
import DiliButton from '@/components/button/DiliButton.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';

const props = defineProps<{
  sessionId: string;
}>();

const { isLargeScreen } = useGlobal();
// 移动端 padding 隐藏和展示
const noPaddingBus = useEventBus(noPaddingKey);
watchEffect(() => {
  // 大屏时展示边栏、关闭零内衬
  if (isLargeScreen.value) {
    noPaddingBus.emit(false);
  }
  // 进入对话时侧边栏收起，退出后展开
  else {
    noPaddingBus.emit(true);
  }
});

const router = useRouter();

const code = useRouteQuery<string>('code', '');
const cancelled = ref<'' | 'outdated' | 'no-record' | 'code-wrong'>('');
const tip = computed(() => {
  if (cancelled.value == 'outdated') return '来晚了，分享已过期';
  else if (cancelled.value == 'no-record') return '分享不存在';
  else if (cancelled.value == 'code-wrong') return '请输入分享码';
  else return '这里空空如也';
});
const messageList = ref<MessageInfo[]>([]);
const sessionInfo = ref<SessionInfo>({ id: props.sessionId });
const modelMap = ref<Record<string, string>>({});
const loading = ref(false);
const currentPageNum = ref(1);
const nextPageNum = ref(0);

useTitle(() => (sessionInfo.value.title ? `${sessionInfo.value.title}` : '') + '分享 | OpenChat');

const getSession = async (touch: boolean = true) => {
  try {
    const res = await genApi.Chat.sessionSharedGet(props.sessionId, {
      touch,
      code: code.value,
    });
    if (res.data.code == 200) {
      sessionInfo.value.title = res.data.data?.session?.name || '';
      sessionInfo.value.userId = res.data.data?.user_id ?? 0;
      return true;
    } else {
      switch (res.data.code) {
        case BizErrNoPermission.bizCode: {
          const r = await DialogManager.inputDialog({
            title: '访问此对话需要分享码',
            placeholder: '请输入分享码',
          });
          if (r.status && r.value) {
            code.value = r.value;
            // 递归调用 getSession(touch=false)，如果再发生错误，将不会进入此分支
            await getSession(false);
            return true;
          }
          break;
        }
        case BizErrNoRecord.bizCode:
          cancelled.value = 'no-record';
          ToastManager.danger('分享不存在');
          break;
        case BizErrOutdated.bizCode:
          cancelled.value = 'outdated';
          ToastManager.danger('分享已过期');
          break;
      }
    }
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data?.code == BizErrNoPermission.bizCode) {
      cancelled.value = 'code-wrong';
      ToastManager.danger('分享码错误');
    } else {
      cancelled.value = '';
      ToastManager.danger('网络异常，请稍后重试~');
    }
    return false;
  }
  return false;
};

const getMessageList = async (pageNum: number) => {
  if (pageNum <= 0) return;
  try {
    const res = await genApi.Chat.messageListSharedGet(props.sessionId, {
      code: code.value,
      page_num: pageNum,
      page_size: 50,
    });
    if (res.data.data?.list?.length) {
      nextPageNum.value = res.data.data?.next_page || 0;
      modelMap.value = { ...modelMap.value, ...(res.data.data?.model_map ?? {}) };
      const newMessageList = res.data.data.list.map((v: ApiSchemaMessage) => {
        return {
          sessionId: props.sessionId,
          messageId: v.id ? String(v.id) : undefined,
          time: new Date(v.created_at!).getTime(),
          sender: v.role === 'user' ? 'user' : 'bot',
          type: 'text',
          content: v.content,
          reasoningContent: JSON.parse(`"${v.reasoning_content}"`),
          htmlContent: v.role == 'assistant' ? renderMarkdown(v.content) : v.content,
          model: v.model_id ? modelMap.value[v.model_id] : '',
          extra: v.extra,
        } as MessageInfo;
      });
      messageList.value = [...messageList.value, ...newMessageList].sort(
        (a, b) => Number(a.messageId) - Number(b.messageId)
      );
    }
  } catch (_) {
    // do nothing
  }
};

const userStore = useUserStore();
onMounted(async () => {
  if (!userStore.isLogin) {
    showLoginDialog();
    return;
  }
});

watchEffect(async () => {
  if (userStore.isLogin) {
    try {
      loading.value = true;
      (await getSession()) && (await getMessageList(currentPageNum.value));
    } finally {
      loading.value = false;
    }
  }
});

const onActionBack = () => {
  if (history.length > 1) {
    router.back();
  } else {
    router.push({ path: '/' });
  }
};

const onSubmitCode = async () => {
  if (code.value) {
    (await getSession(false)) && (await getMessageList(currentPageNum.value));
  }
};

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div class="share-page">
    <LoadingModal :visible="loading" />
    <DialogDetail
      class="dialog-detail"
      :empty-tip="tip"
      :messages="messageList"
      :session="sessionInfo"
      :is-small-screen="isSmallScreen"
    >
      <template v-if="sessionInfo.id" #action>
        <DialogAction class="dialog-action" :show-menu="false" @back="onActionBack">
          <template #title>
            <div style="flex: auto; display: flex; justify-content: center; align-items: center; padding-right: 2.5rem">
              <div class="dialog-action-title" style="font-weight: bold" :title="sessionInfo.title || ''">
                {{ sessionInfo.title || '' }}
              </div>
            </div>
          </template>
        </DialogAction>
      </template>
      <template v-if="!loading" #empty>
        <div
          style="
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            font-size: 1rem;
            margin-inline: 1rem;
            justify-content: center;
            gap: 0.5rem;
          "
        >
          <CusInput v-model="code" style="max-width: 10rem" placeholder="请输入分享码" />
          <DiliButton type="secondary" text="确定" @click="onSubmitCode" />
        </div>
      </template>
    </DialogDetail>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/extension' as *;

.share-page {
  height: 100%;
  overflow: hidden;

  > .dialog-detail {
    height: 100%;

    .dialog-action {
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.99) 0,
        rgba(255, 255, 255, 0.9) calc(100% - 0.5rem),
        rgba(255, 255, 255, 0) 100%
      );

      .theme-dark & {
        background: linear-gradient(
          to bottom,
          rgba(37, 37, 37, 0.99) 0,
          rgba(37, 37, 37, 0.9) calc(100% - 0.5rem),
          rgba(37, 37, 37, 0) 100%
        );
      }

      &-title {
        @include line-clamp-1;
      }
    }
  }
}
</style>
