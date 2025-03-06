<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import useMarkdownIt from '@/commands/useMarkdownIt';
import { useUserStore } from '@/store/useUserStore';
import { computed, ref } from 'vue';
import { Down } from '@icon-park/vue-next';
import CusSpin from '@/components/spinning/CusSpin.vue';

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

const emits = defineEmits<{
  (event: 'think-expand', expanded: boolean): void;
}>();

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

function handleThinkExpand() {
  emits('think-expand', !thinkingCollapsed.value);
  thinkingCollapsed.value = !thinkingCollapsed.value;
}

const userStore = useUserStore();

const avatarPath = computed(() => {
  if (props.role == 'user') return userStore.avatar ?? '';
  if (props.role == 'bot') return '/chatgpt3.svg';
  return '';
});

const useCachedHtmlMessage = computed(() => !!props.htmlMessage);
const useOriginMessage = computed(() => props.role == 'user' || (!useCachedHtmlMessage.value && !props.markdownRender));
const markdownIt = useMarkdownIt(() => (useCachedHtmlMessage.value || useOriginMessage.value ? '' : props.message));
const renderMessage = computed(() =>
  useCachedHtmlMessage.value ? props.htmlMessage : useOriginMessage.value ? props.message : markdownIt.result.value
);

const thinkingCollapsed = ref(false); // 思考内容是否收起（即时、不等待动画的状态）
const thinkingCollapsing = ref(false); // 正在收起思考内容（动画过程中）

const { isLargeScreen } = useGlobal();
</script>

<template>
  <div :class="['dialog-message-container', `dialog-message-container__${props.role}`]" @click="handleClick">
    <div :class="['dialog-message-body', `dialog-message-body__${props.role}`]">
      <span v-if="isLargeScreen" class="dialog-message-avatar"><img :src="avatarPath" alt="avatar" /></span>
      <div :class="['dialog-message-content', `dialog-message-content__${props.role}`]">
        <!-- 收起/展开思考内容 -->
        <div
          v-if="thinking"
          class="dialog-message-content-think-toggle"
          :class="{ collapsed: thinkingCollapsed && !thinkingCollapsing }"
          @click="handleThinkExpand"
        >
          <CusSpin v-if="thinking && !renderMessage" style="margin-right: 0.5em" color="var(--color-black)" />
          <span style="margin-right: 2em;">{{ thinking && !renderMessage ? '思考中' : '思考完成' }}</span>
          <span>{{ thinkingCollapsed ? '展开' : '收起' }}</span>
          <Down size="16" :style="{ transform: thinkingCollapsed ? '' : 'rotate(180deg)' }" />
        </div>
        <transition name="grid-expand" @before-leave="thinkingCollapsing = true" @after-leave="thinkingCollapsing = false">
          <div v-if="thinking && !thinkingCollapsed" class="dialog-message-content-think">
            <div class="content">{{ thinking }}</div>
          </div>
        </transition>
        <div
          v-if="useOriginMessage"
          class="dialog-message-content-body"
          style="white-space: pre-wrap"
          v-text="renderMessage"
        />
        <div v-else class="dialog-message-content-body rendered" :class="{ think: thinking }" v-html="renderMessage" />
      </div>
    </div>
    <div class="dialog-message-time">
      {{ props.time }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/animations' as *;
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
    user-select: text;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto; // 此处让代码内容超出时可以滚动查看

    &__user {
      padding: 0.4em 0.8em;
      border-radius: 0.5rem;
      background-color: $color-teal-500;
      color: $color-white;
    }

    &__bot {
      padding: 0;
      background-color: transparent;
      color: $color-black;
    }

    &-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      white-space: normal;
      line-height: 1.5;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;

      &.think {
        margin-top: 0.5rem;
      }
    }

    &-think {
      display: grid;
      border-radius: 0 0.5rem 0.5rem 0.5rem;
      padding: 0.5rem 0.75rem;
      background-color: $color-grey-200;

      .content {
        overflow: hidden;
        font-size: 0.9em;
      }

      &-toggle {
        user-select: none;
        width: fit-content;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: $color-grey-200;
        font-size: 0.75em;
        cursor: pointer;
        text-align: right;
        padding: 0.5em 1em;
        border-radius: 0.5rem 0.5rem 0 0;
        transition: all 0.2s $ease-out-circ;

        &.collapsed {
          border-radius: 0.5rem;
        }
      }
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
.dialog-message-content-body.rendered {
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
    margin: 0.25em 0;
    white-space: pre-line;

    &:first-child {
      margin-top: 0 !important;
    }

    &:last-child {
      margin-bottom: 0 !important;
    }
  }

  h3 {
    line-height: 1.75;
    // 用户代理样式表默认值
    font-size: 1.17em;
    font-weight: 700;
  }

  table {
    border-collapse: collapse;

    tr {
      border: 1px solid $color-grey-300;
      border-left: none;
      border-right: none;
    }

    td {
      padding: 0.25em 0;
      text-align: center;
    }
  }

  .cus-code-container {
    margin-top: 0.1em;
    margin-bottom: 0.6em;
  }
}

/* 定义 使用 gird 布局的过渡动画 */
.grid-expand {
  &-enter-active, &-leave-active {
    transition: grid-template-rows 0.25s $ease-out-circ, padding-top 0.25s $ease-out-circ;
  }

  &-enter-to, &-leave-from {
    padding: 0.5rem 0.75rem !important;
    grid-template-rows: 1fr;
  }

  &-enter-from, &-leave-to {
    padding: 0 0.75rem !important;
    grid-template-rows: 0fr;
  }
}
</style>
