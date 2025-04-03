<script lang="ts" setup>
import { ArrowUp, CollapseTextInput, ExpandTextInput } from '@icon-park/vue-next';
import CusSelect from '@/components/dropdown/CusSelect.vue';
import CusTextarea from '@/components/textarea/CusTextarea.vue';
import CusToggle from '@/components/toggle/CusToggle.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import { computed, ref } from 'vue';
import type { DialogInputEmits, DialogInputProps } from '@/pages/user/chat/message/components/types.ts';

const props = withDefaults(defineProps<DialogInputProps>(), {
  providerDropdown: () => [],
  botDropdown: () => [],
  displayInMiddle: false,
  isStreaming: false,
  hideSelf: false,
  showModelSelector: true,
  showBotSelector: true,
  showContextToggle: true,
});

const showToolbar = computed(() => props.showModelSelector || props.showBotSelector || props.showContextToggle);

const inputModelName = defineModel<string>('inputModelName', { default: '' });
const inputBotId = defineModel<number>('inputBotId', { default: 0 });
const inputWithContext = defineModel<boolean>('inputWithContext', { default: true });
const inputUserInput = defineModel<string>('inputUserInput', { default: '' });

const emit = defineEmits<DialogInputEmits>();

const smallInput = ref(false);

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.isComposing) {
    if (!e.shiftKey && !e.ctrlKey) {
      emit('send');
      e.preventDefault();
    }
  }
}

function handleModelSelect(selectPath: string[]) {
  if (selectPath.length == 2) {
    emit('modelSelect', selectPath);
  }
}

function handleBotRoleSelect(selectValue: string) {
  emit('botSelect', Number(selectValue));
}
</script>

<template>
  <div
    :class="{
      'dialog-input--first': displayInMiddle,
      'small-input': smallInput,
      hide: hideSelf,
    }"
    class="dialog-input"
  >
    <Transition name="bar-fade">
      <div v-show="!smallInput && showToolbar" class="dialog-input-bar">
        <CusSelect
          v-if="showModelSelector"
          :model-value="inputModelName"
          :label-render-text="(_, path) => path?.map((o) => o.label)?.join('/')"
          :options="providerDropdown"
          background-mode="transparent"
          position="top"
          style="font-size: 0.75rem"
          @select="(v, o, path) => handleModelSelect(path)"
        />
        <CusSelect
          v-if="showBotSelector"
          :model-value="String(inputBotId)"
          :options="botDropdown"
          background-mode="transparent"
          placeholder="角色选择"
          position="top"
          style="font-size: 0.75rem"
          @select="(v) => handleBotRoleSelect(v)"
        />
        <CusToggle
          v-if="showContextToggle"
          v-model="inputWithContext"
          highlight
          label="上下文"
          style="font-size: 0.75rem; opacity: 0.75"
        ></CusToggle>
      </div>
    </Transition>
    <div
      class="dialog-input-toggle"
      :class="{ 'dialog-input-toggle--expand': smallInput, 'dialog-input-toggle--collapse': !smallInput }"
      @click="smallInput = !smallInput"
    >
      <CollapseTextInput v-if="!smallInput" size="16" />
      <ExpandTextInput v-else size="16" />
    </div>
    <CusTextarea
      v-model="inputUserInput"
      class="dialog-input-textarea"
      :preset="false"
      @keydown="handleInputKeydown"
    />
    <div class="dialog-input-send" @click="$emit('send')">
      <ArrowUp v-if="!isStreaming" class="sending" fill="white" size="16" />
      <cus-spin v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;

$dialog-max-width: 54rem;

.dialog-input {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: calc(100% - 1rem);
  max-width: $dialog-max-width;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  background-color: $color-grey-50;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: $box-shadow;
  transition: all 0.2s $ease-out-circ;
  overflow: hidden;

  &:focus-within {
    bottom: 0.35rem;
    border-radius: 0.75rem;
    box-shadow: $next-box-shadow-medium;
  }

  &.hide {
    height: 0;
  }

  &.small-input {
    padding: 0.5rem;
    gap: 0;
  }

  &--first {
    top: 50%;
    left: 50%;
    bottom: unset !important;
    border-radius: 0.75rem;
    transform: translate(-50%, calc(-50% + 2rem));
  }

  &-textarea {
    margin-inline: 0.25rem;
    width: calc(100% - 2.5rem);
    min-height: 5rem;
    max-height: calc(50 * var(--vh));
    box-sizing: border-box;
    transition: all 0.2s $ease-out-circ;

    .small-input & {
      width: calc(100% - 4rem);
      min-height: 1.75rem;
      max-height: 1.75rem;
      display: flex;
      align-items: center;
    }
  }

  &-toggle {
    cursor: pointer;
    position: absolute;

    &--expand {
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
    }

    &--collapse {
      right: 0.25rem;
      top: 0.25rem;
    }
  }

  &-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    background: rgba(var(--color-white) / 50%);
    opacity: 0.9;
    padding: 0.25rem 2rem 0.25rem 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;

    > * {
      flex-shrink: 0;
    }

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
  }

  &-send {
    position: absolute;
    right: 0.25rem;
    bottom: 0.25rem;
    width: 2rem;
    height: 2rem;
    margin-left: auto;
    background: var(--color-primary);
    color: white;
    border-radius: 35%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s $ease-out-circ;
    overflow: hidden;

    .small-input & {
      transform: scale(0.875);
      right: 2rem;
      bottom: 0.35rem;
    }

    &:hover,
    &:active {
      background: var(--color-primary-darker);
      box-shadow: $box-shadow-deeper;

      > .sending {
        animation: send 1.5s infinite;
        @keyframes send {
          0% {
            transform: translateY(150%);
          }
          30%,
          70% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-200%);
          }
        }
      }
    }

    &:active {
      box-shadow: $box-shadow-shallower;
      transform: scale(0.95);
    }
  }
}
</style>

<style lang="scss">
@use '@/assets/variables' as *;

.bar-fade-enter-from,
.bar-fade-leave-to {
  margin-bottom: -1.5rem;
  opacity: 0;
}

.bar-fade-enter-active,
.bar-fade-leave-active {
  //position: absolute;
  //left: 0;
  //right: 0;
  //bottom: 100%;
  transition: all 0.2s $ease-out-circ;
}
</style>
