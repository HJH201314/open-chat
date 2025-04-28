<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal.ts';
import { DialogManager } from '@/components/dialog';
import { useDataStore } from '@/store/data/useDataStore.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { onStartTyping, useIntervalFn, watchArray } from '@vueuse/core';
import { computed, h, reactive, ref, useTemplateRef, watch } from 'vue';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import { storeToRefs } from 'pinia';
import useSession from '@/store/data/useSession.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import ShareDialog from '@/pages/user/chat/message/components/ShareDialog.vue';
import DialogDetail from './DialogDetail.vue';
import { useTheme } from '@/components/theme/useTheme.ts';
import { Refresh } from '@icon-park/vue-next';
import EditDialog from '@/pages/user/chat/message/components/EditDialog.vue';
import DialogAction from '@/pages/user/chat/message/components/DialogAction.vue';
import DialogInput from '@/pages/user/chat/message/components/DialogInput.vue';
import genApi from '@/api/gen-api.ts';
import { ApiSchemaSessionNameType } from '@/api/gen/data-contracts.ts';

interface Props {
  dialogId: string;
}

const props = withDefaults(defineProps<Props>(), {
  dialogId: '',
});

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const dataStore = useDataStore();
const userStore = useUserStore();
const { modelDropdown, botsDropdown: botDropdown } = storeToRefs(useChatConfigStore());
const { theme } = useTheme();

const form = reactive({
  sessionId: props.dialogId,
  withContext: true, // 启用上下文，默认开启
  withSearch: false, // 启用搜索，默认关闭
  modelName: '',
  botRoleId: 0, // 角色 ID
  inputValue: '',
  fixDialogToBottom: true,
});
const inputCtrl = reactive({
  modelSelector: true,
  botSelector: true,
  contextToggle: true,
  searchToggle: true,
});
const hasPermission = computed(
  () => userStore.isLogin && (!sessionInfo.value.userId || sessionInfo.value.userId == userStore.userId)
);

const {
  session: sessionInfo,
  messages: messageList,
  syncMessages,
  useSendMessageText,
  editSessionTitle,
} = useSession(() => form.sessionId);

// 如果需要响应 props 的变化
watch(
  () => props.dialogId,
  (newId) => {
    form.sessionId = newId;
  }
);

const dialogDetailRef = useTemplateRef<InstanceType<typeof DialogDetail>>('dialog-detail');
watchArray(messageList, (newVal, oldVal) => {
  // 消息列表变化时，滚动到底部（消息增加 1 时平滑，增加多条时立即）
  let scrollBehavior: ScrollBehavior | '' = '';
  if (newVal[0]?.sessionId != oldVal[0]?.sessionId) scrollBehavior = 'instant';
  else if (newVal.length > oldVal.length)
    scrollBehavior = Math.abs(newVal.length - oldVal.length) <= 1 ? 'smooth' : 'instant';

  if (newVal.length && scrollBehavior) {
    setTimeout(() => {
      dialogDetailRef.value?.scrollDialogListToBottom(scrollBehavior);
    }, 0);
  }
});

// session 变化成功，进行同步
watch(
  () => sessionInfo.value,
  (newSession) => {
    const { id: newSessionId, flags } = newSession;
    // 如果信息不存在，route 返回
    if (!newSessionId) emit('back');

    if (flags?.needSync) {
      if (!userStore.isLogin || (newSession.userId && newSession.userId != userStore.userId)) {
        return;
      }
      doSyncDialog(newSessionId).then(() => {
        dataStore.updateSessionFlags(newSessionId, { needSync: false });
      });
    }
  },
  { deep: false }
);

// 加载 session 信息到 form
watch(
  () => sessionInfo.value,
  (newSession) => {
    if (newSession) {
      form.withContext = newSession.withContext ?? false;
      form.withSearch = newSession.withSearch ?? false;
      form.modelName = newSession.model || '';
      form.botRoleId = newSession.botId || 0;
    }
  }
);

// 保存上下文开关
watch(
  () => form.withContext,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dataStore.toggleDialogContext(form.sessionId, newVal);
    }
  }
);

// 保存搜索开关
watch(
  () => form.withSearch,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dataStore.toggleDialogSearch(form.sessionId, newVal);
    }
  }
);

// 保存使用的模型
watch(
  () => form.modelName,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dataStore.changeDialogModel(form.sessionId, newVal);
    }
  }
);

// 保存 bot 角色
watch(
  () => form.botRoleId,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      dataStore.changeSessionBot(form.sessionId, newVal);
      // 使用 bot 时，上下文由后台控制
      inputCtrl.contextToggle = !(newVal > 0);
    }
  }
);

const { resume: startSessionFetcher, pause: stopSessionFetcher } = useIntervalFn(
  async () => {
    try {
      const { data } = await genApi.Chat.sessionGet(form.sessionId);
      if (!data.data) {
        // data 不应为空，此时视为出现异常
        stopSessionFetcher();
        return;
      }
      if (data.data.name) {
        // 修改本地标题
        await editSessionTitle(data.data.name, false);
      }
      if (data.data.name_type == ApiSchemaSessionNameType.EnumSessionNameTypeSystem) {
        // 标题生成完成
        stopSessionFetcher();
      }
    } catch (_) {
      stopSessionFetcher();
    }
  },
  10000,
  {
    immediate: false,
    immediateCallback: true,
  }
);

const {
  msgId: answerMsgId,
  start: startReceivingMsg,
  stop: stopReceivingMsg,
  answer: answerMsg,
  think: thinkMsg,
  isStreaming: isReceivingMsg,
} = useSendMessageText();

async function handleSendMessage() {
  if (isReceivingMsg.value) {
    stopReceivingMsg();
    return;
  }
  if (!userStore.isLogin) {
    ToastManager.warning('请先登录！');
    return;
  }
  if (!hasPermission.value) {
    ToastManager.warning('无此会话权限！');
    return;
  }
  if (!form.sessionId || !form.inputValue) return;
  if (isReceivingMsg.value) {
    ToastManager.warning('不能同时回答多个问题哦！');
    return;
  }
  const savedInputValue = form.inputValue;
  // 发送消息
  try {
    let successfullyFinished = false;
    await startReceivingMsg(form.inputValue, {
      onPreSaveMsg() {
        form.inputValue = '';
        form.fixDialogToBottom = true;
        return;
      },
      onThinkMessage() {
        form.fixDialogToBottom && dialogDetailRef.value?.scrollDialogListToBottom('smooth');
      },
      onMessage() {
        form.fixDialogToBottom && dialogDetailRef.value?.scrollDialogListToBottom('smooth');
      },
      onFinish() {
        successfullyFinished = true;
      },
      onError() {
        ToastManager.danger('出错了，换个姿势再试吧~', { position: 'top-right' });
      },
    });
    // 若未到达底部，则提示用户生成完成
    if (!dialogDetailRef.value?.isDialogListReachedBottom) {
      // ToastManager.normal(successfullyFinished ? '回答完成' : '回答中断', {
      //   position: 'top',
      //   icon: h(Correct),
      //   type: successfullyFinished ? 'success' : 'danger',
      // });
    }
    // 若消息数量小于 3 且第一个消息为用户消息，则启动定时任务来获取会话标题
    if (messageList.value.length < 3 && messageList.value[0] && !sessionInfo.value.title) {
      // 临时修改标题为第一条消息的内容
      editSessionTitle(savedInputValue, false).finally();
      startSessionFetcher();
    }
  } catch (e) {
    if (typeof e == 'string') {
      ToastManager.danger(e);
    }
  }
}

function checkPermission(): boolean {
  if (!userStore.isLogin) {
    ToastManager.danger('请先登录~');
    return false;
  }
  if (!hasPermission.value) {
    ToastManager.warning('无此会话权限！');
    return false;
  }
  return true;
}

function handleActionTipClick() {
  if (!userStore.isLogin) {
    ToastManager.info('未登录，仅可查看缓存对话');
  } else {
    ToastManager.info('当前账号未拥有会话权限');
  }
}

async function handleStarDialog() {
  const res = await dataStore.updateSessionFlags(form.sessionId, { isStared: !sessionInfo.value.flags?.isStared });
  if (res) {
    // ToastManager.normal(`${!sessionInfo.value.flags?.isStared ? '取消' : ''}收藏成功`);
  } else {
    ToastManager.danger('收藏失败，请稍后重试~');
  }
}

function handleShareDialog() {
  if (!checkPermission()) return;

  DialogManager.renderDialog(
    h(ShareDialog, {
      sessionId: form.sessionId,
      onAfterClose() {},
    })
  );
}

// 从服务器同步数据
const messageSyncing = ref(false);

async function doSyncDialog(sessionId: string, controller?: AbortController) {
  if (messageSyncing.value) return;
  try {
    messageSyncing.value = true;
    await syncMessages(sessionId, controller);
  } finally {
    messageSyncing.value = false;
  }
}

async function handleSyncDialog() {
  if (!checkPermission()) return;

  const currentSessionId = form.sessionId;
  // 消息列表为空，直接进行同步
  if (!messageList.value.length) {
    await doSyncDialog(currentSessionId);
    return;
  }
  DialogManager.createDialog({
    icon: h(Refresh),
    title: '刷新对话',
    content: '即将从服务器重新获取数据，如遇客户端渲染异常，可尝试执行。',
    async confirmHandler(controller) {
      await doSyncDialog(currentSessionId, controller);
    },
  });
}

function handleEditDialog() {
  if (!checkPermission()) return;

  DialogManager.renderDialog(
    h(EditDialog, {
      cancelButtonProps: {
        text: '关闭',
      },
      showConfirm: false,
      sessionId: sessionInfo.value.id,
      session: sessionInfo.value,
    })
  );
}

function handleDeleteDialog() {
  if (!checkPermission()) return;

  DialogManager.commonDialog({
    type: 'danger',
    title: '删除对话',
    subtitle: '这是不可逆的！',
    subtitleStyle: {
      color: theme.colorDanger,
    },
    content: `确认删除对话：<br /> - ${sessionInfo.value.title} <br />`,
    renderContentHtml: true,
    confirmButtonProps: {
      backgroundColor: theme.colorDanger,
    },
  }).then((res) => {
    if (res) {
      dataStore.delDialog(form.sessionId); // 本地 + 远程 删除
      emit('back');
    }
  });
}

const inputPanelRef = useTemplateRef('input-panel');
onStartTyping(() => {
  if (inputPanelRef.value && !inputPanelRef.value?.textareaFocused) {
    inputPanelRef.value.focusTextarea();
  }
});

const { isSmallScreen } = useGlobal();

defineExpose({
  isStreaming: isReceivingMsg,
  stopStreaming: stopReceivingMsg,
});
</script>

<template>
  <DialogDetail
    ref="dialog-detail"
    v-model:fix-dialog-to-bottom="form.fixDialogToBottom"
    class="dialog-detail-view"
    :dialog-id="form.sessionId"
    :session="sessionInfo"
    :messages="messageList"
    :message-count="messageList.length"
    :has-permission="hasPermission"
    :is-login="userStore.isLogin"
    :message-syncing="messageSyncing"
    :is-receiving-msg="isReceivingMsg"
    :answer-msg-id="answerMsgId"
    :answer-msg="answerMsg"
    :think-msg="thinkMsg"
    :user-input="form.inputValue"
    :is-small-screen="isSmallScreen"
    :model-dropdown="modelDropdown"
    :bot-dropdown="botDropdown"
  >
    <template #action="{ detailArrivedState }">
      <DialogAction
        id="dialog-action"
        ref="dialog-action"
        :title="sessionInfo.title || '未命名对话'"
        :message-count="messageList.length"
        :has-permission="hasPermission"
        :is-login="userStore.isLogin"
        :is-stared="sessionInfo.flags?.isStared"
        :is-shared="sessionInfo.flags?.isShared"
        :message-syncing="messageSyncing"
        :menu-in-more="isSmallScreen"
        :shadowed="!detailArrivedState.top"
        :can-expand-menu="!isSmallScreen"
        style="margin-inline: 0.25rem"
        @back="$emit('back')"
        @star="handleStarDialog"
        @share="handleShareDialog"
        @sync="handleSyncDialog"
        @edit="handleEditDialog"
        @delete="handleDeleteDialog"
        @action-tip-click="handleActionTipClick"
      />
    </template>
    <template #input>
      <DialogInput
        ref="input-panel"
        v-model:input-user-input="form.inputValue"
        v-model:input-with-context="form.withContext"
        v-model:input-with-search="form.withSearch"
        :input-model-name="form.modelName"
        :input-bot-id="form.botRoleId"
        :model-dropdown="modelDropdown"
        :bot-dropdown="botDropdown"
        :display-in-middle="messageList.length == 0 && !isSmallScreen"
        :is-streaming="isReceivingMsg"
        :hide-self="messageSyncing"
        :show-model-selector="inputCtrl.modelSelector"
        :show-bot-selector="inputCtrl.botSelector"
        :show-context-toggle="inputCtrl.contextToggle"
        :show-search-toggle="inputCtrl.searchToggle"
        @send="handleSendMessage"
        @model-select="
          (value) => {
            form.modelName = value;
          }
        "
        @bot-select="(v) => (form.botRoleId = v)"
      />
    </template>
  </DialogDetail>
</template>

<style lang="scss" scoped>
.dialog-detail-view {
  position: absolute;
  inset: 0;

  &-wrapper {
    position: absolute;
    inset: 0;
  }
}
</style>
<style lang="scss">
@use '@/assets/variables' as *;

.flow-in-enter-from,
.flow-in-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.flow-in-enter-active,
.flow-in-leave-active {
  transition: all 0.3s $ease-in-out-back;
}

.slide-top-fade-enter-from,
.slide-top-fade-leave-to {
  margin-bottom: -1.5rem;
  opacity: 0;
}

.slide-top-fade-enter-active,
.slide-top-fade-leave-active {
  transition: all 0.2s $ease-out-circ;
}
</style>