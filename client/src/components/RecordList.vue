<script setup lang="ts">
import DiliButton from '@/components/button/DiliButton.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { CloseOne, Plus, Search } from '@icon-park/vue-next';
import { useDataStore } from '@/store/useDataStore';
import CommonModal from '@/components/modal/CommonModal.vue';
import Toggle from '@/components/toggle/CusToggle.vue';
import useRoleStore from '@/store/useRoleStore';
import { useSettingStore } from '@/store/useSettingStore';
import type { DialogInfo } from '@/types/data';

type RecordViewProps = {
  model: string;
};
const props  = withDefaults(
  defineProps<RecordViewProps>(),
  {
    model: 'normal'
  }
);

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

type RecordListItem = {
  id: number;
  title: string;
  digest: string;
  dialogNum: number;
  createAt: string;
  avatarPath: string;
};
const dataStore = useDataStore();
const roleStore = useRoleStore();
const settingStore = useSettingStore();
const currentDialogId = ref<string>('1');

onMounted(() => {
});

async function handleAddRecord(roleId?: number) {
  const sessionId = await dataStore.addDialog(roleId ?? 1);
  if (roleId) {
    dataStore.sendMessageText(sessionId, (await roleStore.getRoleSentence(roleId) +
      `当前时间: ${new Date().toLocaleString()}. ` +
      // '请将我后续发送的第一句话总结为一个标题（十个字左右），添加到你回复的开头，输出格式为[title:总结出的标题]。' +
      '当你认为聊天主题发生变化时，将聊天内容总结为一个标题（十个字左右），添加到你回复的开头，输出格式为[title:总结出的标题]。' +
      `准备好了就仅输出：我是你的${roleStore.roleIdMap.get(roleId)}，我们马上开始对话吧！`) ?? '');
  }
  handleListItemClick(sessionId);
  roleForm.modalVisible = false;
  if (roleForm.remember) {
    settingStore.saveSetting('roleRemember', true);
    settingStore.saveSetting('roleDefaultId', roleId?.toString());
  }
}
function handleListAddClick() {
  console.log(roleForm.remember)
  if (settingStore.settings.roleRemember && settingStore.settings.roleDefaultId)
    handleAddRecord(parseInt(settingStore.settings.roleDefaultId ?? '1'));
  else
    roleForm.modalVisible = true;
}
function handleListItemClick(id: string) {
  // 点击对话列表项
  currentDialogId.value = id;
  // nextTick(() => {
    emit('change', currentDialogId.value);
  // });
}

const roleForm = reactive({
  modalVisible: false,
  remember: ref(settingStore.settings.roleRemember),
});

const searchForm = reactive({
  searchVal: '',
});

const searchList = ref<DialogInfo[]>([]);
watch(() => searchForm.searchVal, (newVal) => {
  if (newVal != '') {
    searchList.value = dataStore.searchDialog(newVal);
  } else {
    searchList.value = [];
  }
})

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
    <span style="text-align: center; font-weight: bold; margin-bottom: .25rem;">对话 | Dialog</span>
    <!-- 角色列表 -->
    <div class="dialog-list">
      <div class="dialog-list-bar">
        <div class="dialog-list-bar-search">
          <span class="dialog-list-bar-search-icon"><Search /></span>
          <input placeholder="搜索对话" autocomplete="new-password" v-model="searchForm.searchVal" />
          <span v-if="searchForm.searchVal" @click="searchForm.searchVal = ''" class="dialog-list-bar-search-reset">
            <CloseOne theme="filled" />
          </span>
        </div>
        <div>
          <div class="dialog-list-add" @click="handleListAddClick">
            <Plus theme="outline" size="24" />
          </div>
          <CommonModal v-model:visible="roleForm.modalVisible" title="选择角色" subtitle="单击角色以创建对话">
            <div class="select-role">
              <div class="select-role-title">选择角色</div>
              <div class="select-role-list">
                <div class="select-role-item" v-for="(item, i) in roleStore.roles" :key="i" @click="handleAddRecord(item[0])">
                  {{ item[1] }}
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <Toggle style="margin-top: 1rem;" label="记住本次选择" v-model="roleForm.remember" />
                <DiliButton style="margin-left: auto;" type="primary" text="直接开始→" @click="handleAddRecord" />
              </div>
            </div>
          </CommonModal>
        </div>
      </div>
      <div class="dialog-list-container">
        <div v-for="item in displayList" :key="item.id" @click="handleListItemClick(item.id)" class="dialog-list-item" :class="{'dialog-list-item-selected': item.id === currentDialogId}">
          <img :src="item.avatarPath ? item.avatarPath : '/chatgpt3.svg'" alt="avatar">
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
<style scoped lang="scss">
@import "@/assets/variables.module";
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
    margin-top: .5rem;
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
    gap: .25rem;

    &-search {
      flex: 1;
      border-radius: .5rem;
      padding: .25rem .5rem;
      background-color: $color-grey-200;
      display: flex;
      align-items: center;
      gap: .5rem;
      transition: all .2s $ease-out-circ;
      &:focus-within {
        background-color: $color-grey-300;
      }

      &-icon {
        color: $color-grey-500;
      }
      &-reset {
        cursor: pointer;
        color: $color-grey-500;
        transition: color .2s $ease-out-circ;
        &:hover {
          color: darken($color-grey-500, 10);
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
    border-radius: .5rem;
    color: $color-grey-400;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all .2s $ease-out-circ;
    &:hover {
      background-color: $color-grey-300;
    }
  }

  &-item {
    padding: .5rem;
    border-radius: .5rem;
    background-color: #FFFFFF;
    cursor: pointer;
    transition: background-color .2s $ease-out-circ;
    display: flex;
    flex-direction: row;
    gap: .5rem;
    &:not(&-selected):hover  {
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
        font-size: .8rem;
        // 超过长度显示省略号
        text-overflow: ellipsis;
      }
    }

    &-right {
      width: 4rem;
      .datetime {
        font-size: .7rem;
        text-align: right;
      }
    }
  }
}
.record-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &-action {
    &-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: .5rem;
    }
    &-item {
      flex: 1;
      border-radius: .5rem;
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
    gap: .5rem;
  }

}
.select-role {
  padding: 1rem;
  &-title {
    @extend %page-title;
    margin-bottom: 1rem;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
  }
  &-item {
    border-radius: .5rem;
    padding: .25rem .5rem;
    cursor: pointer;
    line-height: 1.5rem;
    transition: all .2s $ease-out-circ;
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