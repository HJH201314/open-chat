<script lang="ts" setup>
/**
 * CommonModal - 通用模态框
 **/
import type { CommonModalFunc, CommonModalProps } from '@/components/modal/types.ts';
import { useCommonModalStore } from '@/components/modal/store.ts';
import { Close } from '@icon-park/vue-next';
import { computed, nextTick, onBeforeUnmount, ref, toRef, useTemplateRef, watch, watchEffect } from 'vue';
import { getRandomString } from '@/utils/string.ts';
import { nextFrame } from '@/utils/element.ts';

defineOptions({
  // CommonModal 通过 teleport 传递到 body 上，不继承父级的属性
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CommonModalProps>(), {
  teleportTo: 'body',
  showClose: true,
  showBodyTransition: true,
  closeOnESC: false,
  closeOnClickMask: false,
  visible: false,
  presetBody: false,
  enableMaskClickPass: false,
  maskStyle: () => ({}),
  modalStyle: () => ({}),
});

type CloseType = 'esc' | 'mask-click' | 'mask-rightclick' | 'button';
const emit = defineEmits<{
  (event: 'open', prevent: () => void): void;
  (event: 'close', prevent: () => void, type: CloseType): void;
  (event: 'after-close'): void;
  (event: 'update:visible', v: boolean): void;
}>();

const { modalMap, openModal, closeModal } = useCommonModalStore();

const myId = ref(getRandomString(10)); // 模态框全局唯一 ID
const myDepth = computed(() => modalMap[myId.value] || 0);
const zIndex = computed(() => props.forceZIndex || myDepth.value * 2 + 1000);

const showModal = ref(false);

/* 观测visibility，可以通过切换visibility切换展示状态 */
watch(
  () => props.visible,
  (v) => {
    if (v) open();
    else close();
  },
  { immediate: true }
);

/* 展示模态框（暴露的方法，配合ref使用） */
function open() {
  if (showModal.value || !!modalMap[myId.value]) return;

  // 触发事件，允许取消打开
  let prevented = false;
  emit('open', () => (prevented = true));
  if (prevented) return;

  myId.value = openModal();
  showModal.value = true;
}

/* 关闭模态框（暴露的方法，配合ref使用） */
function close() {
  if (!showModal.value || !modalMap[myId.value]) return;

  showModal.value = false; // 先开始关闭动画
  closeModal(myId.value); // 再移除模态框数据，否则可能会导致层级变化
  myId.value = '';
}

onBeforeUnmount(() => close());

function afterClose() {
  emit('after-close');
  // 关闭动画完成后再更新 visible 为 false，以便外部使用 visible 作为 v-if 条件时不会导致动画播放不完全
  emit('update:visible', false);
}

watch(
  () => showModal.value,
  (newVal, oldVal) => {
    if (newVal != oldVal && newVal == true) {
      // showModal 变化时内外同步 visible
      emit('update:visible', true);
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
const showModalBody = ref(false);
watchEffect(() => {
  // 这一行让 watchEffect 收集 showModal
  const collectShowModal = showModal.value;
  // 下一帧更新 ModalBody 的展示，以支持动画入场
  nextTick(() => {
    showModalBody.value = collectShowModal;
  });
});

// 关闭按钮点击
function handleClose(type: CloseType) {
  // 触发事件，允许取消关闭
  let prevented = false;
  emit('close', () => (prevented = true), type);
  if (prevented) return;

  close();
}

// 键盘按下 ESC 关闭
function handleKeydown(e: KeyboardEvent) {
  if (!props.closeOnESC) return;
  if (e.key === 'Escape') {
    handleClose('esc');
  }
}

// 遮罩点击关闭
function handleMaskClick(e: MouseEvent & { triggerByCusCommonModal?: boolean }) {
  if (!props.closeOnClickMask) return;

  handleClose(e.type == 'click' ? 'mask-click' : 'mask-rightclick');
  if (props.enableMaskClickPass && !e.triggerByCusCommonModal) {
    console.log(e);
    nextFrame(() => {
      const elBelow = document
        .elementsFromPoint(e.clientX, e.clientY)
        .filter((value) => !value.classList.contains('modal-mask'));
      if (elBelow.length) {
        // 创建一个新的点击事件，派发到下层元素
        const evt = new MouseEvent(e.type, Object.assign(e, { triggerByCusCommonModal: true }));
        elBelow[0].dispatchEvent(evt);
      }
    });
  }
}

defineSlots<{
  default(props: { close: typeof close; isShown: boolean; modalId: string }): any;
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
    <Transition name="show" @after-leave="afterClose" appear>
      <div
        v-if="showModal"
        ref="modal-mask"
        :style="{ ...props.maskStyle, 'z-index': zIndex }"
        class="modal-mask"
        @click="handleMaskClick($event)"
        @contextmenu.prevent="handleMaskClick($event)"
      >
        <Close v-if="showClose" class="modal-close" size="20" @click="handleClose('button')" />
      </div>
    </Transition>
    <Transition :name="modalTransitionName || (showBodyTransition && showModalBody ? 'x-expand' : 'x-expand')">
      <div
        v-show="showModalBody"
        ref="modal-body"
        :style="{ ...props.modalStyle, 'z-index': zIndex + 1 }"
        class="modal-body"
        :class="{ preset: presetBody }"
        tabindex="-1"
        @keydown="handleKeydown"
        @click.stop
      >
        <!-- 对default slot暴露关闭方法，可以从v-slot中获取来关闭 -->
        <slot :close="close" :is-shown="showModal" :modal-id="myId"></slot>
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
    background-color: rgba(0, 0, 0, 0.2);
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    outline: none;

    &.preset {
      // preset 情况下，高度由内容撑起
      width: 512px;
      max-height: calc(100vh - 2rem);
      max-width: calc(100vw - 2rem);
      height: unset;
      background-color: var(--color-white);
      border-radius: 0.5rem;
      box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
    }
  }
}

.show-enter-active,
.show-leave-active {
  z-index: 999;
  transition: opacity 0.1s $ease-out-circ;
}

.show-enter-from,
.show-leave-to {
  opacity: 0;
}

.x-expand {
  &-enter-active {
    transition:
      transform 0.15s $ease-out-circ,
      opacity 0.15s $ease-out-circ;
  }

  &-leave-active {
    transition:
      transform 0.1s $ease-out-circ,
      opacity 0.1s $ease-out-circ;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) rotate3d(1, 0, 0, 90deg);
  }
}
</style>
