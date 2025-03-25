import { acceptHMRUpdate, defineStore } from 'pinia';
import { tryOnMounted, useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import api from '@/api';

const useRoleStore = defineStore('bot-roles', () => {
  const roleStorage = useLocalStorage('bot-roles', [] as API.RoleListResult);
  const roles = computed(() => roleStorage.value);
  const roleSentenceStorage = useLocalStorage<Record<number, string>>('role-sentence', {});

  // roleId -> roleName 映射表
  const roleIdMap = computed(() => {
    const map = new Map<number, string>();
    roles.value.forEach((value) => {
      map.set(value[0], value[1]);
    });
    return map;
  });
  // roleName -> roleId 映射表
  const roleNameMap = computed(() => {
    const map = new Map<string, number>();
    roles.value.forEach((value) => {
      map.set(value[1], value[0]);
    });
    return map;
  });

  tryOnMounted(() => {
    refreshRoles();
  });

  async function reset() {
    roleSentenceStorage.value = {};
    roleStorage.value = [];
    refreshRoles();
  }

  async function refreshRoles() {
    // const res = await api.gpt.getAllRoles();
    // if (res.data) {
    //   roleStorage.value = res.data;
    // }
  }

  async function getRoleSentence(roleId?: number) {
    if (!roleId) return '';
    if (roleSentenceStorage.value[roleId]) {
      return roleSentenceStorage.value[roleId];
    } else {
      try {
        const res = await api.gpt.getSentenceByRoleId(roleId);
        if (res.data.roleSentence) {
          roleSentenceStorage.value[roleId] = res.data.roleSentence;
          return res.data.roleSentence;
        }
      } catch (_) {}
    }
  }

  return {
    refreshRoles,
    roles,
    roleIdMap,
    roleNameMap,
    getRoleSentence,
    reset,
  };
});

export default useRoleStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoleStore, import.meta.hot));
}
