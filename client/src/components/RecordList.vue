<script lang="ts" setup>
import DiliButton from '@/components/button/DiliButton.vue';
import CommonModal from '@/components/modal/CommonModal.vue';
import Toggle from '@/components/toggle/CusToggle.vue';
import { useDataStore } from '@/store/useDataStore';
import useRoleStore from '@/store/useRoleStore';
import { useSettingStore } from '@/store/useSettingStore';
import type { DialogInfo } from '@/types/data';
import { CloseOne, Plus, Search } from '@icon-park/vue-next';
import { useRouteParams } from '@vueuse/router';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
const dataStore = useDataStore();
const roleStore = useRoleStore();
const settingStore = useSettingStore();
const currentSessionId = useRouteParams<string>('sessionId');

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
  if (settingStore.settings.roleEnabled && settingStore.settings.roleRemember && settingStore.settings.roleDefaultId)
    handleAddRecord(parseInt(settingStore.settings.roleDefaultId ?? '1'));
  else if (!settingStore.settings.roleEnabled) handleAddRecord();
  else roleForm.modalVisible = true;
}

const router = useRouter();

// 点击对话列表项
function handleListItemClick(id: string) {
  const routerHandler = router.currentRoute.value.name === 'messageList' ? router.push : router.replace;
  routerHandler(`/message/${id}`);
}

const roleForm = reactive({
  modalVisible: false,
  remember: ref(settingStore.settings.roleRemember),
});

const searchForm = reactive({
  searchVal: '',
});

const searchList = ref<DialogInfo[]>([]);
watch(
  () => searchForm.searchVal,
  (newVal) => {
    if (newVal != '') {
      searchList.value = dataStore.searchDialog(newVal);
    } else {
      searchList.value = [];
    }
  }
);

const displayList = computed(() => {
  if (searchForm.searchVal) {
    return searchList.value;
  } else {
    return dataStore.dialogList;
  }
});
</script>
<template>
  <div class="message-left">
    <span style="text-align: center; font-weight: bold; margin-bottom: 0.25rem">对话 | Dialog</span>
    <!-- 角色列表 -->
    <div class="dialog-list">
      <div class="dialog-list-bar">
        <div class="dialog-list-bar-search">
          <span class="dialog-list-bar-search-icon"><Search /></span>
          <input v-model="searchForm.searchVal" autocomplete="new-password" placeholder="搜索对话" />
          <span v-if="searchForm.searchVal" class="dialog-list-bar-search-reset" @click="searchForm.searchVal = ''">
            <CloseOne theme="filled" />
          </span>
        </div>
        <div>
          <div class="dialog-list-add" @click="handleListAddClick">
            <Plus size="24" theme="outline" />
          </div>
          <CommonModal v-model:visible="roleForm.modalVisible" subtitle="单击角色以创建对话" title="选择角色">
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
      <div class="dialog-list-container">
        <div
          v-for="item in displayList"
          :key="item.id"
          :class="{ 'dialog-list-item-selected': item.id === currentSessionId }"
          class="dialog-list-item"
          @click="handleListItemClick(item.id)"
        >
          <img :src="item.avatarPath ? item.avatarPath : '/chatgpt3.svg'" alt="avatar" />
          <div class="dialog-list-item-center">
            <div class="title">
              {{ item.title }}
            </div>
            <div class="digest">
              {{ item.botRole }}
            </div>
          </div>
          <div class="dialog-list-item-right">
            <div class="datetime">
              {{ item.createAt ?? '' }}
            </div>
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

.message-left {
  display: flex;
  flex-direction: column;
}

.dialog-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-container {
    flex: 1;
    margin-top: 0.5rem;
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
    display: flex;
    flex-direction: row;
    height: min-content;
    gap: 0.25rem;

    &-search {
      flex: 1;
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      background-color: $color-grey-200;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s $ease-out-circ;

      &:focus-within {
        background-color: $color-grey-300;
      }

      &-icon {
        color: $color-grey-500;
      }

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
    height: 2rem;
    aspect-ratio: 1;
    background-color: $color-grey-200;
    border-radius: 0.5rem;
    color: $color-grey-400;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all 0.2s $ease-out-circ;

    &:hover {
      background-color: $color-grey-300;
    }
  }

  &-item {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s $ease-out-circ;
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