<script setup lang="ts">

import { Acoustic, Back, Delete, Edit, Send, Share, Voice } from '@icon-park/vue-next';
import IconButton from "@/components/IconButton.vue";
import DialogMessage from "@/pages/message/components/DialogMessage.vue";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useDataStore } from "@/store/useDataStore";
import type { DialogInfo, MsgInfo } from "@/types/data";
import { useUserStore } from "@/store/useUserStore";
import showToast from "@/components/toast/toast";
import DiliButton from "@/components/button/DiliButton.vue";
/* 音频录制相关 */
// 似乎需要https或localhost才能测试
import { useDevicesList, useUserMedia } from '@vueuse/core';

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

const dialogInfo = ref<DialogInfo>({} as DialogInfo);
const messageList = ref([] as MsgInfo[]);

const form = reactive({
  sessionId: ref(''),
  inputValue: ref(''),
  outputValue: ref(''),
});

onMounted(() => {
  document.querySelector(`#bottom-line`)?.scrollIntoView(false);
});

watch(() => props.dialogId, (v) => {
  if (props.dialogId != '') {
    dialogInfo.value = dataStore.getDialogInfo(v);
    form.sessionId = v;
    messageList.value = dataStore.getMessageList(v);
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
    },
    onFinish: (fullMessage) => {
      form.outputValue = '';
      messageList.value = dataStore.getMessageList(form.sessionId);
      document.querySelector(`#bottom-line`)?.scrollIntoView(false);
    }
  });
  form.inputValue = '';
}

function handleDeleteDialog() {
  dataStore.delDialog(form.sessionId);
  emit('back');
}

const {
  audioInputs: microphones,
} = useDevicesList({
  requestPermissions: true,
})
const currentMicrophone = computed(() => microphones.value[0]?.deviceId);

const { stream, start: startRecording, stop: stopRecording, restart: restartRecording } = useUserMedia({
  constraints: {
    video: false,
    audio: {
      deviceId: currentMicrophone.value
    }
  }
});

let mediaRecorder: MediaRecorder;
let chunks: BlobPart[] = [];
watch(() => stream.value, (s) => {
  if (s) {
    mediaRecorder = new MediaRecorder(s);
    chunks = [];

    // 开始录制
    mediaRecorder.start();

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

      // 创建一个音频元素并播放录制的音频
      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(blob);
      audioElement.controls = true;
      // document.body.appendChild(audioElement);
    };
  } else {
    mediaRecorder.stop();
  }
});

function handleVoiceMouseDown() {
  startRecording();
  nextTick(() => {
    console.log(stream.value)
  })
}

function handleVoiceMouseUp() {
  console.log(stream.value)
  stopRecording();
  console.log(microphones.value)
}
</script>

<template>
  <div class="dialog-detail">
    <div class="dialog-detail-actions">
      <IconButton @click="$emit('back')" >
        <Back size="16" />
      </IconButton>
      <span class="dialog-detail-actions-title">
        {{ dialogInfo.title }}
      </span>
      <IconButton>
        <Edit size="16" />
      </IconButton>
      <IconButton>
        <Share size="16" />
      </IconButton>
      <IconButton @click="handleDeleteDialog">
        <Delete size="16" />
      </IconButton>
    </div>
    <div class="dialog-detail-dialogs">
      <DialogMessage message="Hello! How can I assist you today?" role="bot" />
      <!--   消息列表   -->
      <DialogMessage v-for="item in messageList" :id="item.time" :message="item.content" :role="item.sender" :time="item.time" />
      <DialogMessage id="user-typing-box" v-if="form.inputValue" :message="form.inputValue" role="user" />
      <DialogMessage id="bot-typing-box" v-if="form.outputValue" :message="form.outputValue" role="bot" />
      <div id="bottom-line"></div><!--定位-->
    </div>
    <div class="dialog-detail-inputs">
      <textarea class="dialog-detail-inputs-textarea" @keydown="(e) => handleInputKeydown(e)" v-model="form.inputValue" placeholder="随便问点啥(●'◡'●)" />
      <div class="dialog-detail-inputs-bar">
<!--        <span class="dialog-detail-inputs-bar-icon transition-all-circ">-->
<!--          <NewPicture size="24" />-->
<!--        </span>-->

        <DiliButton style="flex: 1;" :button-style="{'width': '100%', 'border': '1px solid grey'}"
                    @touchstart="handleVoiceMouseDown" @touchend="handleVoiceMouseUp"
                    @mousedown="handleVoiceMouseDown" @mouseup="handleVoiceMouseUp">
          <div style="display: contents" v-if="!stream"><Voice size="24" />按住说话</div>
          <div style="display: contents" v-else><Acoustic size="24" />录制中...</div>
        </DiliButton>
        <div class="dialog-detail-inputs-bar-send" @click="handleSendMessage">
          <Send fill="white" size="16" />
          <span>发送</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.dialog-detail {
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: .5rem;
    margin: .25rem .25rem 0 .25rem;

    &-title {
      text-align: center;
      margin-right: auto;
      font-weight: bold;
      font-size: 20px;
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
}
</style>