<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal.ts';
import DiliButton from '@/components/button/DiliButton.vue';
import { DialogManager } from '@/components/dialog';
import CusSelect from '@/components/dropdown/CusSelect.vue';
import CusInput from '@/components/input/CusInput.vue';
import showToast from '@/components/toast/toast.ts';
import CusToggle from '@/components/toggle/CusToggle.vue';
import useRoleStore from '@/store/useRoleStore.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import { onBeforeUnmount, ref, toValue, watch } from 'vue';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/store/data/useDataStore.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import { useTheme } from '@/components/theme/useTheme.ts';
import CusAvatar from '@/components/avatar/CusAvatar.vue';
import LogoVIP from '@/components/logo/LogoVIP.vue';
import { ShuffleOne } from '@icon-park/vue-next';
import tinycolor from 'tinycolor2';
import { getRandomInt } from '@/utils/string.ts';
import CusPopover from '@/components/tooltip/CusPopover.vue';

const { isModal = false } = defineProps<{
  isModal?: boolean;
}>();

const settingStore = useSettingStore();
const roleStore = useRoleStore();
const { modelDropdown, botsDropdown } = storeToRefs(useChatConfigStore());
// 解构赋值editingValue避免使用proxy，此处并不希望未点击保存前生效
const editingValue = ref({ ...toValue(settingStore.settings) });
const theme = useTheme();

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
  console.debug('[new-setting]', editingValue);
  // 额外的保存操作
  if (editingValue.value.themeColor && editingValue.value.themeColor != settingStore.settings.themeColor) {
    // 将主题色配置写入
    theme.saveThemeColor(editingValue.value.themeColor);
  }
  const result = settingStore.saveSettings(editingValue.value);
  showToast({ text: `保存${result}个设置成功` });
}

function handleReset() {
  DialogManager.commonDialog({
    presetType: 'danger',
    title: '重置设置',
    content: '此操作不可逆，确定要重置设置吗？',
  }).then((res) => {
    if (res) {
      settingStore.resetSetting();
      showToast({ text: '重置成功' });
    }
  });
}

const { isLargeScreen } = useGlobal();

// 角色相关
function handleClearRoleCache() {
  DialogManager.commonDialog({
    presetType: 'danger',
    title: '清除缓存',
    content: '此操作不可逆，清除后需要重新获取数据，是否继续？',
  }).then((res) => {
    if (res) {
      roleStore.reset();
    }
  });
}

// 对话相关
async function handleClearMessageCache() {
  const confirmRes = await DialogManager.commonDialog({
    presetType: 'danger',
    title: '清除对话缓存',
    content: '此操作不可逆，清除后需要重新获取数据，是否继续？',
  });
  if (confirmRes) {
    const dataStore = useDataStore();
    const clearRes = await dataStore.clearAllData();
    if (clearRes) {
      ToastManager.normal('清除成功');
    } else {
      ToastManager.danger('清除失败');
    }
    forceReloadPage();
  }
}

function forceReloadPage() {
  // @ts-ignore lib 类型标注错误
  window.location.reload(true);
}

let lastColorHex = tinycolor({ h: 0, s: 0.451, l: 0.451 }).toHexString();
function genRandomThemeColor() {
  editingValue.value.themeColor = tinycolor(lastColorHex).spin(getRandomInt(1, 360)).toHexString();
  lastColorHex = editingValue.value.themeColor;
}

// 颜色预览
watch(
  () => editingValue.value.themeColor,
  (newValue) => {
    // regex 校验 newValue 是否为合法的十六进制颜色值
    if (!newValue || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(newValue)) {
      return;
    }
    theme.saveThemeColor(newValue);
  }
);
// 关闭前清除预览
onBeforeUnmount(() => {
  if (editingValue.value.themeColor != settingStore.settings.themeColor) {
    settingStore.settings.themeColor && theme.saveThemeColor(settingStore.settings.themeColor);
  }
});

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
                <CusInput v-model="editingValue.baseUrl" placeholder="API服务地址" disabled />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <!--            <div class="setting-list-item">-->
            <!--              <span class="setting-list-item__title">对话缓存</span>-->
            <!--              <span class="setting-list-item__subtitle"> 将对话数据缓存在本地，不进行联网查询，无法关闭 </span>-->
            <!--              <span class="setting-list-item__value">-->
            <!--                <CusToggle v-model="editingValue.localCache" />-->
            <!--              </span>-->
            <!--            </div>-->
            <div class="setting-list-item">
              <span class="setting-list-item__title"> Markdown 渲染结果缓存 </span>
              <span class="setting-list-item__subtitle"> 缓存渲染结果，提升长对话加载效率 </span>
              <span class="setting-list-item__value">
                <CusToggle v-model="editingValue.markdownCache" />
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title">默认发送方式</span>
              <span class="setting-list-item__value">
                <CusSelect
                  v-model="editingValue.fastSendKey"
                  position="bottom-right"
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
              <span class="setting-list-item__title">默认模型</span>
              <span class="setting-list-item__value">
                <CusSelect v-model="editingValue.defaultModel" position="bottom-right" :options="modelDropdown" />
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title">展示模型头像</span>
              <span class="setting-list-item__value">
                <CusToggle v-model="editingValue.showModelAvatar" label="" />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">主题</span>
              <span class="setting-list-item__value" style="flex-direction: row; align-items: center">
                <CusSelect
                  v-model="editingValue.theme"
                  position="bottom-right"
                  :options="[
                    {
                      value: 'auto',
                      label: '跟随系统',
                    },
                    {
                      value: 'light',
                      label: '浅色',
                    },
                    {
                      value: 'dark',
                      label: '深色',
                    },
                  ]"
                />
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title">主题色</span>
              <span class="setting-list-item__value" style="flex-direction: row; align-items: center">
                <CusInput v-model="editingValue.themeColor" style="width: 7.5rem" />
                <CusPopover position="top">
                  <CusAvatar size="1.5rem" :color="editingValue.themeColor" style="flex-shrink: 0" />
                  <template #popover>
                    <div style="padding: 0.5rem; user-select: text">
                      {{ tinycolor(editingValue.themeColor).toRgbString() }}<br />
                      {{ tinycolor(editingValue.themeColor).toHslString() }}
                    </div>
                  </template>
                </CusPopover>
                <DiliButton type="tertiary" @click="genRandomThemeColor"><ShuffleOne /></DiliButton>
              </span>
            </div>
            <div class="setting-list-item">
              <span class="setting-list-item__title">炫彩<LogoVIP /></span>
              <span class="setting-list-item__subtitle">让主题色动起来</span>
              <span class="setting-list-item__value">
                <CusToggle v-model="editingValue.themeColorful" />
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
                <CusSelect v-model="editingValue.roleDefaultId" position="top-right" :options="botsDropdown" />
              </span>
            </div>
          </div>
          <div class="setting-list-section">
            <div class="setting-list-item">
              <span class="setting-list-item__title">清除缓存</span>
              <span class="setting-list-item__value">
                <DiliButton
                  background-color="var(--color-danger)"
                  text="清除角色缓存"
                  type="primary"
                  @click="handleClearRoleCache"
                />
                <DiliButton
                  background-color="var(--color-danger)"
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
                  background-color="var(--color-danger)"
                  text="立即重启"
                  type="primary"
                  @click="forceReloadPage"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="app-info">
        <div>F-Chat</div>
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

    &__title {
      font-size: 0.75rem;
      line-height: 1;
      color: var(--color-grey-1000);
    }

    // 除了最后一个 section，都添加下边框
    &:not(:nth-last-child(2)) {
      border-bottom: 1px solid var(--color-trans-100);
    }

    .large & {
      border-bottom: none;
      flex-direction: row;
      border-radius: 0.5rem;
      background-color: var(--color-primary-20);
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
    column-gap: 0.25rem;

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
        background: var(--color-trans-300);
      }
    }

    &__title {
      grid-area: title;
      display: flex;
      gap: 0.5rem;
      align-items: center;

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

.app-info {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-trans-1500);
  font-size: 0.8rem;
}
</style>
