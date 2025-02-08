<script setup lang="ts">
import { useCommonModalStore } from '@/components/modal/useCommonModalStore';

/**
 * CommonModal - 通用模态框
 * 作为Vue使用
 * @author HJH201314
 *
 * */
import { Close } from '@icon-park/vue-next';
import { computed, type CSSProperties, nextTick, ref, toRef, watch } from 'vue';
import type { CommonModalFunc } from '@/components/modal/CommonModal';

interface CommonModalProps {
  showClose?: boolean;
  visible?: boolean; // 默认不展示
  modalStyle?: CSSProperties;
}

const props = withDefaults(defineProps<CommonModalProps>(), {
  showClose: true,
  visible: false,
});

const emit = defineEmits<{
  (event: 'onOpen'): void;
  (event: 'onClose'): void;
  (event: 'update:visible', v: boolean): void;
}>();

const showModal = ref(false);

/* 观测visibility，可以通过切换visibility切换展示状态 */
watch(
  () => props.visible,
  (v) => {
    // nextTick才真正改变可视，能够让props.visible从一开始就为true时也展示动画
    nextTick(() => {
      showModal.value = v;
    });
  },
  { immediate: true }
);

const store = useCommonModalStore();

const myDepth = ref(0);
const zIndex = computed(() => myDepth.value * 2 + 1000);

/* 展示模态框（暴露的方法，配合ref使用） */
function open() {
  if (showModal.value) return;

  showModal.value = true;
  myDepth.value = store.openModal();
}

/**
 *  关闭模态框（暴露的方法，配合ref使用）
 *  @param callbackFn 动画执行完毕后执行回调
 */
function close(callbackFn?: () => void) {
  if (!showModal.value) return;

  showModal.value = false;
  store.closeModal();
  callbackFn?.();
}

watch(
  () => showModal.value,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      emit('update:visible', newVal);
    }
  }
);

function handleClose() {
  close();
  emit('onClose');
}

/* 暴露接口 */
defineExpose<CommonModalFunc>({
  open,
  close,
  isVisible: toRef(showModal),
});
</script>

<template>
  <Teleport to="body">
    <Transition name="show">
      <div v-show="showModal" class="modal" :class="{ 'modal-hide': !showModal }">
        <div class="modal-mask"></div>
        <div class="modal-body" :style="props.modalStyle">
          <Close v-if="showClose" class="modal-body-close" size="20" @click="handleClose" />
          <div class="modal-body-content">
            <!-- 对default slot暴露关闭方法，可以从v-slot中获取来关闭 -->
            <slot :isShown="showModal" :close="close"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';

.modal {
  visibility: unset;

  &-hide {
    visibility: hidden;
  }

  &-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: v-bind(zIndex);
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &-body {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 512px; // 加个默认宽度不然组件有没有生效都不知道
    max-width: calc(100% - 2rem);
    max-height: calc(100% - 2rem);
    z-index: calc(v-bind(zIndex) + 1);
    background-color: $color-white;
    border-radius: 0.5rem;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
    display: flex; // 由于&-content是由内容撑起来的，这里设置为flex，能够让子元素撑起并占满&-body
    flex-direction: column;
    overflow: hidden;

    &-close {
      @extend %click-able;
      @extend %transition-all-circ;
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.25rem;
      cursor: pointer;
      border-radius: 0 0.5rem 0 0.5rem;
    }

    &-content {
      flex: 1;
      overflow: auto;
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