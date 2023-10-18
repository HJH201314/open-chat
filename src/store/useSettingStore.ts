import { defineStore } from "pinia";
import { ref } from "vue";

/* 设置相关 */
export const useSettingStore = defineStore('setting', () => {
  const data: AppSettings = ref({});

  function loadSetting() {

  }

  function saveSetting() {

  }

  function resetSetting() {

  }

  return {
    data,
    loadSetting,
    saveSetting,
    resetSetting,
  }
});