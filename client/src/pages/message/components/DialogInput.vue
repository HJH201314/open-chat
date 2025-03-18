<script lang="ts" setup>
import { ArrowUp, CollapseTextInput, ExpandTextInput } from '@icon-park/vue-next';
import CusSelect from '@/components/dropdown/CusSelect.vue';
import CusTextarea from '@/components/textarea/CusTextarea.vue';
import CusToggle from '@/components/toggle/CusToggle.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import type { DropdownOption } from '@/components/dropdown/types.ts';
import { ref } from 'vue';

interface Props {
  providerDropdown: DropdownOption[];
  isSmallScreen: boolean;
  isEmptySession: boolean;
  isReceivingMsg: boolean;
  messageSyncing: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  providerDropdown: () => [],
  isSmallScreen: false,
  isEmptySession: false,
  isReceivingMsg: false,
  messageSyncing: false,
});

const inputModelName = defineModel<string>('inputModelName', { default: '' });
const inputWithContext = defineModel<boolean>('inputWithContext', { default: true });
const inputUserInput = defineModel<string>('inputUserInput', { default: '' });

const emit = defineEmits<{
  (e: 'update:model', value: any): void;
  (e: 'send'): void;
  (e: 'modelSelect', path: string[]): void;
}>();

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
</script>

<template>
  <div
    :class="{
      'dialog-input--first': isEmptySession && !isSmallScreen,
      'small-input': smallInput,
      hide: messageSyncing,
    }"
    class="dialog-input"
  >
    <Transition name="slide-top-fade">
      <div v-show="!smallInput" class="dialog-input-bar">
        <CusSelect
          :model-value="inputModelName"
          :label-render-text="(_, path) => path?.map((o) => o.label)?.join('/')"
          :options="providerDropdown"
          :toggle-style="{ opacity: 0.75 }"
          position="top"
          style="font-size: 0.75rem"
          @select="(v, o, path) => handleModelSelect(path)"
        />
        <CusToggle
          v-model="inputWithContext"
          highlight
          label="上下文"
          style="font-size: 0.75rem; opacity: 0.75"
        ></CusToggle>
      </div>
    </Transition>
    <div class="dialog-input-toggle" :class="{ 'dialog-input-toggle--expand': smallInput, 'dialog-input-toggle--collapse': !smallInput }" @click="smallInput = !smallInput">
      <CollapseTextInput v-if="!smallInput" size="16" />
      <ExpandTextInput v-else size="16" />
    </div>
    <CusTextarea
      v-model="inputUserInput"
      :textarea-attr="{ placeholder: '随便问点啥(●\'◡\'●)' }"
      class="dialog-input-textarea"
      @keydown="handleInputKeydown"
    />
    <div class="dialog-input-send" @click="$emit('send')">
      <ArrowUp v-if="!isReceivingMsg" class="sending" fill="white" size="16" />
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
  width: calc(100% - 2rem);
  max-width: $dialog-max-width;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background-color: color.scale($color-grey-100, $alpha: -20%);
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.25rem;
  backdrop-filter: blur(10px);
  box-shadow: $box-shadow;
  transition: all 0.2s $ease-out-circ;

  &:focus-within {
    bottom: 0.35rem;
    border-radius: 0.75rem;
    box-shadow: $next-box-shadow-medium;
  }

  &.hide {
    height: 0;
  }

  &.small-input {
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
    height: 5rem;
    box-sizing: border-box;
    transition: all 0.2s $ease-out-circ;

    .small-input & {
      width: calc(100% - 4rem);
      height: 2rem;
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
    }

    &:hover,
    &:active {
      background: $color-primary-darker;
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

.slide-top-fade-enter-from,
.slide-top-fade-leave-to {
  margin-bottom: -1.5rem;
  opacity: 0;
}

.slide-top-fade-enter-active,
.slide-top-fade-leave-active {
  transition: all 0.2s $ease-out-circ;
}
</style>