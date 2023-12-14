<script setup lang="ts">

import CusInput from "@/components/input/CusInput.vue";
import { ref } from "vue";
import DiliButton from "@/components/button/DiliButton.vue";
import variables from "@/assets/variables.module.scss";
import { useSettingStore } from "@/store/useSettingStore";
import useGlobal from "@/commands/useGlobal";
import showToast from "@/components/toast/toast";
import CusToggle from "@/components/toggle/CusToggle.vue";

const settingStore = useSettingStore();
const editingValue = ref(settingStore.settings);

defineEmits<{
  (event: 'cancel'): void;
}>();

function handleSave() {
  const result = settingStore.saveSettings(editingValue.value);
  showToast({ text: `保存${result}个设置成功` });
}
</script>

<template>
  <div class="setting-page">
    <div class="setting-page-title">设置 | Setting</div>
    <div class="setting-list">
      <div class="setting-list-container">
        <div class="setting-list-item">
          <span class="setting-list-item__title">Cloud接口地址</span>
          <span class="setting-list-item__value">
            <CusInput v-model="editingValue.host" placeholder="Cloud API" />
          </span>
        </div>
        <div class="setting-list-item">
          <span class="setting-list-item__title">本地对话缓存</span>
          <span class="setting-list-item__value">
            <CusToggle v-model="editingValue.localCache" />
          </span>
        </div>
        <div class="setting-list-item">
          <span class="setting-list-item__title">默认角色</span>
          <span class="setting-list-item__value">
            <CusToggle v-model="editingValue.roleRemember">
              <template #before>{{ editingValue.roleRemember ? '开启' : '关闭' }}</template>
            </CusToggle>
            <CusInput v-model="editingValue.roleDefaultId" />
          </span>
        </div>
        <div class="setting-actions-placeholder"></div>
        <div class="setting-list-item setting-actions">
          <DiliButton type="primary" text="保存" :background-color="variables.colorPrimary" @click="handleSave" />
          <DiliButton type="normal" text="取消" v-if="useGlobal().isLargeScreen" @click="$emit('cancel')" />
          <DiliButton style="margin-left: auto;" type="normal" text="重置" @click="settingStore.resetSetting()" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.setting-page {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-radius: .5rem;
  padding: .5rem;
  display: flex;
  flex-direction: column;

  &-title {
    @extend %page-title;
    margin-bottom: .5rem;
  }

  .setting-list {
    flex: 1;

    &-container {
      max-height: 100%;
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }
    &-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: .5rem;
      &__title {
        // font-weight: bold;
      }
      &__value {
        display: flex;
        gap: .5rem;
        align-items: center;
      }
    }
  }

  .setting-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: .5rem;
    opacity: 0.95;
    background-color: white;
    &-placeholder {
      height: 2rem;
    }
  }
}
</style>


