<script setup lang="ts">

import { Share, Back, Delete, Send } from '@icon-park/vue-next';
import IconButton from "@/components/IconButton.vue";
import cusCss from "@/constants/cusCss";

const props = withDefaults(
  defineProps<{
    id: number;
  }>(),
  {
    id: 0,
  }
);

const emit = defineEmits<{
  (e: 'back'): void;
}>()
</script>

<template>
  <div class="dialog-detail">
    <div class="dialog-detail-actions">
      <IconButton @click="$emit('back')" >
        <Back :fill="cusCss.colorGray" size="16" />
      </IconButton>
      <span class="dialog-detail-actions-title">
        {{ props.id }}
      </span>
      <IconButton>
        <Share :fill="cusCss.colorGray" size="16" />
      </IconButton>
      <IconButton>
        <Delete :fill="cusCss.colorGray" size="16" />
      </IconButton>
    </div>
    <div class="dialog-detail-dialogs">

    </div>
    <div class="dialog-detail-inputs">
      <textarea class="dialog-detail-inputs-input" />
      <div class="dialog-detail-inputs-send">
        <Send fill="white" size="16" />
        <span>发送</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main.scss";
.dialog-detail {
  position: relative;
  display: flex;
  flex-direction: column;

  &-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: .5rem;

    &-title {
      text-align: center;
      margin-right: auto;
      font-weight: bold;
      font-size: 24px;
    }
  }

  &-inputs {
    position: absolute;
    display: flex;
    bottom: 0;
    right: 0;
    left: 0;
    min-height: 128px;
    &-input {
      background-color: $color-white;
      width: 100%;
      min-height: 100%;
      border: 2px solid $color-gray;
      border-radius: .5rem;
      padding: .5rem;
      box-sizing: border-box;
      outline: none;
      font-size: 16px;
      transition: border-color .1s ease-in-out;
      resize: none;
      &:focus {
        border-color: $color-primary;
      }
    }
    &-send {
      position: absolute;
      right: 8px;
      bottom: 8px;
      background: $color-primary;
      color: white;
      border-radius: .5rem;
      width: fit-content;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: .5rem;
      cursor: pointer;
      transition: background-color .1s ease-in-out;
      &:hover {
        background: $color-primary-darker;
      }
    }
  }
}
</style>