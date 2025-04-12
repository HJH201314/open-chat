<script lang="tsx" setup>
import useGlobal from '@/commands/useGlobal.ts';
import useMarkdownIt from '@/commands/useMarkdownIt';
import { computed, ref, type VNode, watch } from 'vue';
import { Down } from '@icon-park/vue-next';
import CusSpin from '@/components/spinning/CusSpin.vue';
import LogoDeepseek from '@/components/logo/LogoDeepSeek.vue';
import LogoQwen from '@/components/logo/LogoQwen.vue';
import LogoOpenAI from '@/components/logo/LogoOpenAI.vue';

type DialogMessageProps = {
  streaming?: boolean; // 是否正在输出
  message?: string;
  htmlMessage?: string;
  thinking?: string;
  role: 'user' | 'bot';
  model?: string;
  time?: string;
  markdownRender?: boolean;
};

const props = withDefaults(defineProps<DialogMessageProps>(), {
  streaming: false,
  role: 'user',
  message: '',
  htmlMessage: '',
  thinking: '',
  model: '',
  time: new Date().toLocaleString(),
  markdownRender: true,
});

const emits = defineEmits<{
  (event: 'think-expand', expanded: boolean): void;
  (event: 'think-expanded', expanded: boolean): void;
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
  const targetStatus = !thinkingCollapsed.value;
  emits('think-expand', targetStatus);
  thinkingCollapsed.value = targetStatus;
}

const useCachedHtmlMessage = computed(() => !!props.htmlMessage);
const useOriginMessage = computed(() => props.role == 'user' || (!useCachedHtmlMessage.value && !props.markdownRender));
const markdownIt = useMarkdownIt(() => (useCachedHtmlMessage.value || useOriginMessage.value ? '' : props.message));
const renderMessage = computed(() =>
  useCachedHtmlMessage.value ? props.htmlMessage : useOriginMessage.value ? props.message : markdownIt.result.value
);

// 思考内容默认收起
const thinkingCollapsed = ref(true); // 思考内容是否收起（即时、不等待动画的状态）
watch(
  () => props.thinking,
  (newThinking, oldThinking) => {
    if (newThinking && !oldThinking) {
      // 思考内容从无到有时默认展开
      thinkingCollapsed.value = false;
    }
  }
);
watch(
  () => props.message,
  (newMessage, oldMessage) => {
    if (newMessage && !oldMessage) {
      // 思考完成时收起
      thinkingCollapsed.value = true;
    }
  }
);
const thinkingCollapsing = ref(false); // 正在收起思考内容（动画过程中）
const thinkingExpanding = ref(false); // 正在展开思考内容（动画过程中）
watch(
  () => [thinkingCollapsing.value, thinkingExpanding.value],
  (newVal, oldVal) => {
    if (!newVal[0] && oldVal[0]) emits('think-expanded', false);
    if (!newVal[1] && oldVal[1]) emits('think-expanded', true);
  }
);

const statusText = computed(() => {
  // 思考中/思考中断/思考完成
  if (props.thinking && !renderMessage.value) {
    return props.streaming ? '奋力思考中(๑•̀ㅂ•́)و' : '思考中断(´;ω;`)';
  } else if (!props.streaming) {
    return props.thinking ? '思考完成ヽ(•̀ω•́ )ゝ' : '回答完成✧(•̀ω•́)✧';
  } else {
    return '输出中(ง •̀_•́)ง';
  }
});

const { isLargeScreen } = useGlobal();

defineSlots<{
  extra: () => VNode;
}>();
</script>

<template>
  <div :class="['dialog-message-container', `dialog-message-container__${props.role}`]" @click="handleClick">
    <div :class="['dialog-message-body', `dialog-message-body__${props.role}`]">
      <div v-if="isLargeScreen && role === 'bot'" class="dialog-message-avatar">
        <LogoDeepseek v-if="model?.includes('deepseek')" />
        <LogoQwen v-else-if="model?.includes('qwen')" />
        <LogoOpenAI v-else />
      </div>
      <div :class="['dialog-message-content', `dialog-message-content__${props.role}`]">
        <!-- 收起/展开思考内容 -->
        <div
          v-if="thinking"
          class="dialog-message-content-think-toggle"
          :class="{ collapsed: thinkingCollapsed && !thinkingCollapsing }"
          @click="handleThinkExpand"
        >
          <CusSpin v-if="streaming" style="margin-right: 0.5em" color="var(--color-black)" />
          <span style="margin-right: 2em">{{ statusText }}</span>
          <span>{{ thinkingCollapsed ? '展开' : '收起' }}</span>
          <Down size="16" :style="{ transform: thinkingCollapsed ? '' : 'rotate(180deg)' }" />
        </div>
        <transition
          name="grid-expand"
          @before-leave="thinkingCollapsing = true"
          @after-leave="thinkingCollapsing = false"
          @before-enter="thinkingExpanding = true"
          @after-enter="thinkingExpanding = false"
        >
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
        <slot name="extra" />
      </div>
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
    width: 100%; // 默认情况下占满盒子
    max-width: 100%; // 限制消息盒子宽度
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
    flex-shrink: 0;
    min-width: 2rem;
    max-width: 2rem;
    min-height: 2rem;
    max-height: 2rem;
    border-radius: 0.5rem;
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-content {
    max-width: 100%; // 避免被内容撑大
    user-select: text;
    white-space: pre-wrap;
    word-break: break-word;
    //overflow-x: auto; // 让代码块不会撑大容器

    &__user {
      padding: 0.4em 0.8em;
      border-radius: 0.5rem;
      background-color: var(--color-primary-100);
      color: var(--color-primary-900);

      & div::selection {
        background-color: var(--color-trans-500);
        border-radius: 0.5rem;
      }
    }

    &__bot {
      flex: 1; // 模型的回复默认占满剩余空间
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
      color: var(--color-black);
      background-color: var(--color-grey-100);

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
        color: var(--color-black);
        background-color: var(--color-grey-100);
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
    color: var(--color-grey-100);
    font-size: 12px;
    margin-left: 0.5rem;
  }
}
</style>
<style lang="scss">
@use '@/assets/variables' as *;
// 无 scoped 解决 v-html 中的展示问题
.dialog-message-content-body.rendered {
  color: var(--color-black);

  br {
    display: none;
  }

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
      color: var(--color-grey-500);
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
      border: 1px solid var(--color-grey-300);
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
  &-enter-active,
  &-leave-active {
    transition:
      grid-template-rows 0.25s $ease-out-circ,
      padding-top 0.25s $ease-out-circ;
  }

  &-enter-to,
  &-leave-from {
    padding: 0.5rem 0.75rem !important;
    grid-template-rows: 1fr;
  }

  &-enter-from,
  &-leave-to {
    padding: 0 0.75rem !important;
    grid-template-rows: 0fr;
  }
}
</style>
