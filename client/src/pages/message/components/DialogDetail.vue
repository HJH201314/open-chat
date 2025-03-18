<script lang="ts" setup>
import { DoubleDown } from '@icon-park/vue-next';
import { until, useElementSize, useScroll } from '@vueuse/core';
import { computed, useTemplateRef, watch } from 'vue';
import DialogAction from './DialogAction.vue';
import DialogInput from './DialogInput.vue';
import DialogMessage from './DialogMessage.vue';
import IconButton from '@/components/IconButton.vue';
import type { MessageInfo } from '@/types/data';
import { scrollToBottom } from '@/utils/element.ts';
import type { DropdownOption } from '@/components/dropdown/types.ts';
import LoadingModal from '@/components/modal/LoadingModal.vue';

interface Props {
  dialogId: string;
  title: string;
  messages: MessageInfo[];
  messageCount: number;
  hasPermission: boolean;
  isLogin: boolean;
  messageSyncing: boolean;
  isReceivingMsg: boolean;
  answerMsgId: number; // 用于判断当前正在输出的消息，进行异化展示
  answerMsg: string;
  thinkMsg: string;
  isSmallScreen: boolean;
  providerDropdown: DropdownOption[];
}

const props = withDefaults(defineProps<Props>(), {
  dialogId: '',
  title: '',
  messages: () => [],
  messageCount: 0,
  hasPermission: true,
  isLogin: false,
  messageSyncing: false,
  isReceivingMsg: false,
  answerMsgId: 0,
  answerMsg: '',
  thinkMsg: '',
  isSmallScreen: false,
  providerDropdown: () => [],
});

const inputModelName = defineModel<string>('inputModelName', { default: '' });
const inputWithContext = defineModel<boolean>('inputWithContext', { default: true });
const inputUserInput = defineModel<string>('inputUserInput', { default: '' });

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'share'): void;
  (e: 'sync'): void;
  (e: 'edit'): void;
  (e: 'editSystemPrompt'): void;
  (e: 'delete'): void;
  (e: 'actionTipClick'): void;
  (e: 'send'): void;
  (e: 'modelSelect', path: string[]): void;
}>();

const dialogDetailRef = useTemplateRef('dialog-detail');
const dialogListRef = useTemplateRef('dialog-list');
const inputPanelRef = useTemplateRef('input-panel');

const { height: panelHeight } = useElementSize(inputPanelRef);
const panelPlaceholderPx = computed(() => `${panelHeight.value + 12}px`);
const fixDialogToBottomPx = computed(() => `${panelHeight.value + 12}px`);

const { arrivedState, directions: scrollDirections } = useScroll(dialogListRef, {
  onScroll() {
    if (scrollDirections.top) {
      fixDialogToBottom.value = false;
    }
  },
});

watch(
  () => props.dialogId,
  async (newDialogId) => {
    if (newDialogId != '') {
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

const fixDialogToBottom = defineModel<boolean>('fixDialogToBottom', { default: true });
const isEmptySession = computed(() => props.messages.length === 0);

function getMsgAnswerRendered(item: MessageInfo) {
  if (item.id === props.answerMsgId) return props.answerMsg;
  return item.htmlContent || '';
}

function getMsgAnswer(item: MessageInfo) {
  if (item.id === props.answerMsgId) return props.answerMsg;
  return item.content || '';
}

function getMsgThinking(item: MessageInfo) {
  if (item.id === props.answerMsgId) return props.thinkMsg;
  return item.reasoningContent || '';
}

function getMsgStreaming(item: MessageInfo) {
  return item.id === props.answerMsgId && props.isReceivingMsg;
}

function handleFixDialogToBottom() {
  fixDialogToBottom.value = true;
  scrollDialogListToBottom('smooth');
}

function scrollDialogListToBottom(behavior: ScrollBehavior = 'smooth') {
  dialogListRef.value && scrollToBottom(dialogListRef.value, behavior);
}

function handleMessageThinkExpand(expand: boolean) {
  if (expand) {
    dialogListRef.value?.style.setProperty('overflow-y', 'hidden');
    setTimeout(() => {
      dialogListRef.value?.style.setProperty('overflow-y', 'auto');
    }, 250);
  }
}

defineExpose({
  scrollDialogListToBottom,
});
</script>

<template>
  <div ref="dialog-detail" :class="{ small: isSmallScreen }" class="dialog-detail">
    <DialogAction
      :title="title"
      :message-count="messageCount"
      :has-permission="hasPermission"
      :is-login="isLogin"
      :message-syncing="messageSyncing"
      @back="$emit('back')"
      @share="$emit('share')"
      @sync="$emit('sync')"
      @edit="$emit('edit')"
      @edit-system-prompt="$emit('editSystemPrompt')"
      @delete="$emit('delete')"
      @action-tip-click="$emit('actionTipClick')"
    />
    <!-- 空空提示 -->
    <div v-if="isEmptySession" class="dialog-detail-empty">随便问点啥？</div>
    <!-- 对话区域 -->
    <div ref="dialog-list" class="dialog-detail-display-area">
      <!-- 对话列表固定中间 -->
      <div class="dialog-detail-dialogs">
        <!--   消息列表   -->
        <DialogMessage
          v-show="!isReceivingMsg && !isEmptySession && inputUserInput"
          id="user-typing-box"
          :markdown-render="false"
          :message="inputUserInput"
          role="user"
        />
        <DialogMessage
          v-for="item in messages"
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
        v-if="!fixDialogToBottom && !arrivedState.bottom && messages.length"
        class="dialog-detail-scroll-to-bottom"
        type="secondary"
        @click="handleFixDialogToBottom"
      >
        <DoubleDown size="16" />
      </IconButton>
      <!-- 输入面板 -->
      <DialogInput
        ref="input-panel"
        v-model:input-user-input="inputUserInput"
        v-model:input-with-context="inputWithContext"
        :input-model-name="inputModelName"
        :provider-dropdown="providerDropdown"
        :is-small-screen="isSmallScreen"
        :is-empty-session="isEmptySession"
        :is-receiving-msg="isReceivingMsg"
        :message-syncing="messageSyncing"
        @send="$emit('send')"
        @model-select="$emit('modelSelect', $event)"
      />
    </div>
    <LoadingModal
      :visible="messageSyncing"
      :teleport-to="dialogDetailRef"
      color="var(--color-primary)"
      tip="努力加载中..."
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

$dialog-max-width: 54rem;

.dialog-detail {
  position: relative;

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
}
</style>
