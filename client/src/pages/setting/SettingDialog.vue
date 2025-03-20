<script setup lang="ts">
import SettingView from '@/pages/setting/SettingView.vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import variables from '@/assets/variables.module.scss';
import DiliButton from '@/components/button/DiliButton.vue';
import { h, ref, useTemplateRef } from 'vue';
import { SettingTwo } from '@icon-park/vue-next';

const settingViewRef = useTemplateRef('setting-view');

const visible = ref(true);
</script>

<template>
  <CommonDialog
    title="对话设置"
    :icon="h(SettingTwo)"
    :visible="visible"
    :show-close="true"
    :show-confirm="false"
    :show-cancel="false"
    :close-on-click-mask="true"
  >
    <SettingView ref="setting-view" is-modal></SettingView>
    <template #action>
      <div style="display: flex; gap: 0.5rem">
        <DiliButton text="重置" type="text" @click="() => settingViewRef?.reset()" />
        <DiliButton text="关闭" type="normal" style="margin-left: auto" @click="() => (visible = false)" />
        <DiliButton
          :background-color="variables.colorPrimary"
          :button-style="{ width: '100%', 'text-align': 'center' }"
          text="保存"
          type="primary"
          @click="() => settingViewRef?.save()"
        />
      </div>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
