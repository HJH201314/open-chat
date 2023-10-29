import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppSettings } from "@/types/setting";

/* 设置相关 */
export const useSettingStore = defineStore('setting', () => {
  const data = ref({});

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