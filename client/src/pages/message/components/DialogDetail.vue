<script lang="ts" setup>
import api from '@/api';
import variables from '@/assets/variables.module.scss';
import { useAutoScrollbar } from '@/commands/useAutoScrollbar';
import DiliButton from '@/components/button/DiliButton.vue';
import { DialogManager } from '@/components/dialog';
import CusDropdown from '@/components/dropdown/CusDropdown.vue';
import IconButton from '@/components/IconButton.vue';
import CusCircularProgress from '@/components/progress/CusCircularProgress.vue';
import Spinning from '@/components/spinning/Spinning.vue';
import showToast from '@/components/toast/toast';
import ToastManager from '@/components/toast/ToastManager';
import CusToggle from '@/components/toggle/CusToggle.vue';
import DialogMessage from '@/pages/message/components/DialogMessage.vue';
import { useDataStore } from '@/store/useDataStore';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import type { DialogInfo, MsgInfo } from '@/types/data';
import { Acoustic, ArrowUp, Back, CollapseTextInput, Delete, Edit, Voice } from '@icon-park/vue-next';
import {
  useDevicesList,
  useElementSize,
  useFocusWithin,
  useMousePressed,
  useTextareaAutosize,
  useUserMedia,
} from '@vueuse/core';
import { computed, nextTick, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';

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

const dialogInfo = ref<DialogInfo>({} as DialogInfo);
const messageList = ref([] as MsgInfo[]);

const form = reactive({
  sessionId: ref(''),
  withContext: ref(false),
  dialogModel: ref('DeepSeek'),
  inputValue: ref(''),
  outputValue: ref(''),
});

function scrollToBottom() {
  document.querySelector(`#bottom-line`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  });
}

watch(
  () => props.dialogId,
  async (v) => {
    if (props.dialogId != '') {
      dialogInfo.value = dataStore.getDialogInfo(v);
      form.sessionId = v;
      form.withContext = dialogInfo.value.withContext ?? false;
      form.dialogModel = dialogInfo.value.model ?? 'DeepSeek';
      messageList.value = dataStore.getMessageList(v);
      nextTick(() => {
        // 滚动到列表底部并默认聚焦输入框
        scrollToBottom();
        (document.querySelector('#message-input') as HTMLTextAreaElement)?.focus();
      });
    }
  },
  { immediate: true }
);

watch(
  () => form.withContext,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dataStore.toggleDialogContext(form.sessionId, newVal);
    }
  }
);

watch(
  () => form.dialogModel,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dataStore.changeDialogModel(form.sessionId, newVal);
    }
  }
);

const smallInput = ref(true);
const inputPanelRef = useTemplateRef('input-panel');
const { focused: inputFocused } = useFocusWithin(inputPanelRef);
const { height: panelHeight } = useElementSize(inputPanelRef);
const dialogListRef = useTemplateRef('dialog-list');
useAutoScrollbar(dialogListRef);
watchEffect(() => {
  if (inputFocused.value) smallInput.value = false;
});

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && settingStore.settings.fastSendKey == 'enter') {
    if (e.shiftKey || e.ctrlKey) {
      form.inputValue += '\n';
    } else {
      if (e.isComposing) return;
      handleSendMessage();
    }
    e.preventDefault();
  }
}

function handleSendMessage() {
  if (!userStore.isLogin) {
    showToast({ text: '请先登录！', type: 'warning' });
    return;
  }
  if (!form.sessionId || !form.inputValue) return;
  dataStore.sendMessageText(form.sessionId, form.inputValue, {
    onSaveUserMsg() {
      messageList.value = dataStore.getMessageList(form.sessionId);
    },
    onMessage(msg: string) {
      form.outputValue += msg;
      if (form.outputValue.match(/^\[title:(.+?)]/)) {
        form.outputValue = form.outputValue.replace(/^\[title:(.+?)]/, '');
      }
    },
    onFinish(fullMessage: string) {
      form.outputValue = '';
      messageList.value = dataStore.getMessageList(form.sessionId);
      scrollToBottom();
    },
  });
  form.inputValue = '';
  nextTick(() => {
    scrollToBottom();
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
      value: dialogInfo.value.title,
    }
  ).then((res) => {
    if (res.status && res.value) {
      // 确认修改
      dataStore.editDialogTitle(dialogInfo.value.id, res.value);
    }
  });
}

function handleDeleteDialog() {
  DialogManager.commonDialog({
    title: '删除对话',
    content: `你将永久丢失与 ${dialogInfo.value.botRole} 的 对话 <${dialogInfo.value.title}> <br />这是不可逆的！`,
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

/* 音频录制相关 */
// 需要https或localhost才能测试
const {
  audioInputs: microphones, // 麦克风设备列表
} = useDevicesList({
  requestPermissions: true,
});
const currentMicrophone = computed(() => microphones.value[0]?.deviceId); // 取首个设备为当前设备

const {
  stream: mediaStream,
  start: startStream,
  stop: stopStream,
} = useUserMedia({
  constraints: {
    video: false, // 不获取视频流
    audio: {
      deviceId: currentMicrophone.value, // 传入麦克风设备ID
      channelCount: 1, // 单声道
    },
  },
});

let mediaRecorder: MediaRecorder;
let chunks: BlobPart[] = [];
const audioTimeout = ref(60);
const audioInterval = ref();
const audioHandling = ref(false);

const audioButtonRef = ref<HTMLDivElement>();
const audioButtonPress = useMousePressed({
  target: audioButtonRef,
  capture: true,
  initialValue: false,
});

watch(
  () => audioButtonPress.pressed.value,
  (p) => {
    console.log(audioButtonPress, p);
    if (p) {
      startVoiceRecording();
    } else {
      audioTimeout.value = 60;
      stopVoiceRecording();
    }
  }
);

function startVoiceRecording() {
  if (microphones.value.length <= 0) {
    ToastManager.warning('无音频输入设备！');
    return;
  }
  if (!userStore.isLogin) {
    ToastManager.warning('请先登录！');
    return;
  }
  startStream()
    .then((s) => {
      if (s) {
        mediaRecorder = new MediaRecorder(s, {
          audioBitsPerSecond: 16000,
        });
        chunks = [];

        // 开始录制
        mediaRecorder.start();

        // 倒计时60秒，超时自动停止
        audioTimeout.value = 60;
        clearInterval(audioInterval.value);
        audioInterval.value = setInterval(() => {
          // 如果已经关闭就清除倒计时
          if (!mediaRecorder.stream.active) {
            clearInterval(audioInterval.value);
            return;
          }
          if (audioTimeout.value <= 0) {
            clearInterval(audioInterval.value);
            mediaRecorder.stop();
          } else {
            audioTimeout.value = audioTimeout.value - 1;
          }
        }, 1000);

        // 当有音频数据可用时触发该事件
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        // 录制结束时触发该事件
        mediaRecorder.onstop = function () {
          // 将音频数据合并成一个Blob对象
          let blob = new Blob(chunks, { type: 'audio/wav' });

          // 将音频转换为base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (e) => {
            console.log(e.target?.result);
            let base64 = e.target?.result as string;
            if (base64) {
              // 去除文件头
              base64 = base64.replace(/^data:audio\/\w+;base64,/, '');
              try {
                // return;
                if (base64 == '') {
                  ToastManager.warning('说话时间太短啦');
                  return;
                }
                audioHandling.value = true;
                api.cloud.voice.uploadAudioFileUsingPost(base64).then((res) => {
                  if (res.data.status == 200) {
                    // 上传成功，开始定时轮询
                    const interval = setInterval(() => {
                      api.cloud.voice.checkAudioResultUsingGet(res.data.data).then((res) => {
                        if (res.data.data.status == 2) {
                          // 已经处理完成
                          audioHandling.value = false;
                          clearInterval(interval);
                          const textResultSplit = res.data.data.result.split(' ');
                          form.inputValue = textResultSplit[textResultSplit.length - 1];
                          if (!form.inputValue) {
                            ToastManager.info('哎呀没听清，再说一次吧~');
                          } else {
                            handleSendMessage();
                          }
                        } else if (res.data.data.status != 1) {
                          // 处理失败
                          audioHandling.value = false;
                          clearInterval(interval);
                          ToastManager.danger('语音模块异常，请联系管理员！');
                        } else {
                          // status = 1，处理中
                        }
                      });
                    }, 1000);
                  }
                });
              } catch (e) {
                // ignore
              }
            }
          };

          // 创建一个音频元素并播放录制的音频
          // const audioElement = new Audio();
          // audioElement.src = URL.createObjectURL(blob);
          // audioElement.controls = true;
          // document.body.appendChild(audioElement);
        };
      } else {
        ToastManager.danger('无权访问麦克风，请给予权限');
        mediaRecorder?.stop();
      }
    })
    .catch(() => {
      ToastManager.danger('无权访问麦克风，请给予权限');
    });
}

function stopVoiceRecording() {
  stopStream();
  mediaRecorder?.stop();
}

const voicePanel = ref(false);

function handleVoicePanelToggle() {
  voicePanel.value = !voicePanel.value;
  if (!voicePanel.value) {
    stopStream();
    mediaRecorder?.stop();
  } else {
    nextTick(() => {
      scrollToBottom();
    });
  }
}
</script>

<template>
  <div class="dialog-detail">
    <div class="dialog-detail-actions">
      <div class="dialog-detail-actions-area-left">
        <IconButton style="flex-shrink: 0" @click="$emit('back')">
          <Back size="16" />
        </IconButton>
        <span class="dialog-detail-actions-title">
          {{ dialogInfo.title }}
        </span>
        <span class="dialog-detail-actions-subtitle"> {{ messageList.length }} 条消息 </span>
      </div>
      <IconButton style="flex-shrink: 0" @click="handleEditDialog">
        <Edit size="16" />
      </IconButton>
      <!--      <IconButton>-->
      <!--        <Share size="16" />-->
      <!--      </IconButton>-->
      <IconButton style="flex-shrink: 0" @click="handleDeleteDialog">
        <Delete size="16" />
      </IconButton>
    </div>
    <div ref="dialog-list" class="dialog-detail-dialogs">
      <!--   列表底部定位（此列表为 column-reverse）   -->
      <div id="bottom-line"></div>
      <!-- 输入面板占位 -->
      <div :style="{ minHeight: `${panelHeight}px` }" class="panel-placeholder"></div>
      <!--   消息列表   -->
      <DialogMessage v-if="form.outputValue" id="bot-typing-box" :message="form.outputValue" role="bot" />
      <DialogMessage v-if="form.inputValue" id="user-typing-box" :message="form.inputValue" role="user" />
      <DialogMessage
        v-for="(item, i) in messageList.toReversed()"
        :id="item.time"
        :key="i"
        :message="item.content"
        :role="item.sender"
        :time="item.time"
      />
      <!--   列表顶部定位   -->
      <div id="top-line"></div>
      <div v-if="voicePanel" style="min-height: 3rem"></div>
    </div>
    <!-- 浮动输入面板 -->
    <div
      ref="input-panel"
      :class="{ 'dialog-detail-inputs--first': messageList.length === 0, 'small-input': smallInput }"
      class="dialog-detail-inputs"
    >
      <Transition name="slide-top-fade">
        <div v-show="!smallInput" class="dialog-detail-inputs-bar">
          <DiliButton v-if="settingStore.settings.enableVoiceToText" type="text" @click="handleVoicePanelToggle">
            <div v-if="!voicePanel" style="display: contents">
              <Voice size="20" />
              语音面板
            </div>
            <div v-else style="display: contents">
              <Acoustic size="20" />
              收起面板
            </div>
          </DiliButton>
          <CusDropdown
            v-model="form.dialogModel"
            :options="[
              { value: 'DeepSeek', label: 'DeepSeek' },
              { value: 'OpenAI', label: 'OpenAI' },
            ]"
            :toggle-style="{ background: 'transparent' }"
            position="top"
          />
          <CusToggle v-model="form.withContext" highlight label="上下文" style="scale: 0.9"></CusToggle>
          <div class="dialog-detail-inputs-bar-expand" @click="smallInput = !smallInput">
            <CollapseTextInput size="16" />
          </div>
        </div>
      </Transition>
      <textarea
        id="message-input"
        ref="inputTextarea"
        v-model="form.inputValue"
        placeholder="随便问点啥(●'◡'●)"
        class="dialog-detail-inputs-textarea"
        @keydown="(e) => handleInputKeydown(e)"
      />
      <div class="dialog-detail-inputs-bar-send" @click="handleSendMessage">
        <ArrowUp fill="white" size="16" />
      </div>
    </div>
    <!-- 语音面板 -->
    <transition name="flow-in">
      <section v-show="voicePanel" class="audio-input">
        <div
          :class="{
            'audio-input-status--ready': !audioHandling && currentMicrophone,
            'audio-input-status--handling': audioHandling,
            'audio-input-status--error': !currentMicrophone,
          }"
          class="audio-input-status"
        >
          <Spinning v-if="audioHandling" :color="variables.colorWarning" />
          <div v-else class="signal" />
          {{
            mediaStream
              ? `录制中 ${audioTimeout}s`
              : audioHandling
              ? '处理中'
              : !currentMicrophone
              ? '无麦克风'
              : '就绪'
          }}
        </div>
        <div ref="audioButtonRef" class="audio-input-speak" @touchend="stopVoiceRecording">
          <CusCircularProgress :bar-style="{ opacity: '0.25' }" :value="(audioTimeout * 100) / 60">
            <Voice v-if="!mediaStream" fill="white" size="2rem" />
            <Acoustic v-else fill="white" size="2rem" />
          </CusCircularProgress>
        </div>
      </section>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.module';

.dialog-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0.25rem 0 0.25rem;

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

  &-dialogs {
    //flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  &-inputs {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: auto;
    border: 1px solid transparentize($color-grey-100, 0.1);
    background-color: transparentize($color-grey-100, 0.2);
    border-radius: 0.5rem;
    padding: 0.25rem;
    backdrop-filter: blur(10px);

    &.small-input {
      gap: 0;
    }

    &--first {
      margin-top: unset;
      //position: absolute;
      //width: 100%;
      //top: 50%;
      //transform: translateY(-50%);
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
      transition: all 0.2s $ease-in-out-back;

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
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s $ease-out-circ;

        .small-input & {
          width: 1.75rem;
          height: 1.75rem;
          right: 0.375rem;
          bottom: 0.375rem;
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
        background-color: transparentize($color-primary, 0.5);
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
        background-color: transparentize($color-danger, 0.75);

        > .signal {
          background-color: $color-danger;
        }
      }

      &--handling {
        color: $color-warning;
        background-color: transparentize($color-warning, 0.75);

        > .signal {
          background-color: $color-warning;
        }
      }

      &--ready {
        color: $color-primary;
        background-color: transparentize($color-primary, 0.75);

        > .signal {
          background-color: $color-primary;
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import '@/assets/variables.module';

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