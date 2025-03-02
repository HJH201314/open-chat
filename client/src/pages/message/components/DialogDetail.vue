<script lang="ts" setup>
import variables from '@/assets/variables.module.scss';
import { useAutoScrollbar } from '@/commands/useAutoScrollbar';
import useGlobal from '@/commands/useGlobal';
import { DialogManager } from '@/components/dialog';
import CusSelect from '@/components/dropdown/CusSelect.vue';
import IconButton from '@/components/IconButton.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import showToast from '@/components/toast/toast';
import CusToggle from '@/components/toggle/CusToggle.vue';
import DialogMessage from '@/pages/message/components/DialogMessage.vue';
import { useDataStore } from '@/store/useDataStore';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import { ArrowUp, Back, CollapseTextInput, Delete, Edit, Refresh } from '@icon-park/vue-next';
import { until, useElementSize, useFocusWithin } from '@vueuse/core';
import { computed, nextTick, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useModelStore } from '@/store/useModelStore.ts';
import { storeToRefs } from 'pinia';
import { scrollToBottom } from '@/utils/element.ts';
import genApi from '@/api/gen-api.ts';
import useSession from '@/store/data/useSession.ts';
import ToastManager from '@/components/toast/ToastManager.ts';

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

const { session: sessionInfo, messages: messageList } = useSession(() => form.sessionId);

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
          scrollDialogListToBottom();
          focusTextArea();
        }, 50);
      }
    },
    { immediate: true },
  );
});

watchEffect(() => {
  form.withContext = sessionInfo.value.withContext ?? false;
  form.providerName = sessionInfo.value.provider || '';
  form.modelName = sessionInfo.value.model || '';
});

watch(
  () => form.withContext,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dataStore.toggleDialogContext(form.sessionId, newVal);
    }
  },
);

watch(
  () => [form.providerName, form.modelName],
  (newVal, oldVal) => {
    if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
      dataStore.changeDialogModel(form.sessionId, newVal[0], newVal[1]);
    }
  },
);

const smallInput = ref(false);
const inputPanelRef = useTemplateRef('input-panel');
const textAreaRef = useTemplateRef('input-textarea');
const { focused: inputFocused } = useFocusWithin(inputPanelRef);
const { height: panelHeight } = useElementSize(inputPanelRef);
const panelPlaceholderPx = computed(() => `${panelHeight.value + 8}px`);
const dialogListRef = useTemplateRef('dialog-list');
useAutoScrollbar(dialogListRef);
watchEffect(() => {
  if (inputFocused.value) smallInput.value = false;
});

function scrollDialogListToBottom() {
  nextTick(() => {
    dialogListRef.value && scrollToBottom(dialogListRef.value, 'smooth');
  });
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
  start: startReceivingMsg,
  stop: stopReceivingMsg,
  answer: answerMsg,
  think: thinkMsg,
  clear: clearReceivingMsg,
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
      onSaveUserMsg() {
        form.inputValue = '';
      },
      onFinish() {
        clearReceivingMsg();
        console.log(messageList.value);
        if (messageList.value.length < 3 && messageList.value[0] && !sessionInfo.value.title) {
          dataStore.editDialogTitle(form.sessionId, messageList.value[0].content);
        }
        scrollDialogListToBottom();
      },
    });
  } catch (e) {
    if (typeof e == 'string') {
      ToastManager.danger(e);
    }
  }
  nextTick(() => {
    scrollDialogListToBottom();
  });
}

// 从服务器同步数据
const refreshing = ref(false);

async function handleSyncDialog() {
  await DialogManager.commonDialog({
    title: '同步对话数据',
    subtitleStyle: {
      color: 'red',
    },
    content: '此举将会将本地数据与服务器数据同步<br/> 1. 删除本地可能存在的的多余数据<br /> 2. 保存远程新增数据<br/> 是否同步？',
    async confirmHandler(controller) {
      let nextPage = 1;
      while (nextPage) {
        try {
          const res = await genApi.Chat.messageListGet(form.sessionId, {
            page_num: nextPage,
            page_size: 20,
            sort_expr: 'id DESC',
          }, {
            signal: controller.signal,
          });
          // todo: handle messages
          if (res.data.data?.next_page) nextPage = res.data.data?.next_page;
          else break;
        } catch (_) {
          break;
        }
      }
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
    },
  ).then((res) => {
    if (res.status && res.value) {
      // 确认修改
      dataStore.editDialogTitle(form.sessionId, res.value);
    }
  });
}

function handleDeleteDialog() {
  DialogManager.commonDialog({
    title: '删除对话',
    content: `你将永久丢失与 ${sessionInfo.value.botRole} 的 对话 <${sessionInfo.value.title}> <br />这是不可逆的！`,
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

const { isSmallScreen } = useGlobal();
</script>

<template>
  <div :class="{ 'small-screen': isSmallScreen }" class="dialog-detail">
    <div class="dialog-detail-actions">
      <div class="dialog-detail-actions-area-left">
        <IconButton style="flex-shrink: 0" @click="$emit('back')">
          <Back size="16"/>
        </IconButton>
        <span class="dialog-detail-actions-title">
          {{ sessionInfo.title || '未命名对话' }}
        </span>
        <span class="dialog-detail-actions-subtitle"> {{ messageList.length }} 条消息 </span>
      </div>
      <IconButton style="flex-shrink: 0" @click="handleSyncDialog">
        <cus-spin :show="refreshing">
          <Refresh size="16"/>
        </cus-spin>
      </IconButton>
      <IconButton style="flex-shrink: 0" @click="handleEditDialog">
        <Edit size="16"/>
      </IconButton>
      <!--      <IconButton>-->
      <!--        <Share size="16" />-->
      <!--      </IconButton>-->
      <IconButton style="flex-shrink: 0" @click="handleDeleteDialog">
        <Delete size="16"/>
      </IconButton>
    </div>
    <div class="dialog-detail-display-area">
      <div ref="dialog-list" class="dialog-detail-dialogs">
        <!--   列表底部定位（此列表为 column-reverse）   -->
        <div id="bottom-line"></div>
        <!--   消息列表   -->
        <DialogMessage
          v-if="thinkMsg || answerMsg" id="bot-typing-box"
          :thinking="thinkMsg" :html-message="answerMsg" role="bot"/>
        <DialogMessage
          v-if="!isReceivingMsg && !isEmptySession && form.inputValue"
          id="user-typing-box"
          :markdown-render="false"
          :message="form.inputValue"
          role="user"
        />
        <DialogMessage
          v-for="item in messageList.toReversed()"
          :id="item.time"
          :key="item.id || item.time"
          :html-message="item.htmlContent"
          :message="item.content"
          :thinking="item.reasoningContent"
          :role="item.sender"
          :time="item.time"
        />
        <!--   列表顶部定位   -->
        <div id="top-line"></div>
      </div>
      <!-- 空空提示 -->
      <div v-if="isEmptySession" class="dialog-detail-empty">随便问点啥？</div>
      <!-- 输入面板 -->
      <div
        ref="input-panel"
        :class="{ 'dialog-detail-inputs--first': isEmptySession && !isSmallScreen, 'small-input': smallInput }"
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
              <CollapseTextInput size="16"/>
            </div>
          </div>
        </Transition>
        <textarea
          id="message-input"
          ref="input-textarea"
          v-model="form.inputValue"
          class="dialog-detail-inputs-textarea"
          placeholder="随便问点啥(●'◡'●)"
          @keydown="(e) => handleInputKeydown(e)"
        />
        <div class="dialog-detail-inputs-bar-send" @click="handleSendClick">
          <ArrowUp v-if="!isReceivingMsg" fill="white" size="16"/>
          <cus-spin v-else/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;

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
    background-color: rgba(255 255 255 / 80%);
    backdrop-filter: blur(10px);
    z-index: 1;

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
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 54rem;
    margin-inline: auto;
  }

  &-dialogs {
    width: 100%;
    height: 100%;
    padding-inline: 0.25rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    padding-bottom: v-bind(panelPlaceholderPx);

    > :not(:first-child) {
      margin-bottom: 0.5rem;
    }

    > :first-child {
      margin-bottom: auto;
    }

    // 最顶上的元素
    > :last-child {
      margin-top: 2.6rem;
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

  &-inputs {
    position: absolute;
    left: 0.25rem;
    right: 0.25rem;
    bottom: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background-color: color.scale($color-grey-100, $alpha: -20%);
    border-radius: 0.5rem;
    padding: 0.25rem;
    backdrop-filter: blur(10px);

    &.small-input {
      gap: 0;
    }

    &--first {
      top: 50%;
      left: 0.25rem;
      right: 0.25rem;
      bottom: unset;
      transform: translateY(calc(-50% + 2rem));
    }

    &-textarea {
      margin-inline: 0.25rem;
      background-color: transparent;
      width: calc(100% - 2rem);
      box-sizing: border-box;
      overflow: auto;
      outline: none;
      font-size: 16px;
      resize: none;
      height: 5rem;
      transition: all 0.2s $ease-out-circ;

      .small-input & {
        height: 2rem;

        &::placeholder {
          top: 50%;
          transform: translateY(-50%);
        }
      }

      &::placeholder {
        text-align: center;
        position: absolute;
        left: 0.25rem;
        transition: all 0.2s $ease-in-out-circ;
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

        .small-input & {
          transform: scale(0.875);
        }

        &:hover {
          background: $color-primary-darker;
        }
      }
    }
  }

  .audio-input {
    border-radius: 0.5rem;
    box-shadow: $box-shadow;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2.5rem;
    height: 10rem;
    background-color: white;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;

    &-speak {
      background-color: $color-primary;
      border-radius: 50%;
      cursor: pointer;
      position: relative;

      &:before {
        content: '';
        border-radius: 50%;
        position: absolute;
        inset: 0;
        background-color: color.scale($color-primary, $alpha: -20%);
        animation: recording 5s infinite;
      }
    }

    @keyframes recording {
      0% {
        scale: 1.1;
      }
      30% {
        scale: 1.2;
      }
      100% {
        scale: 1.1;
      }
    }

    &-status {
      position: absolute;
      left: 0.5rem;
      top: 0.5rem;
      border-radius: 0.25rem;
      padding: 0.125rem 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.25s $ease-out-circ;

      > .signal {
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
      }

      &--error {
        color: $color-danger;
        background-color: color.scale($color-danger, $alpha: -75%);

        > .signal {
          background-color: $color-danger;
        }
      }

      &--handling {
        color: $color-warning;
        background-color: color.scale($color-warning, $alpha: -75%);

        > .signal {
          background-color: $color-warning;
        }
      }

      &--ready {
        color: $color-primary;
        background-color: color.scale($color-primary, $alpha: -75%);

        > .signal {
          background-color: $color-primary;
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