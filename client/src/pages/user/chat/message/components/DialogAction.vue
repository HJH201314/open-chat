<script lang="ts" setup>
import { Back, Delete, Edit, More, Refresh, ShareOne, Star } from '@icon-park/vue-next';
import CusTooltip from '@/components/tooltip/CusTooltip.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import {
  type DialogActionEmits,
  type DialogActionProps,
  DialogDetailSlotsInjectionKey,
} from '@/pages/user/chat/message/components/types.ts';
import { inject, ref, watch, watchEffect } from 'vue';
import DiliButton from '@/components/button/DiliButton.vue';

const props = withDefaults(defineProps<DialogActionProps>(), {
  title: '',
  messageCount: 0,
  hasPermission: true,
  isLogin: false,
  isStared: false,
  isShared: false,
  messageSyncing: false,
  menuInMore: false,
  showMenu: true,
  canExpandMenu: true,
  shadowed: false,
});
watch(
  () => props.canExpandMenu,
  (newShowMenu) => {
    if (!newShowMenu) innerShowMenu.value = false;
  }
);

const emit = defineEmits<DialogActionEmits>();

// 向父组件传递根元素 ref
const detailSlots = inject(DialogDetailSlotsInjectionKey);
const actionRef = ref<HTMLDivElement>();
watchEffect(() => {
  detailSlots?.setActionRef(actionRef);
});

const innerShowMenu = ref(false);

defineSlots<{
  back: () => any;
  title: () => any;
}>();
</script>

<template>
  <div ref="actionRef" class="dialog-action" :class="{ shadow: shadowed }">
    <div class="dialog-action-area-left">
      <DiliButton
        v-if="!$slots.back"
        type="normal"
        color="var(--color-black)"
        style="flex-shrink: 0"
        @click="$emit('back')"
      >
        <Back size="16" />
      </DiliButton>
      <slot v-else name="back" />
      <!--      <div v-if="!hasPermission" class="dialog-action-tip" @click="$emit('actionTipClick')">-->
      <!--        <WrongUser />-->
      <!--        <span v-if="!isLogin">未登录</span>-->
      <!--        <span v-else>无权限</span>-->
      <!--      </div>-->
      <div v-if="!$slots.title" class="dialog-action-title">
        {{ title || '未命名对话' }}
      </div>
      <slot v-else name="title" />
      <!--      <span class="dialog-action-subtitle"> {{ messageCount }} 条消息 </span>-->
    </div>
    <DiliButton
      v-if="menuInMore && showMenu"
      type="normal"
      style="flex-shrink: 0; opacity: 0.75"
      no-normal-background
      @click="innerShowMenu = !innerShowMenu"
    >
      <More size="16" theme="filled" />
    </DiliButton>
    <Transition name="action-flow-in-out" type="animation">
      <section
        v-if="showMenu && (!menuInMore || innerShowMenu)"
        class="dialog-action-menu"
        :class="{ 'dialog-action-menu--flow': menuInMore }"
      >
        <CusTooltip text="收藏对话" position="bottom">
          <DiliButton
            :type="isStared ? 'secondary' : 'tertiary'"
            color="var(--color-warning)"
            style="flex-shrink: 0"
            @click="$emit('star')"
          >
            <Star size="16" :theme="isStared ? 'filled' : 'outline'" />
          </DiliButton>
        </CusTooltip>
        <CusTooltip text="分享对话" position="bottom">
          <DiliButton :type="isShared ? 'secondary' : 'tertiary'" style="flex-shrink: 0" @click="$emit('share')">
            <ShareOne size="16" :theme="isShared ? 'filled' : 'outline'" />
          </DiliButton>
        </CusTooltip>
        <CusTooltip text="刷新对话" position="bottom">
          <DiliButton type="tertiary" style="flex-shrink: 0" @click="$emit('sync')">
            <cus-spin :show="messageSyncing">
              <Refresh size="16" />
            </cus-spin>
          </DiliButton>
        </CusTooltip>
        <DiliButton type="tertiary" style="flex-shrink: 0" @click="$emit('edit')">
          <Edit size="16" />
        </DiliButton>
        <DiliButton type="tertiary" color="var(--color-danger)" style="flex-shrink: 0" @click="$emit('delete')">
          <Delete size="16" />
        </DiliButton>
      </section>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;

.dialog-action {
  // 作为纯渲染组件，此处不添加 position 定位方式
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: var(--color-black);
  background: var(--color-white);

  &.shadow {
    box-shadow: $box-shadow-shallower;
  }

  &-area-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    flex: auto;
  }

  &-title {
    font-weight: bold;
    font-size: 20px;

    display: -webkit-box;
    word-break: break-all;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  &-subtitle {
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  &-tip {
    flex-shrink: 0;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.25rem;
    color: $color-danger;
    background-color: color.scale($color-danger, $alpha: -85%);
  }

  &-menu {
    display: flex;
    gap: 0.5rem;

    > :not(:first-child) {
      // 定位
      position: relative;

      // 竖线
      &:before {
        content: '';
        position: absolute;
        left: -0.25rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 1rem;
        background: var(--color-trans-100);
      }
    }

    &--flow {
      gap: 0.25rem;
      padding: 0.25rem;
      background: var(--color-white);
      border-radius: 0.5rem;
      box-shadow: $box-shadow-right-bottom;
      position: absolute;
      top: 0.25rem;
      right: 3rem;
    }
  }
}

.action-flow-in-out {
  &-enter-active {
    animation: action-flow-in-out-anim 0.2s $ease-in-out-back;
  }

  &-leave-active {
    animation: action-flow-in-out-anim 0.2s $ease-in-out-back reverse;
  }

  @keyframes action-flow-in-out-anim {
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
