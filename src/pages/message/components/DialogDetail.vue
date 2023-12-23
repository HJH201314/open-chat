<script setup lang="ts">

import { Acoustic, Back, Delete, Edit, Send, Voice } from '@icon-park/vue-next';
import IconButton from "@/components/IconButton.vue";
import DialogMessage from "@/pages/message/components/DialogMessage.vue";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useDataStore } from "@/store/useDataStore";
import type { DialogInfo, MsgInfo } from "@/types/data";
import { useUserStore } from "@/store/useUserStore";
import showToast from "@/components/toast/toast";
import DiliButton from "@/components/button/DiliButton.vue";
import { useDevicesList, useMousePressed, useUserMedia } from '@vueuse/core';
import { useSettingStore } from "@/store/useSettingStore";
import ToastManager from "@/components/toast/ToastManager";
import api from "@/api";
import { DialogManager } from "@/components/dialog";
import variables from "@/assets/variables.module.scss";
import CusCircularProgress from "@/components/progress/CusCircularProgress.vue";
import Spinning from "@/components/spinning/Spinning.vue";

const dataStore = useDataStore();

interface DialogDetailProps {
  dialogId: string;
}

const props = withDefaults(
  defineProps<DialogDetailProps>(),
  {
    dialogId: '',
  }
);

const userStore = useUserStore();
const settingStore = useSettingStore();

const dialogInfo = ref<DialogInfo>({} as DialogInfo);
const messageList = ref([] as MsgInfo[]);

const form = reactive({
  sessionId: ref(''),
  inputValue: ref(''),
  outputValue: ref(''),
});

function scrollToBottom() {
  document.querySelector(`#bottom-line`)?.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
}

watch(() => props.dialogId, (v) => {
  if (props.dialogId != '') {
    dialogInfo.value = dataStore.getDialogInfo(v);
    form.sessionId = v;
    messageList.value = dataStore.getMessageList(v);
    nextTick(() => {
      scrollToBottom();
    });
  }
}, { immediate: true });

const emit = defineEmits<{
  (e: 'back'): void;
}>();

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && e.ctrlKey) {
    handleSendMessage();
  }
}
function handleSendMessage() {
  if (!userStore.isLogin) {
    showToast({ text: '请先登录！', type: 'warning' });
    return;
  }
  if (!form.sessionId || !form.inputValue) return;
  dataStore.sendMessageText(form.sessionId, form.inputValue, {
    onMessage: (msg) => {
      form.outputValue += msg;
      if (form.outputValue.match(/^```(.+?)```/)) {
        form.outputValue = form.outputValue.replace(/^```(.+?)```/, '');
      }
    },
    onFinish: (fullMessage) => {
      form.outputValue = '';
      messageList.value = dataStore.getMessageList(form.sessionId);
      scrollToBottom();
    }
  });
  form.inputValue = '';
  nextTick(() => {
    scrollToBottom();
  });
}

function handleEditDialog() {
  DialogManager.inputDialog({
    title: '编辑会话',
    content: '修改会话名称为',
  }, {
    placeholder: '新对话名称',
    value: dialogInfo.value.title,
  }).then((res) => {
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
      backgroundColor: variables.colorDanger
    }
  }).then(res => {
    if (res) {
      dataStore.delDialog(form.sessionId);
      emit('back');
    }
  });
}

/* 音频录制相关 */
// 需要https或localhost才能测试
const {
  audioInputs: microphones,
} = useDevicesList({
  requestPermissions: true,
})
const currentMicrophone = computed(() => microphones.value[0]?.deviceId);

const { stream: mediaStream, start: startStream, stop: stopStream } = useUserMedia({
  constraints: {
    video: false,
    audio: {
      deviceId: currentMicrophone.value,
      channelCount: 1,
    }
  }
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

watch(() => audioButtonPress.pressed.value, (p) => {
  console.log(audioButtonPress, p)
  if (p) {
    startVoiceRecording();
  } else {
    audioTimeout.value = 60;
    stopVoiceRecording();
  }
});

function startVoiceRecording() {
  if (microphones.value.length <= 0) {
    ToastManager.warning('无音频输入设备！');
    return;
  }
  if (!userStore.isLogin) {
    ToastManager.warning('请先登录！');
    return;
  }
  startStream().then(s => {
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
      }

      // 录制结束时触发该事件
      mediaRecorder.onstop = function() {
        // 将音频数据合并成一个Blob对象
        let blob = new Blob(chunks, { type: 'audio/wav' });

        // 将音频转换为base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = e => {
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
              api.cloud.voice.uploadAudioFileUsingPost(base64).then(res => {
                if (res.data.status == 200) {
                  // 上传成功，开始定时轮询
                  const interval = setInterval(() => {
                    api.cloud.voice.checkAudioResultUsingGet(res.data.data.taskId).then(res => {
                      if (res.data.data.status == 2) {
                        // 已经处理完成
                        audioHandling.value = false;
                        clearInterval(interval);
                        const textResultSplit = res.data.data.result.split(' ');
                        form.inputValue = textResultSplit[textResultSplit.length - 1];
                        if (!form.inputValue) {
                          ToastManager.info('未识别到语音~');
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
            } catch (ignore) {}
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
  }).catch(() => {
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
      <IconButton style="flex-shrink: 0;" @click="$emit('back')" >
        <Back size="16" />
      </IconButton>
      <span class="dialog-detail-actions-title">
        {{ dialogInfo.title }}
      </span>
      <span class="dialog-detail-actions-subtitle">
        {{ messageList.length }} 条消息
      </span>
      <IconButton style="flex-shrink: 0;" @click="handleEditDialog">
        <Edit size="16" />
      </IconButton>
<!--      <IconButton>-->
<!--        <Share size="16" />-->
<!--      </IconButton>-->
      <IconButton style="flex-shrink: 0;" @click="handleDeleteDialog">
        <Delete size="16" />
      </IconButton>
    </div>
    <div class="dialog-detail-dialogs">
      <DialogMessage message="Hello! How can I assist you today?" role="bot" v-if="!messageList.length" />
      <!--   消息列表   -->
      <DialogMessage v-for="item in messageList" :id="item.time" :message="item.content" :role="item.sender" :time="item.time" />
      <DialogMessage id="user-typing-box" v-if="form.inputValue" :message="form.inputValue" role="user" />
      <DialogMessage id="bot-typing-box" v-if="form.outputValue" :message="form.outputValue" role="bot" />
      <div v-if="voicePanel" style="min-height: 3rem;"></div>
      <div id="bottom-line"></div><!--定位-->
    </div>
    <div class="dialog-detail-inputs">
      <textarea class="dialog-detail-inputs-textarea" @keydown="(e) => handleInputKeydown(e)" v-model="form.inputValue" placeholder="随便问点啥(●'◡'●)" />
      <div class="dialog-detail-inputs-bar">
<!--        <span class="dialog-detail-inputs-bar-icon transition-all-circ">-->
<!--          <NewPicture size="24" />-->
<!--        </span>-->

        <DiliButton v-if="settingStore.settings.enableVoiceToText"
                    style="flex: 1;" :button-style="{'width': '100%', 'border': '1px solid grey'}"
                    @click="handleVoicePanelToggle">
          <div style="display: contents" v-if="!voicePanel"><Voice size="20" />语音面板</div>
          <div style="display: contents" v-else><Acoustic size="20" />收起面板</div>
        </DiliButton>
        <div class="dialog-detail-inputs-bar-send" @click="handleSendMessage">
          <Send fill="white" size="16" />
          <span>发送</span>
        </div>
      </div>
    </div>
    <!-- 语音面板 -->
    <transition name="flow-in">
      <section class="audio-input" v-show="voicePanel">
        <div class="audio-input-status"
            :class="{
              'audio-input-status--ready': !audioHandling && currentMicrophone,
              'audio-input-status--handling': audioHandling,
              'audio-input-status--error': !currentMicrophone,
            }">
          <Spinning v-if="audioHandling" :color="variables.colorWarning" />
          <div v-else class="signal" />
          {{ mediaStream ? `录制中 ${audioTimeout}s` : audioHandling ? '处理中' : !currentMicrophone ? '无麦克风' : '就绪' }}
        </div>
        <div class="audio-input-speak" ref="audioButtonRef" @touchend="stopVoiceRecording">
          <CusCircularProgress :value="(audioTimeout) * 100 / 60" :bar-style="{'opacity': '0.25'}">
            <Voice fill="white" size="2rem" v-if="!mediaStream" />
            <Acoustic fill="white" size="2rem" v-else />
          </CusCircularProgress>
        </div>
      </section>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.dialog-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: .5rem;
    margin: .25rem .25rem 0 .25rem;

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
      margin-right: auto;
      font-size: .75rem;
      flex-shrink: 0;
    }
  }

  &-dialogs {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  &-inputs {
    min-height: 128px;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    &-textarea {
      flex: 1;
      background-color: $color-grey-100;
      width: 100%;
      border-radius: .5rem;
      padding: .25rem;
      box-sizing: border-box;
      transition: border-color .1s ease-in-out;
      overflow: auto;
      outline: none;
      font-size: 16px;
      resize: none;
      &::placeholder {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &-bar {
      display: flex;
      flex-direction: row;
      gap: .5rem;
      &-icon {
        width: 30px;
        height: 30px;
        padding: 3px;
        aspect-ratio: 1;
        cursor: pointer;
        border-radius: .5rem;
        &:hover {
          background-color: $color-grey-200;
        }
      }
      &-send {
        margin-left: auto;
        background: $color-primary;
        color: white;
        border-radius: .5rem;
        width: fit-content;
        padding: .25rem .5rem;
        display: flex;
        align-items: center;
        gap: .5rem;
        cursor: pointer;
        transition: background-color .2s $ease-out-circ;
        &:hover {
          background: $color-primary-darker;
        }
      }
    }
  }

  .audio-input {
    border-radius: .5rem;
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
        content: "";
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
      left: .5rem;
      top: .5rem;
      border-radius: .25rem;
      padding: .125rem .35rem;
      display: flex;
      align-items: center;
      gap: .25rem;
      transition: all .25s $ease-out-circ;
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
@import "@/assets/variables.module";
.flow-in-enter-from,
.flow-in-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.flow-in-enter-active,
.flow-in-leave-active {
  transition: all .3s $ease-in-out-back;
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