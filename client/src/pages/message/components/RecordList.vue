<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import CommonModal from '@/components/modal/CommonModal.vue';
import Toggle from '@/components/toggle/CusToggle.vue';
import CusToggle from '@/components/toggle/CusToggle.vue';
import { useDataStore } from '@/store/data/useDataStore.ts';
import useRoleStore from '@/store/useRoleStore.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import type { SessionInfo } from '@/types/data.ts';
import { CloseOne, Plus, Refresh, Search } from '@icon-park/vue-next';
import { useRouteParams } from '@vueuse/router';
import { computed, h, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { DialogManager } from '@/components/dialog';
import ToastManager from '@/components/toast/ToastManager.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { onClickOutside, until, useScroll } from '@vueuse/core';

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
const dataStore = useDataStore();
const roleStore = useRoleStore();
const userStore = useUserStore();
const settingStore = useSettingStore();
const currentSessionId = useRouteParams<string>('sessionId');

onMounted(() => {
  dataStore.$subscribe((_, state) => {
    // 挂载时，如果没有对话数据，需要尝试刷新对话
    if (!state.sessions.length) {
      if (userStore.isLogin) {
        dataStore.fetchSessions();
      } else {
        router.replace('/login');
      }
    }
  });
});

async function handleAddRecord(roleId?: number) {
  const sessionId = await dataStore.addDialog(roleId ?? 1);
  if (!sessionId) return;

  if (roleId) {
    dataStore.sendMessageText(
      sessionId,
      (await roleStore.getRoleSentence(roleId)) +
        `当前时间: ${new Date().toLocaleString()}. ` +
        `准备好了就仅输出：我是你的${roleStore.roleIdMap.get(roleId)}，我们马上开始对话吧！`
    );
  }
  handleListItemClick(sessionId);
  roleForm.modalVisible = false;
  if (roleForm.remember) {
    settingStore.saveSetting('roleRemember', true);
    settingStore.saveSetting('roleDefaultId', roleId?.toString());
  }
}

function handleListAddClick() {
  if (!userStore.isLogin) {
    ToastManager.danger('请先登录');
    return;
  }
  if (settingStore.settings.roleEnabled && settingStore.settings.roleRemember && settingStore.settings.roleDefaultId)
    handleAddRecord(parseInt(settingStore.settings.roleDefaultId ?? '1'));
  else if (!settingStore.settings.roleEnabled) handleAddRecord();
  else roleForm.modalVisible = true;
}

const handleSessionRefresh = async () => {
  if (!userStore.isLogin) {
    ToastManager.danger('请先登录');
    return;
  }
  const softMode = ref(true);
  const dialog = DialogManager.createDialog(
    {
      title: '同步对话数据',
      subtitle: '此操作不可逆，确认继续吗？',
      async confirmHandler(controller) {
        if (!softMode.value) {
          ToastManager.danger('暂未支持');
          return;
        }
        try {
          await dataStore.fetchSessions(controller);
        } catch (_) {
          ToastManager.danger('同步异常，请稍后重试～');
        }
      },
    },
    {
      action: () =>
        h(CusToggle, {
          modelValue: softMode.value,
          label: '保留本地数据',
          onChange(t) {
            softMode.value = t;
          },
        }),
    }
  );
  // 根据开关软拉取模式，改变模态框的内容
  watchEffect(() => {
    const content = softMode.value
      ? '此操作将会从服务器拉取对话数据：<br/>  1. 拉取服务器对比本地的增量对话<br/>  2. 不会删除本地的冗余对话'
      : '此操作将会从服务器拉取对话数据：<br/>  1. 拉取服务器对比本地的增量对话<br/>  2. <strong style="color: var(--color-danger);">删除</strong>本地的冗余对话';
    dialog.update({
      content,
      confirmButtonProps: {
        backgroundColor: softMode.value ? '' : 'var(--color-danger)',
      },
    });
  });
};

const router = useRouter();

// 点击对话列表项
function handleListItemClick(id: string) {
  const routerHandler = router.currentRoute.value.name === 'messageList' ? router.push : router.replace;
  routerHandler(`/chat/message/${id}`);
}

const roleForm = reactive({
  modalVisible: false,
  remember: ref(settingStore.settings.roleRemember),
});

const searchForm = reactive({
  inputting: false,
  searchVal: '',
});

const searchInputRef = useTemplateRef('search-input');
async function handleSearchIconClick() {
  searchForm.inputting = true;
  await until(() => searchInputRef.value).not.toBeNull();
  searchInputRef.value?.focus();
}
onClickOutside(useTemplateRef('search-bar'), () => {
  searchForm.inputting = false;
});

const searchList = ref<SessionInfo[]>([]);
watch(
  () => searchForm.searchVal,
  async (newVal) => {
    if (newVal != '') {
      searchList.value = await dataStore.searchDialog(newVal);
    } else {
      searchList.value = [];
    }
  }
);

const displayList = computed(() => {
  if (searchForm.searchVal) {
    return searchList.value;
  } else {
    return dataStore.sessions;
  }
});

const dialogListRef = useTemplateRef('dialog-list');
const { arrivedState } = useScroll(dialogListRef);
</script>
<template>
  <!-- 角色列表 -->
  <div class="dialog-list">
    <div class="dialog-list-bar" :class="{ 'shadow': !arrivedState.top }">
      <div
        ref="search-bar"
        :class="{ 'dialog-list-bar-search': searchForm.inputting, 'dialog-list-action-button': !searchForm.inputting }"
        @click="handleSearchIconClick"
      >
        <Search size="1.2rem" />
        <input v-show="searchForm.inputting" ref="search-input" v-model="searchForm.searchVal" placeholder="搜索对话内容" />
        <span v-if="searchForm.inputting && searchForm.searchVal" class="dialog-list-bar-search-reset" @click="searchForm.searchVal = ''">
          <CloseOne theme="filled" />
        </span>
      </div>
      <div v-show="!searchForm.inputting" class="dialog-list-action-button" @click="handleSessionRefresh">
        <Refresh size="1.2rem" theme="outline" />
      </div>
      <div v-show="!searchForm.inputting" class="dialog-list-add" @click="handleListAddClick">
        <span>开始新对话</span>
        <Plus size="1.2rem" theme="outline" />
        <CommonModal v-model:visible="roleForm.modalVisible">
          <div class="select-role">
            <div class="select-role-title">选择角色</div>
            <div class="select-role-list">
              <div
                v-for="(item, i) in roleStore.roles"
                :key="i"
                class="select-role-item"
                @click="handleAddRecord(item[0])"
              >
                {{ item[1] }}
              </div>
            </div>
            <div style="display: flex; align-items: center">
              <Toggle v-model="roleForm.remember" label="记住本次选择" style="margin-top: 1rem" />
              <DiliButton style="margin-left: auto" text="直接开始→" type="primary" @click="handleAddRecord" />
            </div>
          </div>
        </CommonModal>
      </div>
    </div>
    <div ref="dialog-list" class="dialog-list-container">
      <div
        v-for="item in displayList"
        :key="item.id"
        :class="{ 'dialog-list-item-selected': item.id === currentSessionId }"
        class="dialog-list-item"
        @click="handleListItemClick(item.id)"
      >
        <img :src="item.avatar ? item.avatar : '/chatgpt3.svg'" alt="avatar" />
        <div class="dialog-list-item-center">
          <div class="title">
            {{ item.title || '未命名对话' }}
          </div>
          <div class="digest">
            {{ item.botRole }}
          </div>
        </div>
        <div class="dialog-list-item-right">
          <div class="datetime">
            {{ new Date(item.createAt ?? '').toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.dialog-list {
  position: relative;

  &-container {
    padding-top: 3rem;
    padding-inline: 0.5rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    height: min-content;
    gap: 0.25rem;
    padding: 0.5rem;
    background-color: rgba(255 255 255 / 75%);
    backdrop-filter: blur(10px);
    transition: box-shadow 0.2s $ease-out-circ;

    &.shadow {
      box-shadow: $box-shadow-shallower;
    }

    &-search {
      flex: 1;
      height: 2rem;
      border-radius: 0.5rem;
      // 此处 padding 让搜索图标位置不变
      padding-inline: calc(0.4rem - 2px);
      color: color.scale($color-primary, $alpha: -5%);
      border: 2px solid $color-primary;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: flex 0.2s $ease-out-circ;
      opacity: 0.6;

      &-reset {
        cursor: pointer;
        color: $color-grey-500;
        transition: color 0.2s $ease-out-circ;

        &:hover {
          color: color.adjust($color-grey-500, $lightness: -10%);
        }
      }

      input {
        width: 100%;
        background: transparent;
        outline: none;
      }
    }
  }

  &-add {
    box-sizing: border-box;
    box-shadow: $box-shadow-shallower;
    cursor: pointer;
    flex: 1;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: $color-primary;
    background-color: color.scale($color-primary, $alpha: -90%);
    border-radius: 0.5rem;
    transition: color, background-color 0.2s $ease-out-circ;

    &:hover {
      background-color: color.scale($color-primary, $alpha: -85%);
      color: color.scale($color-primary, $blackness: 5%);
    }

    &:active {
      background-color: color.scale($color-primary, $alpha: -80%);
      color: color.scale($color-primary, $blackness: 10%);
    }
  }

  &-action-button {
    height: 2rem;
    width: 2rem;
    color: color.scale($color-primary, $alpha: -5%);
    background-color: color.scale($color-primary, $alpha: -90%);
    border-radius: 0.5rem;
    display: grid;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: color, background-color 0.2s $ease-out-circ;
    opacity: 0.6;
    box-shadow: $box-shadow-shallower;

    &:hover {
      background-color: color.scale($color-primary, $alpha: -85%);
    }

    &:active {
      background-color: color.scale($color-primary, $alpha: -80%);
    }
  }

  &-item {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s $ease-out-cubic;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    &:not(&-selected):hover {
      // border-radius: 0;
      background-color: $color-grey-100;
    }

    &-selected {
      background-color: $color-teal-50;
    }

    & img {
      height: 3rem;
      width: 3rem;
      border-radius: 20%;
    }

    &-center {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;

      .title {
        font-weight: bold;
        font-size: 1.1rem;

        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      .digest {
        color: $color-grey-500;
        font-size: 0.8rem;
        // 超过长度显示省略号
        text-overflow: ellipsis;
      }
    }

    &-right {
      width: 4rem;

      .datetime {
        font-size: 0.7rem;
        text-align: right;
      }
    }
  }
}

.record-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &-action {
    &-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    &-item {
      flex: 1;
      border-radius: 0.5rem;
      cursor: pointer;
      text-align: center;
      background-color: $color-teal-50;
    }
  }

  &-list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.select-role {
  padding: 1rem;

  &-title {
    @include page-title;
    margin-bottom: 1rem;
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &-item {
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    line-height: 1.5rem;
    transition: all 0.2s $ease-out-circ;
    background-color: $color-grey-100;

    &:hover {
      font-size: 1.1rem;
      line-height: 1.5rem;
      background-color: $color-primary;
      color: $color-white;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.25s;
}

.bounce-leave-active {
  animation: bounce-in 0.25s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  35% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>