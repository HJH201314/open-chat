<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import useMarkdownIt from '@/commands/useMarkdownIt';
import { useUserStore } from '@/store/useUserStore';
import { computed } from 'vue';

type DialogMessageProps = {
  message?: string;
  htmlMessage?: string;
  thinking?: string;
  role: 'user' | 'bot';
  time?: string;
  markdownRender?: boolean;
};

const props = withDefaults(defineProps<DialogMessageProps>(), {
  role: 'user',
  message: '',
  htmlMessage: '',
  thinking: '',
  time: new Date().toLocaleString(),
  markdownRender: true,
});

// 处理消息内容框内的点击
async function handleClick(event: MouseEvent) {
  if (event.target instanceof HTMLElement) {
    // 点击“复制”按钮时复制代码块中的内容
    if (event.target?.classList.contains('copy-button')) {
      const button = event.target;
      const codeContainer = button.closest('.cus-code-container');
      const codeBlock = codeContainer?.querySelector('pre code')?.textContent || '';

      try {
        await navigator.clipboard.writeText(codeBlock);
        button.textContent = '复制成功';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        button.textContent = '复制失败';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      }
    }
  }
}

const userStore = useUserStore();

const avatarPath = computed(() => {
  if (props.role == 'user') return userStore.avatar ?? '';
  if (props.role == 'bot') return '/chatgpt3.svg';
  return '';
});

const useCachedHtmlMessage = computed(() => !!props.htmlMessage);
const useOriginMessage = computed(() => !useCachedHtmlMessage.value && !props.markdownRender);
const markdownIt = useMarkdownIt(() => (useCachedHtmlMessage.value || useOriginMessage.value ? '' : props.message));
const renderMessage = computed(() =>
  useCachedHtmlMessage.value ? props.htmlMessage : useOriginMessage.value ? props.message : markdownIt.result.value
);

const { isLargeScreen } = useGlobal();
</script>

<template>
  <div :class="['dialog-message-container', `dialog-message-container__${props.role}`]" @click="handleClick">
    <div :class="['dialog-message-body', `dialog-message-body__${props.role}`]">
      <span v-if="isLargeScreen" class="dialog-message-avatar"><img :src="avatarPath" alt="avatar" /></span>
      <div :class="['dialog-message-content', `dialog-message-content__${props.role}`]">
        <div v-if="thinking" class="dialog-message-content-think">
          {{ thinking }}
        </div>
        <div class="dialog-message-content-body" v-html="renderMessage" />
      </div>
    </div>
    <div class="dialog-message-time">
      {{ props.time }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.dialog-message {
  &-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-inline: 2px;

    &__user {
      align-items: flex-end;
    }

    &__bot {
      align-items: flex-start;
    }
  }

  &-body {
    max-width: 100%; // 此处是消息盒子宽度的关键限制
    display: flex;
    gap: 0.5rem;

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
    border-radius: 0.5rem;
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-content {
    padding: 0.25em 0.5em;
    user-select: text;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto; // 此处让代码内容超出时可以滚动查看
    &__user {
      background-color: $color-teal-500;
      color: $color-white;
      border-radius: 0.5rem 0.5rem 0 0.5rem;
    }

    &__bot {
      background-color: $color-grey-200;
      color: $color-black;
      border-radius: 0.5rem 0.5rem 0.5rem 0;
    }

    &-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      white-space: normal;
      line-height: 1.5;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    &-think {
      border-radius: 8px;
      padding: 0.25em 0.5em;
      margin: 0.25em 0;
      background-color: $color-grey-300;
    }
  }

  &-time {
    color: $color-grey;
    font-size: 12px;
    margin-left: 0.5rem;
  }
}
</style>
<style lang="scss">
@use '@/assets/variables' as *;
// 无 scoped 解决 v-html 中的展示问题
.dialog-message-content-body {
  ol,
  ul {
    white-space: normal;
    padding-left: 1em;
    margin: 0.75em 0;
  }

  ol {
    list-style-type: demical;
    list-style-position: inside;
  }

  li {
    &::marker {
      color: $color-grey-500;
    }
    p {
      display: inline;
    }
  }

  p {
    white-space: pre-line;
  }

  h3 {
    line-height: 1.75;
    // 用户代理样式表默认值
    font-size: 1.17em;
    font-weight: 700;
  }

  .cus-code-container {
    margin-top: 0.1em;
    margin-bottom: 0.6em;
  }
}
</style>
