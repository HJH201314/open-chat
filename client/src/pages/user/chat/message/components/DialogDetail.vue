<script lang="ts" setup>
import { DoubleDown, DoubleUp } from '@icon-park/vue-next';
import { until, useElementBounding, useEventListener, useScroll } from '@vueuse/core';
import { computed, provide, ref, useTemplateRef } from 'vue';
import DialogMessage from './DialogMessage.vue';
import IconButton from '@/components/IconButton.vue';
import type { MessageInfo } from '@/types/data.ts';
import { nextFrame, scrollToBottom, scrollToTop } from '@/utils/element.ts';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import {
  type DialogDetailEmits,
  type DialogDetailProps,
  type DialogDetailSlots,
  DialogDetailSlotsInjectionKey,
} from '@/pages/user/chat/message/components/types.ts';
import DialogExamProblem from '@/pages/user/chat/message/components/extension/DialogExamProblem.vue';
import Birthday from '@/components/extra/Birthday.vue';

const props = withDefaults(defineProps<DialogDetailProps>(), {
  emptyTip: '随便问点啥？',
  session: () => ({
    id: '',
    createAt: 0,
  }),
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
  userInput: '',
  modelDropdown: () => [],
});
const showAction = defineModel<boolean>('showAction', { default: true });
const showInput = defineModel<boolean>('showInput', { default: true });

const emit = defineEmits<DialogDetailEmits>();

const dialogDetailRef = useTemplateRef('dialog-detail');
const dialogListRef = useTemplateRef('dialog-list');
// 插槽类型定义，并通过依赖注入获取插槽 DOM 实例
defineSlots<DialogDetailSlots>();
const dialogActionSlot = ref<HTMLDivElement>();
const dialogInputSlot = ref<HTMLDivElement>();
provide(DialogDetailSlotsInjectionKey, {
  action: dialogActionSlot,
  input: dialogInputSlot,
  setActionRef(el) {
    dialogActionSlot.value = el.value;
  },
  setInputRef(el) {
    dialogInputSlot.value = el.value;
  },
});


const { height: panelHeight, y: panelY } = useElementBounding(() => dialogInputSlot.value);
const { height: actionHeight } = useElementBounding(() => dialogActionSlot.value);
const detailPaddingTop = computed(() => `${actionHeight.value + 8}px`);
const { height: detailHeight, y: detailY } = useElementBounding(() => dialogDetailRef.value);
const panelPlaceholderPx = computed(() => `${panelHeight.value + 16}px`);
const fixDialogToBottomPx = computed(() => `${panelHeight.value + 8}px`);
const scrollDialogToTopPx = computed(() => `${actionHeight.value + 8}px`);

const { arrivedState, directions: scrollDirections } = useScroll(dialogListRef, {
  throttle: 200,
  onScroll() {
    if (scrollDirections.top) {
      fixDialogToBottom.value = false;
      showAction.value = true;
    } else if (scrollDirections.bottom) {
      // 向下滚动时隐藏 dialog-action
      // scrollY.value > (dialogActionRef.value?.offsetHeight || 48) && (hideDialogAction.value = true);
    }
  },
});

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
  scrollDialogListToBottom('smooth', false);
}

function handleScrollDialogToTop() {
  fixDialogToBottom.value = false;
  dialogListRef.value && scrollToTop(dialogListRef.value, 'smooth');
}

// 滚动容器到最底部
async function scrollDialogListToBottom(behavior: ScrollBehavior = 'smooth', waitForPanel = true) {
  if (waitForPanel) {
    // 确保 panelHeight 已经被计算出来
    await until(panelHeight).toMatch((v) => v > 0);
  }
  dialogListRef.value && scrollToBottom(dialogListRef.value, behavior);
  // 平滑完全滚动到底部的关键操作：
  nextFrame(() => {
    // scroll again, because 某些情况下（如拉取新数据后） panelPlaceHolderPx 下一刻才会生效；此时固定使用 smooth 避免闪烁
    dialogListRef.value && scrollToBottom(dialogListRef.value, 'smooth');
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

// 当思考内容展开结束后，将思考内容滚动到顶部
function handleMessageThinkExpanded(index: number, expanded: boolean) {
  console.debug(index, expanded);
  if (expanded) {
    const msgEle = document.querySelector<HTMLDivElement>(`#dialog-detail-message-${index}`);
    if (msgEle) {
      // 展开时将思考内容滚动到顶部；若空间不足以展开，也会尽量滚动
      dialogListRef.value?.scrollTo({
        top: msgEle.offsetTop - actionHeight.value - 8,
        behavior: 'smooth',
      });
    }
  }
}

useEventListener(dialogDetailRef, 'mousemove', (e: MouseEvent) => {
  if (e.clientY < actionHeight.value) {
    showAction.value = true;
  }
});

defineExpose({
  scrollDialogListToBottom,
  isDialogListReachedBottom: arrivedState.bottom,
});
</script>

<template>
  <div ref="dialog-detail" :class="{ small: isSmallScreen }" class="dialog-detail">
    <Transition name="action-flow-in-out" type="animation">
      <div v-if="showAction" class="dialog-action">
        <slot name="action" :detail-arrived-state="arrivedState" />
      </div>
    </Transition>
    <Transition>
      <!-- 空空提示 -->
      <div v-if="isEmptySession" class="dialog-detail-empty">
        <div>{{ emptyTip }}</div>
        <slot name="empty" />
      </div>
    </Transition>
    <!-- 对话区域 -->
    <div ref="dialog-list" class="dialog-detail-display-area">
      <!-- 对话列表固定中间 -->
      <div class="dialog-detail-dialogs">
        <DialogMessage
          v-for="(item, index) in messages"
          :id="`dialog-detail-message-${index}`"
          :key="item.id"
          :message="getMsgAnswer(item)"
          :thinking="getMsgThinking(item)"
          :html-message="getMsgAnswerRendered(item)"
          :streaming="getMsgStreaming(item)"
          :model="item.model"
          :role="item.sender"
          :time="new Date(item.time).toLocaleString()"
          @think-expand="handleMessageThinkExpand"
          @think-expanded="handleMessageThinkExpanded(index, $event)"
        >
          <template #extra>
            <DialogExamProblem :item="item" />
            <a v-if="item.extra?.['exam']" size="large" target="_self" :href="`/tue/exam/${item.extra['exam']['id']}`"
              >立即前往
            </a>
            <Birthday
              v-if="
                item.extra?.['birthday-gift'] &&
                typeof item.extra?.['birthday-gift'] == 'string' &&
                item.extra?.['birthday-gift']?.startsWith('gift:')
              "
              :info="item.extra?.['birthday-gift']"
            />
            <div v-if="item.extra?.['tooltip']">{{ item.extra?.['tooltip'] }}</div>
          </template>
        </DialogMessage>
        <!--   消息列表   -->
        <DialogMessage
          v-show="!isReceivingMsg && !isEmptySession && userInput"
          id="user-typing-box"
          key="user-typing-box"
          :markdown-render="false"
          :message="userInput"
          role="user"
        ></DialogMessage>
      </div>
      <Transition name="scroll-flow-in-out-top" type="animation">
        <IconButton
          v-if="!arrivedState.top && messages.length"
          class="dialog-detail-scroll-to-top"
          color="#666666"
          type="secondary"
          shadow
          @click="handleScrollDialogToTop"
        >
          <DoubleUp size="16" />
        </IconButton>
      </Transition>
      <Transition name="scroll-flow-in-out-bottom" type="animation">
        <IconButton
          v-if="!fixDialogToBottom && !arrivedState.bottom && messages.length"
          class="dialog-detail-scroll-to-bottom"
          color="#666666"
          type="secondary"
          shadow
          @click="handleFixDialogToBottom"
        >
          <DoubleDown size="16" />
        </IconButton>
      </Transition>
      <div v-if="showInput">
        <slot name="input" :detail-arrived-state="arrivedState" />
      </div>
      <!-- 输入面板 -->
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
@use '@/assets/animations';

$dialog-max-width: 54rem;

.dialog-detail {
  position: relative;

  .dialog-action {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
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
    padding-top: v-bind(detailPaddingTop);
    display: flex;
    flex-direction: column;
    margin-bottom: v-bind(panelPlaceholderPx);

    > :not(:first-child) {
      margin-top: 1rem;
    }

    > :first-child {
      margin-top: auto;
    }
  }

  &-empty {
    position: absolute;
    width: 100%;
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary-darker);
    text-align: center;
    top: calc(50%);
    transform: translateY(calc(-50% - 2.5em));
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &-scroll-to-top {
    position: absolute;
    right: 0.5rem;
    top: v-bind(scrollDialogToTopPx);
    z-index: 3;
  }

  &-scroll-to-bottom {
    position: absolute;
    right: 0.5rem;
    bottom: v-bind(fixDialogToBottomPx);
    z-index: 3;
    //transform: scale(0.9) translateX(-50%);
  }

  :global(.cus-code-container > section) {
    position: sticky;
    top: 2.75rem;
    z-index: 1;
  }
}

/* 从 TranslateX(-100%) 到 TranslateX(0) */
.action-flow-in-out {
  &-enter-active {
    animation: action-flow-in-out-anim 0.2s ease-out;
  }

  &-leave-active {
    animation: action-flow-in-out-anim 0.2s ease-in reverse;
  }

  @keyframes action-flow-in-out-anim {
    0% {
      opacity: 1;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.scroll-flow-in-out-bottom {
  &-enter-active {
    animation: scroll-flow-in-out-bottom-anim 0.2s $ease-out-circ;
  }

  &-leave-active {
    animation: scroll-flow-in-out-bottom-anim 0.2s $ease-out-circ reverse;
  }

  @keyframes scroll-flow-in-out-bottom-anim {
    0% {
      transform: translateY(120%);
    }
    100% {
      transform: translateY(0);
    }
  }
}

.scroll-flow-in-out-top {
  &-enter-active {
    animation: scroll-flow-in-out-top-anim 0.2s $ease-out-circ;
  }

  &-leave-active {
    animation: scroll-flow-in-out-top-anim 0.2s $ease-out-circ reverse;
  }

  @keyframes scroll-flow-in-out-top-anim {
    0% {
      transform: translateY(-120%);
    }
    100% {
      transform: translateY(0);
    }
  }
}
</style>
