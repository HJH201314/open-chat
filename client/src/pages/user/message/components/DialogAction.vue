<script lang="ts" setup>
import { Back, Control, Delete, Edit, More, Refresh, Share, Star, WrongUser } from '@icon-park/vue-next';
import IconButton from '@/components/IconButton.vue';
import CusTooltip from '@/components/tooltip/CusTooltip.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import type { DialogActionEmits, DialogActionProps } from '@/pages/user/message/components/types.ts';
import { ref } from 'vue';

const props = withDefaults(defineProps<DialogActionProps>(), {
  title: '',
  messageCount: 0,
  hasPermission: true,
  isLogin: false,
  isStarted: false,
  messageSyncing: false,
  menuInMore: false,
});

const emit = defineEmits<DialogActionEmits>();

const showMenu = ref(false);
</script>

<template>
  <div class="dialog-action">
    <div class="dialog-action-area-left">
      <IconButton type="secondary" style="flex-shrink: 0" @click="$emit('back')">
        <Back size="16" />
      </IconButton>
      <div v-if="!hasPermission" class="dialog-action-tip" @click="$emit('actionTipClick')">
        <WrongUser />
        <span v-if="!isLogin">未登录</span>
        <span v-else>无权限</span>
      </div>
      <span class="dialog-action-title">
        {{ title || '未命名对话' }}
      </span>
      <span class="dialog-action-subtitle"> {{ messageCount }} 条消息 </span>
    </div>
    <IconButton v-if="menuInMore" type="secondary" color="grey" style="flex-shrink: 0" @click="showMenu = !showMenu">
      <More size="16" theme="filled" />
    </IconButton>
    <Transition name="menu-flow-in-out">
      <section v-if="!menuInMore || showMenu" class="dialog-action-menu" :class="{ 'dialog-action-menu--flow': menuInMore }">
        <CusTooltip text="收藏对话" position="bottom">
          <IconButton type="secondary" color="warning" style="flex-shrink: 0" @click="$emit('star')">
            <Star size="16" :theme="isStared ? 'filled' : 'outline'" />
          </IconButton>
        </CusTooltip>
        <CusTooltip text="分享对话" position="bottom">
          <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="$emit('share')">
            <Share size="16" />
          </IconButton>
        </CusTooltip>
        <CusTooltip text="刷新对话" position="bottom">
          <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="$emit('sync')">
            <cus-spin :show="messageSyncing">
              <Refresh size="16" />
            </cus-spin>
          </IconButton>
        </CusTooltip>
        <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="$emit('edit')">
          <Edit size="16" />
        </IconButton>
        <IconButton type="secondary" color="info" style="flex-shrink: 0" @click="$emit('editSystemPrompt')">
          <Control size="16" />
        </IconButton>
        <IconButton type="secondary" color="danger" style="flex-shrink: 0" @click="$emit('delete')">
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
  background-color: rgba(255 255 255 / 75%);
  backdrop-filter: blur(10px);
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
    text-align: center;
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

    &--flow {
      padding: 0.5rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: $box-shadow;
      position: absolute;
      top: 100%;
    }
  }
}
</style>
<style lang="scss">
@use "@/assets/variables" as *;

.menu-flow-in-out {
  &-enter-active,
  &-leave-active {
    transition: all 0.2s $ease-out-circ;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>