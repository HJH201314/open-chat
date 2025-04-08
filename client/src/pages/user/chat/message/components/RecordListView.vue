<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import Toggle from '@/components/toggle/CusToggle.vue';
import CusToggle from '@/components/toggle/CusToggle.vue';
import { useDataStore } from '@/store/data/useDataStore.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import type { SessionInfo } from '@/types/data.ts';
import { MenuUnfold, Plus, ShareOne, Star } from '@icon-park/vue-next';
import { useRouteParams } from '@vueuse/router';
import { computed, h, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { DialogManager } from '@/components/dialog';
import ToastManager from '@/components/toast/ToastManager.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { onClickOutside, until, useEventBus, useScroll } from '@vueuse/core';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import { goToLogin } from '@/pages/user/login';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import { useTheme } from '@/components/theme/useTheme.ts';
import IconButton from '@/components/IconButton.vue';
import useGlobal from '@/commands/useGlobal.ts';
import { toggleSidebarExpandKey } from '@/constants/eventBusKeys.ts';
import { formatTime } from '@/utils/string.ts';
import CusPullRefresh from '@/components/pull-refresh/CusPullRefresh.vue';
import CusAvatar from '@/components/avatar/CusAvatar.vue';

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
const dataStore = useDataStore();
const chatConfigStore = useChatConfigStore();
const userStore = useUserStore();
const settingStore = useSettingStore();
const currentSessionId = useRouteParams<string>('sessionId');

onMounted(() => {
  until(() => userStore.isLogin)
    .toBe(true)
    .then(() => {
      until(() => dataStore.sessionsFirstLoaded)
        .toBe(true)
        .then(() => {
          dataStore.syncSessions();
        });
    });
});

async function handleAddRecord(defaultBotId?: number) {
  const sessionId = await dataStore.addDialog(defaultBotId ?? 0);
  if (!sessionId) return;

  handleListItemClick(sessionId);
  roleForm.modalVisible = false;
  if (roleForm.remember) {
    settingStore.saveSetting('roleRemember', true);
    settingStore.saveSetting('roleDefaultId', defaultBotId?.toString());
  }
  ToastManager.normal('开始对话吧~', { position: 'top-right' });
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
  if (dataStore.isSessionsEmpty) {
    console.debug('fetch user trigger immediately');
    await dataStore.syncSessions();
    return;
  }
  const softMode = ref(true);
  const dialog = DialogManager.createDialog(
    {
      title: '同步对话列表',
      subtitle: '此操作不可逆，确认继续吗？',
      async confirmHandler(controller) {
        if (!softMode.value) {
          ToastManager.danger('暂未支持');
          return;
        }
        console.debug('fetch use trigger confirmed');
        const syncRes = await dataStore.syncSessions(controller);
        if (!syncRes) {
          ToastManager.danger('同步失败，请稍后再试~', { position: 'top-left' });
        } else {
          ToastManager.normal('同步成功', { position: 'top-left' });
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

const toggleSideBarExpandBus = useEventBus(toggleSidebarExpandKey);

function handleSidebarUnfold() {
  toggleSideBarExpandBus.emit(true);
}

const router = useRouter();

// 点击对话列表项
function handleListItemClick(id: string) {
  const routerHandler = router.currentRoute.value.name === 'messageList' ? router.push : router.replace;
  routerHandler({
    name: 'messageDetail',
    params: {
      sessionId: id,
    },
  });
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

const dialogListRef = useTemplateRef<HTMLDivElement>('dialog-list');
const recordListViewRef = useTemplateRef('record-list-view');
const { arrivedState } = useScroll(dialogListRef);

const { theme } = useTheme();
const { isSmallScreen } = useGlobal();
</script>
<template>
  <!-- 角色列表 -->
  <div ref="record-list-view" class="dialog-list" :class="{ larger: isSmallScreen }">
    <div class="dialog-list-bar" :class="{ shadow: !arrivedState.top }">
      <IconButton
        v-if="isSmallScreen"
        type="secondary"
        color="#999999"
        no-normal-background
        @click="handleSidebarUnfold"
      >
        <MenuUnfold size="1.2em" />
      </IconButton>
      <!--      <div-->
      <!--        ref="search-bar"-->
      <!--        :class="{ 'dialog-list-bar-search': searchForm.inputting, 'dialog-list-action-button': !searchForm.inputting }"-->
      <!--        @click="handleSearchIconClick"-->
      <!--      >-->
      <!--        <Search size="1.2rem" />-->
      <!--        <input-->
      <!--          v-show="searchForm.inputting"-->
      <!--          ref="search-input"-->
      <!--          v-model="searchForm.searchVal"-->
      <!--          placeholder="搜索对话内容"-->
      <!--        />-->
      <!--        <span-->
      <!--          v-if="searchForm.inputting && searchForm.searchVal"-->
      <!--          class="dialog-list-bar-search-reset"-->
      <!--          @click="searchForm.searchVal = ''"-->
      <!--        >-->
      <!--          <CloseOne theme="filled" />-->
      <!--        </span>-->
      <!--      </div>-->
      <div v-show="!searchForm.inputting" class="dialog-list-new-dialog" @click="handleListAddClick">
        <span>开始新对话</span>
        <Plus size="1.2rem" theme="outline" />
        <CommonDialog
          v-model:visible="roleForm.modalVisible"
          title="选择角色"
          :show-close="true"
          :show-confirm="false"
          :show-cancel="false"
        >
          <div class="select-role">
            <div class="select-role-list">
              <div
                v-for="(item, i) in chatConfigStore.botsDropdown"
                :key="i"
                class="select-role-item"
                @click="handleAddRecord(Number(item.value))"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
          <template #action>
            <div style="display: flex; align-items: center">
              <Toggle v-model="roleForm.remember" label="记住本次选择" />
              <DiliButton style="margin-left: auto" text="直接开始→" type="primary" @click="handleAddRecord" />
            </div>
          </template>
        </CommonDialog>
      </div>
    </div>
    <CusPullRefresh
      ref="dialog-list"
      class="dialog-list-container"
      tip-pulling="继续下拉同步"
      tip-release="释放立即同步"
      tip-refreshing="同步中..."
      @refresh="dataStore.syncSessions"
    >
      <div>
        <div
          v-for="item in displayList"
          :key="item.id"
          :class="{ 'dialog-list-item-selected': item.id === currentSessionId }"
          class="dialog-list-item"
          @click="handleListItemClick(item.id)"
        >
          <CusAvatar style="opacity: 0.5;" :name="item.title?.trim() || ''" size="2.5em" shape="circle" />
          <div class="dialog-list-item__right">
            <div class="dialog-list-item__top">
              <div class="title">
                {{ item.title || '未命名对话' }}
              </div>
              <div class="datetime">
                {{ formatTime(new Date(item.createAt ?? '')) }}
              </div>
            </div>
            <div class="dialog-list-item__bottom">
              <div class="digest">
                {{ item.model || '-' }}
              </div>
              <div class="flags">
                <Star v-if="item.flags?.isStared" :fill="theme.colorWarning" theme="filled" />
                <ShareOne v-if="item.flags?.isShared" :fill="theme.colorInfo" theme="filled" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CusPullRefresh>
    <div v-if="!displayList.length" class="dialog-list-empty">
      <DiliButton
        v-if="!userStore.isLogin"
        type="secondary"
        text="登录"
        :button-style="{ width: '3em' }"
        @click="() => goToLogin()"
      />
      {{ userStore.isLogin ? '快来新建对话吧' : '后即刻开始' }}
    </div>
    <LoadingModal
      v-if="recordListViewRef"
      :teleport-to="recordListViewRef"
      :visible="dataStore.isFetchingSessions && dataStore.isSessionsEmpty"
      color="var(--color-primary)"
      tip="努力加载中..."
    ></LoadingModal>
  </div>
</template>
<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.dialog-list {
  position: relative;

  &.larger {
    // 通过 font-size 来控制字体和组件大小，移动端放大一点
    font-size: 1.1rem;
  }

  &-container {
    padding-top: 3em;
    //padding-inline: 0.5rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }

    &:focus-visible {
      border-radius: 0.75rem;
      background: $color-teal-20;
      outline: none;
    }
  }

  &-bar {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: min-content;
    gap: 0.25rem;
    padding: 0.5em;
    background-color: var(--color-white);
    transition: box-shadow 0.2s $ease-out-circ;

    &.shadow {
      box-shadow: $box-shadow-shallower;
    }

    &-search {
      flex: 1;
      height: 2em;
      border-radius: 0.5rem;
      // 此处 padding 让搜索图标位置不变
      padding-inline: calc(0.4rem - 2px);
      color: color.scale($color-primary, $alpha: -5%);
      border: 2px solid var(--color-primary);
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

  &-new-dialog {
    box-sizing: border-box;
    cursor: pointer;
    flex: 1;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    opacity: 0.85;
    border-radius: 0.5rem;
    font-weight: bold;
    transition: all 0.2s $ease-out-circ;

    &:hover {
      color: var(--color-white);
      background: var(--color-primary);
    }

    &:active {
      border-color: var(--color-primary-darker);
      background: var(--color-primary-darker);
    }
  }

  &-action-button {
    height: 2em;
    width: 2em;
    color: color.scale($color-primary, $alpha: -5%);
    background-color: color.scale($color-primary, $alpha: -85%);
    border-radius: 0.5rem;
    display: grid;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition:
      color,
      background-color 0.2s $ease-out-circ;
    opacity: 0.6;
    box-shadow: $box-shadow-shallower;

    &:hover {
      background-color: color.scale($color-primary, $alpha: -80%);
    }

    &:active {
      background-color: color.scale($color-primary, $alpha: -75%);
    }
  }

  &-item {
    padding: 0.5em;
    cursor: pointer;
    transition: background-color 0.2s $ease-out-cubic;
    display: flex;
    flex-direction: row;
    gap: 0.5em;

    &:not(&-selected):hover {
      // border-radius: 0;
      background-color: $color-grey-100;
    }

    &-selected {
      background-color: $color-teal-50;
    }

    & img {
      height: 3em;
      width: 3em;
      border-radius: 20%;
    }

    &__logo {
      height: 2.5em;
      width: 2.5em;
      border-radius: 20%;
    }

    &__right {
      flex: 1;
    }

    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        color: var(--color-black);
        font-weight: bold;
        font-size: 1rem;

        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      .datetime {
        flex: 0 0 auto;
        color: $color-grey-500;
        font-size: 0.75em;
        text-align: right;
      }
    }

    &__bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75em;

      .digest {
        color: $color-grey-500;
      }

      .flags {
        display: flex;
        align-items: center;
        gap: 0.1rem;
      }
    }
  }

  &-empty {
    text-wrap: nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-primary);
    font-size: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
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
      background-color: var(--color-primary);
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