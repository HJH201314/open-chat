<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal.ts';
import { DialogManager } from '@/components/dialog';
import { useDataStore } from '@/store/data/useDataStore.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { watchArray } from '@vueuse/core';
import { computed, h, reactive, ref, useTemplateRef, watch } from 'vue';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import { storeToRefs } from 'pinia';
import useSession from '@/store/data/useSession.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import genApi from '@/api/gen-api.ts';
import ShareDialog from '@/pages/user/chat/message/components/ShareDialog.vue';
import DialogDetail from './DialogDetail.vue';
import { useTheme } from '@/components/theme/useTheme.ts';
import { Control, Correct, Edit, Refresh } from '@icon-park/vue-next';

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
  withContext: false,
  modelName: '',
  botRoleId: 0, // 角色 ID
  inputValue: '',
  fixDialogToBottom: true,
});
const inputCtrl = reactive({
  modelSelector: true,
  botSelector: true,
  contextToggle: true,
});
const hasPermission = computed(
  () => userStore.isLogin && (!sessionInfo.value.userId || sessionInfo.value.userId == userStore.userId)
);

const { session: sessionInfo, messages: messageList, syncMessages, useSendMessageText } = useSession(() => form.sessionId);

// 如果需要响应 props 的变化
watch(
  () => props.dialogId,
  (newId) => {
    form.sessionId = newId;
  }
);

const dialogDetailRef = useTemplateRef<InstanceType<typeof DialogDetail>>('dialog-detail');
watchArray(messageList, (newVal, oldVal) => {
  // 消息列表变化时，滚动到底部（消息增加 1/2 时平滑，增加多条时立即）
  if (newVal.length) {
    setTimeout(() => {
      dialogDetailRef.value?.scrollDialogListToBottom(
        Math.abs(newVal.length - oldVal.length) <= 1 ? 'smooth' : 'instant'
      );
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
      onError() {
        ToastManager.danger('出错了，换个姿势再试吧~', { position: 'top-right' });
      },
    });
    // 若未到达底部，则提示用户生成完成
    if (!dialogDetailRef.value?.isDialogListReachedBottom) {
      ToastManager.normal('回答完成', { position: 'top', icon: h(Correct) });
    }
    // 若消息数量小于 3 且第一个消息为用户消息，则自动修改对话标题
    if (messageList.value.length < 3 && messageList.value[0] && !sessionInfo.value.title) {
      await dataStore.editDialogTitle(form.sessionId, savedInputValue);
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
    ToastManager.normal(`${!sessionInfo.value.flags?.isStared ? '取消' : ''}收藏成功`);
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

  DialogManager.inputDialog(
    {
      icon: h(Edit),
      title: '编辑会话',
      content: '修改会话名称为',
    },
    {
      placeholder: '新对话名称',
      value: sessionInfo.value.title,
    }
  ).then((res) => {
    if (res.status && res.value) {
      // 确认修改
      dataStore.editDialogTitle(form.sessionId, res.value);
    }
  });
}

async function handleEditSystemPrompt() {
  if (!checkPermission()) return;

  // 请求远程 system_prompt
  try {
    const remoteSessionInfo = await genApi.Chat.sessionGet(form.sessionId);
    const res = await DialogManager.inputDialog(
      {
        icon: h(Control),
        title: '编辑系统提示词',
        subtitle: '注意：部分模型可能对系统提示词不敏感',
        content: '修改系统提示词为',
      },
      {
        placeholder: '系统提示词',
        value: remoteSessionInfo.data.data?.system_prompt || '',
      }
    );
    if (res.status && res.value) {
      // 确认修改
      const editResp = await dataStore.editDialogSystemPrompt(form.sessionId, res.value);
      if (editResp) ToastManager.normal('修改成功！');
      else ToastManager.danger('修改失败！');
    }
  } catch (_) {
    ToastManager.danger('请求失败，请稍后重试！');
  }
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

const { isSmallScreen } = useGlobal();
</script>

<template>
  <DialogDetail
    ref="dialog-detail"
    v-model:fix-dialog-to-bottom="form.fixDialogToBottom"
    v-model:input-user-input="form.inputValue"
    v-model:input-with-context="form.withContext"
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
    :is-small-screen="isSmallScreen"
    :model-dropdown="modelDropdown"
    :bot-dropdown="botDropdown"
    :input-model-name="form.modelName"
    :input-bot-id="form.botRoleId"
    :show-model-selector="inputCtrl.modelSelector"
    :show-bot-selector="inputCtrl.botSelector"
    :show-context-toggle="inputCtrl.contextToggle"
    @back="$emit('back')"
    @star="handleStarDialog"
    @share="handleShareDialog"
    @sync="handleSyncDialog"
    @edit="handleEditDialog"
    @edit-system-prompt="handleEditSystemPrompt"
    @delete="handleDeleteDialog"
    @action-tip-click="handleActionTipClick"
    @send="handleSendMessage"
    @model-select="
      (value) => {
        form.modelName = value;
      }
    "
    @bot-select="(v) => (form.botRoleId = v)"
  />
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