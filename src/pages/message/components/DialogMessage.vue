<script setup lang="ts">
import { useUserStore } from '@/store/useUserStore';
import { computed } from 'vue';
import useMarkdownIt from '@/commands/useMarkdownIt';

type DialogMessageProps = {
  message: string;
  role: 'user' | 'bot';
  time?: string;
};

const props = withDefaults(
  defineProps<DialogMessageProps>(),
  {
    role: 'user',
    message: '',
    time: new Date().toLocaleString(),
  }
);

const userStore = useUserStore();

const avatarPath = computed(() => {
  if (props.role == 'user') return userStore.avatar ?? '';
  if (props.role == 'bot') return '/chatgpt3.svg';
  return '';
});

const markdownIt = useMarkdownIt(() => props.message);
const renderMessage = computed(() => markdownIt.result.value);

</script>

<template>
  <div :class="['dialog-message-container', `dialog-message-container__${props.role}`]">
    <div :class="['dialog-message-body', `dialog-message-body__${props.role}`]">
      <span class="dialog-message-avatar"><img :src="avatarPath" alt="avatar" /></span>
      <div :class="['dialog-message-content', `dialog-message-content__${props.role}`]">
        <div class="dialog-message-content-body" v-html="renderMessage" />
      </div>
    </div>
    <div class="dialog-message-time">
      {{ props.time }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.dialog-message {

  &-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-left: 5px;
    &__user {
      align-items: flex-end;
    }
    &__bot {
      align-items: flex-start;
    }
  }
  &-body {
    max-width: 100%;  // 此处是消息盒子宽度的关键限制
    display: flex;
    gap: .5rem;
    &__user {
      flex-direction: row-reverse;
    }
    &__bot {
      flex-direction: row;
    }
  }
  &-avatar {
    min-width: 32px;
    max-width: 32px;
    min-height: 32px;
    max-height: 32px;
    border-radius: .5rem;
    overflow: hidden;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-content {
    padding: .25rem .5rem;
    user-select: text;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto; // 此处让代码内容超出时可以滚动查看
    &__user {
      background-color: $color-teal-500;
      color: $color-white;
      border-radius: .5rem .5rem 0 .5rem;
    }
    &__bot {
      background-color: $color-grey-200;
      color: $color-black;
      border-radius: .5rem .5rem .5rem 0;
    }
    &-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      white-space: pre-line; // 去除额外的换行
      line-height: 1.5;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
  }
  &-time {
    color: $color-grey;
    font-size: 12px;
    margin-left: .5rem;
  }
}
</style>
<style lang="scss">
// 解决v-html中的展示问题
.dialog-message-content-body {
  :is(ol, li) {
    white-space: nowrap;
  }
  p {
    white-space: pre-line;
  }
}
</style>