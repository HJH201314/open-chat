<script lang="ts" setup>
import { Back, Control, Delete, Edit, More, Refresh, Share, Star } from '@icon-park/vue-next';
import IconButton from '@/components/IconButton.vue';
import CusTooltip from '@/components/tooltip/CusTooltip.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import type { DialogActionEmits, DialogActionProps } from '@/pages/user/chat/message/components/types.ts';
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<DialogActionProps>(), {
  title: '',
  messageCount: 0,
  hasPermission: true,
  isLogin: false,
  isStarted: false,
  messageSyncing: false,
  menuInMore: false,
  canShowMenu: true,
  shadowed: false,
});
watch(() => props.canShowMenu, (newShowMenu) => {
  if (!newShowMenu) innerShowMenu.value = false;
})

const emit = defineEmits<DialogActionEmits>();

const innerShowMenu = ref(false);
</script>

<template>
  <div class="dialog-action" :class="{ shadow: shadowed }">
    <div class="dialog-action-area-left">
      <IconButton
        type="secondary"
        color="#00110F"
        no-normal-background
        style="flex-shrink: 0; opacity: 0.75"
        @click="$emit('back')"
      >
        <Back size="16" />
      </IconButton>
      <!--      <div v-if="!hasPermission" class="dialog-action-tip" @click="$emit('actionTipClick')">-->
      <!--        <WrongUser />-->
      <!--        <span v-if="!isLogin">未登录</span>-->
      <!--        <span v-else>无权限</span>-->
      <!--      </div>-->
      <div class="dialog-action-title">
        {{ title || '未命名对话' }}
      </div>
      <!--      <span class="dialog-action-subtitle"> {{ messageCount }} 条消息 </span>-->
    </div>
    <IconButton
      v-if="menuInMore"
      type="secondary"
      color="#00110F"
      style="flex-shrink: 0; opacity: 0.75"
      no-normal-background
      @click="innerShowMenu = !innerShowMenu"
    >
      <More size="16" theme="filled" />
    </IconButton>
    <Transition name="action-flow-in-out" type="animation">
      <section
        v-if="!menuInMore || innerShowMenu"
        class="dialog-action-menu"
        :class="{ 'dialog-action-menu--flow': menuInMore }"
      >
        <CusTooltip text="收藏对话" position="bottom">
          <IconButton type="secondary" color="warning" :no-normal-background="!isStared" style="flex-shrink: 0" @click="$emit('star')">
            <Star size="16" :theme="isStared ? 'filled' : 'outline'" />
          </IconButton>
        </CusTooltip>
        <CusTooltip text="分享对话" position="bottom">
          <IconButton type="secondary" color="info" no-normal-background style="flex-shrink: 0" @click="$emit('share')">
            <Share size="16" />
          </IconButton>
        </CusTooltip>
        <CusTooltip text="刷新对话" position="bottom">
          <IconButton type="secondary" color="info" no-normal-background style="flex-shrink: 0" @click="$emit('sync')">
            <cus-spin :show="messageSyncing">
              <Refresh size="16" />
            </cus-spin>
          </IconButton>
        </CusTooltip>
        <IconButton type="secondary" color="info" no-normal-background style="flex-shrink: 0" @click="$emit('edit')">
          <Edit size="16" />
        </IconButton>
        <IconButton type="secondary" color="danger" no-normal-background style="flex-shrink: 0" @click="$emit('delete')">
          <Delete size="16" />
        </IconButton>
      </section>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;

.dialog-action {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: var(--color-black);
  background: var(--color-white);
  z-index: 1;

  &.shadow {
    box-shadow: $box-shadow-shallower;
  }

  &-area-left {
    margin-right: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
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
        background: $color-grey-100;
      }
    }

    &--flow {
      gap: 0.25rem;
      padding: 0.25rem;
      background: rgba(255 255 255 / 99%);
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
