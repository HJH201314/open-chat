<script lang="ts" setup>
import variables from '@/assets/variables.module.scss';
import { useAutoScrollbar } from '@/commands/useAutoScrollbar';
import useGlobal from '@/commands/useGlobal';
import { DialogManager } from '@/components/dialog';
import CusSelect from '@/components/dropdown/CusSelect.vue';
import IconButton from '@/components/IconButton.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import CusToggle from '@/components/toggle/CusToggle.vue';
import DialogMessage from '@/pages/message/components/DialogMessage.vue';
import { useDataStore } from '@/store/data/useDataStore.ts';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import { ArrowUp, Back, CollapseTextInput, Control, Delete, DoubleDown, Edit, Refresh } from '@icon-park/vue-next';
import { until, useElementSize, useFocusWithin, useScroll, watchArray } from '@vueuse/core';
import { computed, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useModelStore } from '@/store/useModelStore.ts';
import { storeToRefs } from 'pinia';
import { scrollToBottom } from '@/utils/element.ts';
import useSession from '@/store/data/useSession.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import router from '@/plugins/router.ts';
import CusTextarea from '@/components/textarea/CusTextarea.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import type { MessageInfo } from '@/types/data.ts';
import genApi from '@/api/gen-api.ts';
import CusTooltip from '@/components/tooltip/CusTooltip.vue';

interface DialogDetailProps {
  dialogId: string;
}

const props = withDefaults(defineProps<DialogDetailProps>(), {
  dialogId: '',
});

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const dataStore = useDataStore();
const userStore = useUserStore();
const settingStore = useSettingStore();
const { providerDropdown } = storeToRefs(useModelStore());

const isEmptySession = computed(() => messageList.value.length == 0);

const form = reactive({
  sessionId: ref(''),
  withContext: ref(false),
  providerName: ref(''),
  modelName: ref(''),
  inputValue: ref(''),
});

const { session: sessionInfo, messages: messageList, syncMessages } = useSession(() => form.sessionId);
watchArray(messageList, (newVal, oldVal) => {
  // 消息列表变化时，滚动到底部（消息增加 1/2 时平滑，增加多条时立即）
  if (newVal.length) {
    scrollDialogListToBottom(newVal.length - oldVal.length <= 2 ? 'smooth' : 'instant');
  }
});

onMounted(() => {
  watch(
    () => props.dialogId,
    async (v) => {
      if (props.dialogId != '') {
        form.sessionId = v;
        // 等待到 panelHeight 被成功计算、插入占位高度并 nextTick 渲染完成后
        await until(panelHeight).toMatch((v) => v > 0);
        setTimeout(() => {
          // 滚动到列表底部并默认聚焦输入框
          scrollDialogListToBottom('instant');
        }, 50);
      }
    },
    { immediate: true }
  );
});

// session 变化成功，进行同步
watch(
  () => sessionInfo.value,
  (newSession) => {
    const { id: newSessionId, flags } = newSession;
    // 如果信息不存在，route 返回
    if (!newSessionId) router.replace('/chat/message');

    if (flags?.needSync) {
      if (!userStore.isLogin || (newSession.userId && newSession.userId != userStore.userId)) {
        ToastManager.danger('无权限，无法执行同步~');
        return;
      }
      messageSyncing.value = true;
      syncMessages(newSessionId)
        .then((res) => {
          if (res) {
            dataStore.updateSessionFlags(newSessionId, { needSync: false });
          }
        })
        .finally(() => {
          messageSyncing.value = false;
        });
    }
  },
  { deep: false }
);

// 加载 session 信息到 form
watchEffect(() => {
  form.withContext = sessionInfo.value.withContext ?? false;
  form.providerName = sessionInfo.value.provider || '';
  form.modelName = sessionInfo.value.model || '';
});

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
  () => [form.providerName, form.modelName],
  (newVal, oldVal) => {
    if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
      dataStore.changeDialogModel(form.sessionId, newVal[0], newVal[1]);
    }
  }
);

const smallInput = ref(false);
const inputPanelRef = useTemplateRef('input-panel');
const textAreaRef = useTemplateRef('input-textarea');
const { focused: inputFocused } = useFocusWithin(inputPanelRef);
const { height: panelHeight } = useElementSize(inputPanelRef);
const panelPlaceholderPx = computed(() => `${panelHeight.value + 12}px`);
const fixDialogToBottomPx = computed(() => `${panelHeight.value + 12}px`);
const dialogDetailRef = useTemplateRef('dialog-detail');
const dialogListRef = useTemplateRef('dialog-list');
const { arrivedState, directions: scrollDirections } = useScroll(dialogListRef, {
  onScroll() {
    if (scrollDirections.top) {
      dialogFixedToBottom.value = false;
    }
  },
});
useAutoScrollbar(dialogListRef);
watchEffect(() => {
  if (inputFocused.value) smallInput.value = false;
});

function scrollDialogListToBottom(behavior: ScrollBehavior = 'smooth') {
  dialogListRef.value && scrollToBottom(dialogListRef.value, behavior);
}

function focusTextArea() {
  textAreaRef.value?.focus();
}

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.isComposing && settingStore.settings.fastSendKey == 'enter') {
    if (!e.shiftKey && !e.ctrlKey) {
      // 回车发送
      handleSendMessage();
      e.preventDefault();
    }
  }
}

function handleSendClick() {
  if (!isReceivingMsg.value) {
    handleSendMessage();
  } else {
    stopReceivingMsg();
  }
}

function handleModelSelect(selectPath: string[]) {
  if (selectPath.length == 2) {
    form.providerName = selectPath[0];
    form.modelName = selectPath[1];
  }
  focusTextArea();
}

const {
  msgId: answerMsgId,
  start: startReceivingMsg,
  stop: stopReceivingMsg,
  answer: answerMsg,
  think: thinkMsg,
  isStreaming: isReceivingMsg,
} = dataStore.useSendMessageText();

async function handleSendMessage() {
  if (!userStore.isLogin) {
    ToastManager.warning('请先登录！');
    return;
  }
  if (!form.sessionId || !form.inputValue) return;
  if (isReceivingMsg.value) {
    ToastManager.warning('不能同时回答多个问题哦！');
    return;
  }
  // 发送消息
  try {
    await startReceivingMsg(form.sessionId, form.inputValue, {
      onPreSaveMsg() {
        form.inputValue = '';
        dialogFixedToBottom.value = true;
        return;
      },
      onThinkMessage() {
        dialogFixedToBottom.value && scrollDialogListToBottom('smooth');
      },
      onMessage() {
        dialogFixedToBottom.value && scrollDialogListToBottom('smooth');
      },
      onFinish() {
        if (messageList.value.length < 3 && messageList.value[0] && !sessionInfo.value.title) {
          dataStore.editDialogTitle(form.sessionId, messageList.value[0].content);
        }
      },
    });
  } catch (e) {
    if (typeof e == 'string') {
      ToastManager.danger(e);
    }
  }
}

function getMsgAnswerRendered(item: MessageInfo) {
  if (item.id == answerMsgId.value) return answerMsg.value;
  return item.htmlContent || '';
}

function getMsgAnswer(item: MessageInfo) {
  if (item.id == answerMsgId.value) return answerMsg.value;
  return item.content || '';
}

function getMsgThinking(item: MessageInfo) {
  if (item.id == answerMsgId.value) return thinkMsg.value;
  return item.reasoningContent || '';
}

function getMsgStreaming(item: MessageInfo) {
  return item.id == answerMsgId.value && isReceivingMsg.value;
}

// 从服务器同步数据
const messageSyncing = ref(false);

async function handleSyncDialog() {
  if (!userStore.isLogin) {
    ToastManager.danger('请先登录~');
    return;
  }
  const currentSessionId = form.sessionId;
  // 消息列表为空，直接进行同步
  if (!messageList.value.length) {
    messageSyncing.value = true;
    try {
      await syncMessages(currentSessionId);
    } finally {
      messageSyncing.value = false;
    }
    return;
  }
  DialogManager.createDialog({
    title: '同步对话数据',
    content:
      '此操作将会将本地缓存数据与服务器数据同步：<br/>&nbsp;&nbsp;1. 数据以服务器数据为准<br />&nbsp;&nbsp;2. 重新渲染并缓存消息<br/>',
    subtitle: '此操作不可逆，确认继续吗？',
    async confirmHandler(controller) {
      await syncMessages(currentSessionId, controller);
    },
  });
}

function handleEditDialog() {
  DialogManager.inputDialog(
    {
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
  // 请求远程 system_prompt
  try {
    const remoteSessionInfo = await genApi.Chat.sessionGet(form.sessionId);
    const res = await DialogManager.inputDialog(
      {
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
      if (editResp) ToastManager.success('修改成功！');
      else ToastManager.danger('修改失败！');
    }
  } catch (_) {
    ToastManager.danger('请求失败，请稍后重试！');
  }
}

function handleDeleteDialog() {
  DialogManager.commonDialog({
    title: '删除对话',
    subtitle: '这是不可逆的！',
    content: `确认删除与 ${sessionInfo.value.botRole} 的 对话 <${sessionInfo.value.title}> <br />`,
    confirmButtonProps: {
      backgroundColor: variables.colorDanger,
    },
  }).then((res) => {
    if (res) {
      dataStore.delDialog(form.sessionId); // 本地 + 远程 删除
      emit('back');
    }
  });
}

function handleMessageThinkExpand(expand: boolean) {
  if (expand) {
    dialogListRef.value?.style.setProperty('overflow-y', 'hidden');
    setTimeout(() => {
      dialogListRef.value?.style.setProperty('overflow-y', 'auto');
    }, 250);
  }
}

const dialogFixedToBottom = ref(false);

function handleFixDialogToBottom() {
  dialogFixedToBottom.value = true;
  scrollDialogListToBottom('smooth');
}

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div ref="dialog-detail" :class="{ small: isSmallScreen }" class="dialog-detail">
    <LoadingModal
      :visible="messageSyncing"
      :teleport-to="dialogDetailRef"
      color="var(--color-primary)"
      tip="努力加载中..."
    ></LoadingModal>
    <div :class="{ shadow: !arrivedState.top }" class="dialog-detail-actions">
      <div class="dialog-detail-actions-area-left">
        <IconButton type="secondary" style="flex-shrink: 0" @click="$emit('back')">
          <Back size="16" />
        </IconButton>
        <span class="dialog-detail-actions-title">
          {{ sessionInfo.title || '未命名对话' }}
        </span>
        <span class="dialog-detail-actions-subtitle"> {{ messageList.length }} 条消息 </span>
      </div>
      <CusTooltip text="刷新对话列表" position="bottom">
        <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="handleSyncDialog">
          <cus-spin :show="messageSyncing">
            <Refresh size="16" />
          </cus-spin>
        </IconButton>
      </CusTooltip>
      <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="handleEditDialog">
        <Edit size="16" />
      </IconButton>
      <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="handleEditSystemPrompt">
        <Control size="16" />
      </IconButton>
      <!--      <IconButton>-->
      <!--        <Share size="16" />-->
      <!--      </IconButton>-->
      <IconButton type="secondary" color="danger" style="flex-shrink: 0" @click="handleDeleteDialog">
        <Delete size="16" />
      </IconButton>
    </div>
    <!-- 空空提示 -->
    <div v-if="isEmptySession" class="dialog-detail-empty">随便问点啥？</div>
    <!-- 对话区域 -->
    <div ref="dialog-list" class="dialog-detail-display-area">
      <!-- 对话列表固定中间 -->
      <div class="dialog-detail-dialogs">
        <!--   消息列表   -->
        <DialogMessage
          v-show="!isReceivingMsg && !isEmptySession && form.inputValue"
          id="user-typing-box"
          :markdown-render="false"
          :message="form.inputValue"
          role="user"
        />
        <DialogMessage
          v-for="item in messageList"
          :key="item.id"
          :message="getMsgAnswer(item)"
          :thinking="getMsgThinking(item)"
          :html-message="getMsgAnswerRendered(item)"
          :streaming="getMsgStreaming(item)"
          :role="item.sender"
          :time="new Date(item.time).toLocaleString()"
          @think-expand="handleMessageThinkExpand"
        />
      </div>
      <IconButton
        v-if="!dialogFixedToBottom && !arrivedState.bottom && messageList.length"
        class="dialog-detail-scroll-to-bottom"
        type="secondary"
        @click="handleFixDialogToBottom"
      >
        <DoubleDown size="16" />
      </IconButton>
      <!-- 输入面板 -->
      <div
        ref="input-panel"
        :class="{
          'dialog-detail-inputs--first': isEmptySession && !isSmallScreen,
          'small-input': smallInput,
          hide: messageSyncing,
        }"
        class="dialog-detail-inputs"
      >
        <Transition name="slide-top-fade">
          <div v-show="!smallInput" class="dialog-detail-inputs-bar">
            <CusSelect
              v-model="form.modelName"
              :label-render-text="(_, path) => path?.map((o) => o.label)?.join('/')"
              :options="providerDropdown"
              :toggle-style="{ opacity: 0.75 }"
              position="top"
              style="font-size: 0.75rem"
              @select="(v, o, path) => handleModelSelect(path)"
            />
            <CusToggle
              v-model="form.withContext"
              highlight
              label="上下文"
              style="font-size: 0.75rem; opacity: 0.75"
            ></CusToggle>
            <div class="dialog-detail-inputs-bar-expand" @click="smallInput = !smallInput">
              <CollapseTextInput size="16" />
            </div>
          </div>
        </Transition>
        <CusTextarea
          ref="input-textarea"
          v-model="form.inputValue"
          :textarea-attr="{ placeholder: '随便问点啥(●\'◡\'●)' }"
          class="dialog-detail-inputs-textarea"
          @keydown="handleInputKeydown"
        />
        <div class="dialog-detail-inputs-bar-send" @click="handleSendClick">
          <ArrowUp class="sending" v-if="!isReceivingMsg" fill="white" size="16" />
          <cus-spin v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;

$dialog-max-width: 54rem;

.dialog-detail {
  position: relative;

  &-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(255 255 255 / 75%);
    backdrop-filter: blur(10px);
    z-index: 1;

    &.shadow {
      box-shadow: $box-shadow-shallower;
    }

    &-area-left {
      margin-right: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    &-title {
      text-align: center;
      font-weight: bold;
      font-size: 20px;

      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    &-subtitle {
      font-size: 0.75rem;
      flex-shrink: 0;
    }
  }

  &-display-area {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    scrollbar-gutter: stable;

    .small & {
      padding-inline: 0.5rem;
    }
  }

  &-dialogs {
    width: 100%;
    max-width: $dialog-max-width;
    margin-inline: auto;
    padding-inline: 0.25rem;
    padding-top: 3rem;
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: v-bind(panelPlaceholderPx);

    > :not(:first-child) {
      margin-bottom: 0.5rem;
    }

    > :first-child {
      margin-bottom: auto;
    }
  }

  &-empty {
    position: absolute;
    width: 100%;
    font-size: 2rem;
    font-weight: bold;
    color: $color-primary-darker;
    text-align: center;
    top: calc(50%);
    transform: translateY(calc(-50% - 2.5em));
  }

  &-scroll-to-bottom {
    position: absolute;
    left: 50%;
    bottom: v-bind(fixDialogToBottomPx);
    transform: scale(0.9) translateX(-50%);
  }

  &-inputs {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: calc(100% - 2rem);
    max-width: $dialog-max-width;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background-color: color.scale($color-grey-100, $alpha: -20%);
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 0.25rem;
    backdrop-filter: blur(10px);
    box-shadow: $box-shadow;
    transition: all 0.2s $ease-out-circ;

    &:focus-within {
      bottom: 0.35rem;
      border-radius: 0.75rem;
      box-shadow: $next-box-shadow-medium;
    }

    &.hide {
      height: 0;
    }

    &.small-input {
      gap: 0;
    }

    &--first {
      top: 50%;
      left: 50%;
      bottom: unset !important;
      border-radius: 0.75rem;
      transform: translate(-50%, calc(-50% + 2rem));
    }

    &-textarea {
      margin-inline: 0.25rem;
      width: calc(100% - 2.5rem);
      height: 5rem;
      box-sizing: border-box;
      transition: all 0.2s $ease-out-circ;

      .small-input & {
        width: calc(100% - 2.25rem);
        height: 2rem;
        display: flex;
        align-items: center;
      }
    }

    &-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;

      &-icon {
        width: 30px;
        height: 30px;
        padding: 3px;
        aspect-ratio: 1;
        cursor: pointer;
        border-radius: 0.5rem;

        &:hover {
          background-color: $color-grey-200;
        }
      }

      &-expand {
        margin-left: auto;
      }

      &-send {
        position: absolute;
        right: 0.25rem;
        bottom: 0.25rem;
        width: 2rem;
        height: 2rem;
        margin-left: auto;
        background: $color-primary;
        color: white;
        border-radius: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s $ease-out-circ;
        overflow: hidden;

        .small-input & {
          transform: scale(0.875);
        }

        &:hover, &:active {
          background: $color-primary-darker;
          box-shadow: $box-shadow-deeper;

          > .sending {
            animation: send 1.5s infinite;
            @keyframes send {
              0% {
                transform: translateY(150%);
              }
              30%, 70% {
                transform: translateY(0%);
              }
              100% {
                transform: translateY(-200%);
              }
            }
          }
        }

        &:active {
          box-shadow: $box-shadow-shallower;
          transform: scale(0.95);
        }
      }
    }
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

@keyframes recording {
  0% {
    background-size: 100%;
  }
  30% {
    background-size: 110%;
  }
  100% {
    background-size: 100%;
  }
}
</style>