<script lang="ts" setup>
import variables from '@/assets/variables.module.scss';
import useGlobal from '@/commands/useGlobal';
import DiliButton from '@/components/button/DiliButton.vue';
import { DialogManager } from '@/components/dialog';
import CusSelect from '@/components/dropdown/CusSelect.vue';
import CusInput from '@/components/input/CusInput.vue';
import showToast from '@/components/toast/toast';
import CusToggle from '@/components/toggle/CusToggle.vue';
import useRoleStore from '@/store/useRoleStore';
import { useSettingStore } from '@/store/useSettingStore';
import { ref, toValue, watch } from 'vue';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import { addChildrenDropdownOptions } from '@/components/dropdown/utils.ts';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/store/data/useDataStore.ts';
import ToastManager from '@/components/toast/ToastManager.ts';

const { isModal = false } = defineProps<{
  isModal?: boolean;
}>();

const settingStore = useSettingStore();
const roleStore = useRoleStore();
const { providerDropdown, botsDropdown } = storeToRefs(useChatConfigStore());
// 解构赋值editingValue避免使用proxy，此处并不希望未点击保存前生效
const editingValue = ref({ ...toValue(settingStore.settings) });

defineEmits<{
  (event: 'cancel'): void;
}>();

// 观测设置信息变化
watch(
  () => settingStore.settings,
  () => {
    editingValue.value = { ...toValue(settingStore.settings) };
  }
);

function handleSave() {
  console.log(editingValue);
  const result = settingStore.saveSettings(editingValue.value);
  showToast({ text: `保存${result}个设置成功` });
}

function handleReset() {
  DialogManager.commonDialog({
    title: '重置设置',
    content: '此操作不可逆，确定要重置设置吗？',
    confirmButtonProps: {
      backgroundColor: variables.colorDanger,
    },
  }).then((res) => {
    if (res) {
      settingStore.resetSetting();
      showToast({ text: `重置成功` });
    }
  });
}

const { isLargeScreen } = useGlobal();

// 角色相关
function handleClearRoleCache() {
  DialogManager.commonDialog({
    title: '清除缓存',
    content: '此操作不可逆，清除后需要重新获取数据，是否继续？',
    confirmButtonProps: {
      backgroundColor: variables.colorDanger,
    },
  }).then((res) => {
    if (res) {
      roleStore.reset();
    }
  });
}

// 对话相关
async function handleClearMessageCache() {
  const confirmRes = await DialogManager.commonDialog({
    title: '清除对话缓存',
    content: '此操作不可逆，清除后需要重新获取数据，是否继续？',
    confirmButtonProps: {
      backgroundColor: variables.colorDanger,
    },
  });
  if (confirmRes) {
    const dataStore = useDataStore();
    const clearRes = await dataStore.clearAllData();
    if (clearRes) {
      ToastManager.success('清除成功');
    } else {
      ToastManager.danger('清除失败');
    }
  }
}

function forceReloadPage() {
  // @ts-ignore lib 类型标注错误
  window.location.reload(true);
}

defineExpose({
  save: handleSave,
  reset: handleReset,
});
</script>

<template>
  <div :class="{ large: !isModal && isLargeScreen, modal: isModal }" class="setting-page">
    <div class="setting-page-wrapper">
      <div class="setting-list">
        <div class="setting-list-container">
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">API地址</span>
              <span class="setting-list-item__value">
                <CusInput v-model="editingValue.baseUrl" placeholder="后端服务地址" />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">对话缓存</span>
              <span class="setting-list-item__subtitle"> 将对话数据缓存在本地，不进行联网查询 </span>
              <span class="setting-list-item__value">
                <CusToggle v-model="editingValue.localCache" />
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title"> Markdown 缓存结果渲染 </span>
              <span class="setting-list-item__subtitle"> 使用缓存结果渲染对话，提升长对话加载效率 </span>
              <span class="setting-list-item__value">
                <CusToggle v-model="editingValue.markdownCache" />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">默认发送方式</span>
              <span class="setting-list-item__value">
                <CusSelect
                  v-model="editingValue.fastSendKey"
                  :options="[
                    {
                      value: 'enter',
                      label: 'Enter',
                    },
                    {
                      value: 'none',
                      label: 'None',
                    },
                  ]"
                />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">默认 API 服务模型</span>
              <span class="setting-list-item__value">
                <CusSelect
                  v-model="editingValue.defaultModel"
                  :options="
                    addChildrenDropdownOptions(providerDropdown, () => ({
                      position: isLargeScreen ? 'right' : 'left',
                    }))
                  "
                  :position="isLargeScreen ? 'bottom' : 'left'"
                  @select="(option, value, path) => (editingValue.defaultProvider = path[0] || '')"
                />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">显示日期/时间</span>
              <span class="setting-list-item__value">
                <CusSelect
                  v-model="editingValue.timeDisplayInDialogList"
                  :options="[
                    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
                    { value: 'yyyy-MM-dd hh:mm:ss', label: 'yyyy-MM-dd hh:mm:ss' },
                  ]"
                />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">启用角色功能</span>
              <span class="setting-list-item__value">
                <CusToggle v-model="editingValue.roleEnabled" />
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title">默认角色</span>
              <span class="setting-list-item__value" style="flex-direction: row; align-items: center">
                <CusToggle v-model="editingValue.roleRemember" />
                <CusSelect v-model="editingValue.roleDefaultId" :options="botsDropdown" />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">清除缓存</span>
              <span class="setting-list-item__value">
                <DiliButton
                  :background-color="variables.colorDanger"
                  text="清除角色缓存"
                  type="primary"
                  @click="handleClearRoleCache"
                />
                <DiliButton
                  :background-color="variables.colorDanger"
                  text="清除对话缓存"
                  type="primary"
                  @click="handleClearMessageCache"
                />
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title">强制刷新页面</span>
              <span class="setting-list-item__value">
                <DiliButton
                  :background-color="variables.colorDanger"
                  text="立即重启"
                  type="primary"
                  @click="forceReloadPage"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.setting-page {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .large & {
      max-width: 48rem;
      margin-inline: auto;
    }
  }

  &-title {
    @include page-title;
    text-align: center;
    margin-bottom: 0.5rem;
  }
}

.setting-list {
  flex: 1;

  &-container {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .large & {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }

  &-section {
    --gap: 1rem;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: calc(var(--gap) / 2) var(--gap);
    box-sizing: border-box;
    padding-bottom: 0.25rem;

    // 除了最后一个 section，都添加下边框
    &:not(:nth-last-child(2)) {
      border-bottom: 1px solid $color-grey-100;
    }

    .large & {
      border-bottom: none;
      flex-direction: row;
      border-radius: 0.5rem;
      background-color: $color-teal-20;
      padding: 0.5rem;
    }
  }

  &-item {
    position: relative;
    display: grid;
    grid-template-areas:
      'title value'
      'subtitle value';
    grid-auto-rows: auto;
    justify-content: space-between;

    .large & {
      column-gap: 0.5rem;

      /* 添加竖线 */
      &:not(:last-child)::after {
        position: absolute;
        content: '';
        left: calc(100% + var(--gap) / 2);
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1px;
        height: 60%;
        background: $color-grey-300;
      }
    }

    &__title {
      grid-area: title;

      .large & {
        font-weight: bold;
      }
    }

    // subtitle 不存在时，title 居中
    &:not(:has(&__subtitle)) &__title {
      grid-row: 1 / 3;
      align-self: center;
    }

    &__subtitle {
      grid-area: subtitle;
      display: block;
      font-weight: normal;
      font-size: 0.7em;
      opacity: 0.7;
    }

    &__value {
      grid-area: value;
      align-self: center;
      flex-shrink: 0; // 阻止压缩，尤其是在小屏幕上
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
      flex-direction: column;
    }
  }
}
</style>
