<script setup lang="ts">
import { Delete, Edit } from '@icon-park/vue-next';
import DiliButton from '@/components/button/DiliButton.vue';
import { computed } from 'vue';
import { useTheme } from '@/components/theme/useTheme.ts';

type UserItemCardProps = {
  avatar?: string;
  id?: number;
  username?: string;
  password?: string;
  permission?: number;
};
const props = withDefaults(defineProps<UserItemCardProps>(), {
  id: 1,
  username: '匿名',
  password: '',
  permission: 0,
});

const emit = defineEmits<{
  (event: 'edit', user: API.UserVO): void;
  (event: 'delete', user: API.UserVO): void;
}>();

const { theme } = useTheme();

const permissionName = computed(() => {
  return getPermissionName(props.permission);
});

function getPermissionName(permissionId: number) {
  switch (permissionId) {
    case 0:
      return '访客';
    case 1:
      return '用户';
    case 2:
      return '管理员';
  }
}
</script>

<template>
  <div class="user-item-card">
    <section class="avatar">
      <img :src="avatar ?? `/avatar/${Math.floor(Math.random() * 540) + 1}.gif`" />
    </section>
    <section class="info">
      <div class="username">
        {{ props.username }}
      </div>
      <div class="permission">
        权限:&nbsp;
        {{ props.permission }}
        ({{ permissionName }})
      </div>
      <div class="action">
        <DiliButton @click="$emit('edit', { ...props })">
          <edit :fill="theme.colorPrimary" />
          修改
        </DiliButton>
        <DiliButton @click="$emit('delete', { ...props })">
          <delete :fill="theme.colorDanger" />
          删除
        </DiliButton>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '@/assets/variables' as *;

.user-item-card {
  height: max-content;
  width: 333px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: color.adjust($color-primary-lighter, $lightness: 30%);
  transition: all 0.25s $ease-out-circ;
  display: flex;
  gap: 0.5rem;

  > .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .username {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .permission {
      display: flex;

      &-operate {
        &-button {
          border-radius: 50%;
        }
      }
    }

    .action {
      display: flex;
      gap: 0.5rem;
    }
  }

  > .avatar {
    border-radius: 0.5rem;
    overflow: hidden;

    img {
      height: 112px;
      width: 112px;
      object-fit: cover;
    }
  }
}
</style>
