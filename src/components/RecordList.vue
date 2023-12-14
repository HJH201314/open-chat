<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Plus, Search } from '@icon-park/vue-next';
import { useDataStore } from "@/store/useDataStore";
import CommonModal from "@/components/modal/CommonModal.vue";
import Toggle from "@/components/toggle/CusToggle.vue";
import useRoleStore from "@/store/useRoleStore";
import { useSettingStore } from "@/store/useSettingStore";

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
  handleListItemClick(sessionId);
  roleForm.modalVisible = false;
  if (roleForm.remember) {
    settingStore.saveSetting('roleRemember', true);
    settingStore.saveSetting('roleDefaultId', roleId);
  }
}
function handleListAddClick() {
  console.log(roleForm.remember)
  if (roleForm.remember)
    handleAddRecord(settingStore.settings.roleDefaultId);
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
</script>
<template>
  <div class="message-left">
    <!-- 角色列表 -->
    <div class="dialog-list">
      <div class="dialog-list-bar">
        <div class="dialog-list-bar-search">
          <span class="dialog-list-bar-search-icon"><Search /></span>
          <input type="text" name="search" placeholder="搜索对话" />
        </div>
        <div>
          <div class="dialog-list-add" @click="handleListAddClick">
            <Plus theme="outline" size="24" />
          </div>
          <CommonModal v-model:visible="roleForm.modalVisible" title="选择角色" subtitle="单击角色以创建对话">
            <div class="select-role">
              <div class="select-role-list">
                <div class="select-role-item" v-for="item in roleStore.roles" @click="handleAddRecord(item[0])">
                  {{ item[1] }}
                </div>
              </div>
              <!-- TODO: 支持记住本次选择 -->
              <Toggle style="margin-top: 1rem;" label="记住本次选择" v-model="roleForm.remember" />
            </div>
          </CommonModal>
        </div>
      </div>
      <div class="dialog-list-container">
        <div v-for="item in dataStore.dialogList" @click="handleListItemClick(item.id)" class="dialog-list-item" :class="{'dialog-list-item-selected': item.id === currentDialogId}">
          <img :src="item.avatarPath ? item.avatarPath : 'src/assets/image/chatgpt3.svg'" alt="avatar">
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
  flex-direction: row;
  flex-wrap: nowrap;
  gap: .5rem;
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
      .title {
        font-weight: bold;
        font-size: 1.1rem;
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