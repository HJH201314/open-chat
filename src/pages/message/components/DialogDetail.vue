<script setup lang="ts">

import { Share, Back, Delete, Send } from '@icon-park/vue-next';
import IconButton from "@/components/IconButton.vue";
import cusCss from "@/constants/cusCss";
import { Voice, NewPicture } from "@icon-park/vue-next";
import DialogMessage from "@/pages/message/components/DialogMessage.vue";
import { reactive, ref, watch } from "vue";
import { useDataStore } from "@/store/useDataStore";
import type { DialogData, DialogInfo, MsgInfo } from "@/types/data";

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

const dialogInfo = ref<DialogInfo>({} as DialogInfo);
const messageList = ref([] as MsgInfo[]);

watch(() => props.dialogId, (v) => {
  dialogInfo.value = dataStore.getDialogInfo(v);
  form.sessionId = v;
  // TODO
  messageList.value = dataStore.getMessageList(v);
});

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const form = reactive({
  sessionId: ref(''),
  inputValue: ref(''),
  outputValue: ref(''),
});

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && e.ctrlKey) {
    handleSendMessage();
  }
}
function handleSendMessage() {
  if (!form.inputValue) return;
  dataStore.sendMessageText(form.sessionId, form.inputValue, {
    onMessage: (msg) => {
      form.outputValue += msg;
    },
    onFinish: (fullMessage) => {
      form.outputValue = '';
      messageList.value = dataStore.getMessageList(form.sessionId);
    }
  });
  form.inputValue = '';
}

watch(() => dataStore.messageStorage, (v) => {
  console.log(v);
});
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
        <Share size="16" />
      </IconButton>
      <IconButton>
        <Delete size="16" />
      </IconButton>
    </div>
    <div class="dialog-detail-dialogs">
      <DialogMessage message="Hello! How can I assist you today?" role="bot" />
<!--   消息列表   -->
      <DialogMessage v-for="item in messageList" :message="item.content" :role="item.sender" :time="item.time" />
      <DialogMessage id="user-typing-box" v-if="form.inputValue" :message="form.inputValue" role="user" />
      <DialogMessage id="bot-typing-box" v-if="form.outputValue" :message="form.outputValue" role="bot" />
    </div>
    <div class="dialog-detail-inputs">
      <textarea class="dialog-detail-inputs-textarea" @keydown="(e) => handleInputKeydown(e)" v-model="form.inputValue" />
      <div class="dialog-detail-inputs-bar">
        <span class="dialog-detail-inputs-bar-icon transition-all-circ">
          <NewPicture size="24" />
        </span>
        <span class="dialog-detail-inputs-bar-icon transition-all-circ">
          <Voice size="24" />
        </span>
        <div class="dialog-detail-inputs-bar-send" @click="handleSendMessage">
          <Send fill="white" size="16" />
          <span>发送</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables";
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
      font-size: 24px;
    }
  }

  &-dialogs {
    flex: 1;
    overflow: scroll;
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
      background-color: $color-white;
      width: 100%;
      border: 2px solid $color-gray;
      border-radius: .5rem;
      padding: .25rem;
      box-sizing: border-box;
      transition: border-color .1s ease-in-out;
      overflow: auto;
      outline: none;
      font-size: 16px;
      resize: none;
      &:focus {
        border-color: $color-primary;
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
          background-color: $color-gray-200;
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