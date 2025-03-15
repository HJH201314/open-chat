<script lang="ts" setup>
/**
 * CommonModal - 通用模态框
 **/
import type { CommonModalFunc, CommonModalProps } from '@/components/modal/types.ts';
import { useCommonModalStore } from '@/components/modal/store.ts';
import { Close } from '@icon-park/vue-next';
import { computed, nextTick, ref, toRef, useTemplateRef, watch } from 'vue';

defineOptions({
  // CommonModal 通过 teleport 传递到 body 上，不继承父级的属性
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CommonModalProps>(), {
  teleportTo: 'body',
  showClose: true,
  closeOnESC: false,
  visible: false,
  presetBody: false,
  maskStyle: () => ({}),
  modalStyle: () => ({}),
});

const emit = defineEmits<{
  (event: 'open'): void;
  (event: 'close'): void;
  (event: 'after-close'): void;
  (event: 'update:visible', v: boolean): void;
}>();

const store = useCommonModalStore();

const myDepth = ref(0);
const zIndex = computed(() => myDepth.value * 2 + 1000);

const showModal = ref(false);

/* 观测visibility，可以通过切换visibility切换展示状态 */
watch(
  () => props.visible,
  (v) => {
    // nextTick才真正改变可视，能够让props.visible从一开始就为true时也展示动画
    nextTick(() => {
      if (v) open();
      else close();
    });
  },
  { immediate: true }
);

/* 展示模态框（暴露的方法，配合ref使用） */
function open() {
  if (showModal.value) return;

  myDepth.value = store.openModal();
  showModal.value = true;
  emit('open');
}

/* 关闭模态框（暴露的方法，配合ref使用） */
function close() {
  if (!showModal.value) return;

  showModal.value = false;
  store.closeModal();
}

function afterClose() {
  emit('after-close');
}

watch(
  () => showModal.value,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      emit('update:visible', newVal);
    }
  }
);

const modalBodyRef = useTemplateRef('modal-body');
watch(modalBodyRef, (modalBodyRef) => {
  // 模态框展示时，自动 focus 到 modal-body，可以通过键盘 ESC 关闭
  if (modalBodyRef) {
    modalBodyRef.focus();
  }
});

function handleClose() {
  close();
  emit('close');
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.closeOnESC) return;
  if (e.key === 'Escape') {
    handleClose();
  }
}

defineSlots<{
  default(props: { close: typeof close; isShown: boolean }): any;
}>();

/* 暴露接口 */
defineExpose<CommonModalFunc>({
  open,
  close,
  isVisible: toRef(showModal),
});
</script>

<template>
  <Teleport :to="teleportTo" :disabled="!teleportTo">
    <Transition name="show" @after-leave="afterClose">
      <div v-if="showModal" :style="{ ...props.maskStyle, 'z-index': zIndex }" class="modal-mask">
        <Close v-if="showClose" class="modal-close" size="20" @click="handleClose" />
        <div
          ref="modal-body"
          :style="{ ...props.modalStyle, 'z-index': zIndex + 1 }"
          class="modal-body"
          :class="{ preset: presetBody }"
          tabindex="-1"
          @keydown="handleKeydown"
        >
          <!-- 对default slot暴露关闭方法，可以从v-slot中获取来关闭 -->
          <slot :close="close" :is-shown="showModal"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.modal {
  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-close {
    @include click-able;
    @include transition-all-circ;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 0 0.5rem 0 0.5rem;
  }

  &-body {
    width: 100%;
    height: 100%;
    display: flex; // 居中
    flex-direction: column;
    justify-content: center;
    align-items: center;
    outline: none;

    &.preset {
      // preset 情况下，高度由内容撑起，加个默认宽度
      width: 512px;
      height: unset;
      background-color: $color-white;
      border-radius: 0.5rem;
      box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
    }
  }
}

.show-enter-active,
.show-leave-active {
  z-index: 999;
  transition: opacity 0.2s $ease-out-circ;
}

.show-enter-from,
.show-leave-to {
  opacity: 0;
}
</style>
