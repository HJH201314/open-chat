import { acceptHMRUpdate, defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { computed, onMounted } from "vue";
import api from "@/api";

const useRoleStore = defineStore('bot-roles', () => {
  const roleStorage = useLocalStorage('bot-roles', [] as API.RoleListResult);
  const roles = computed(() => roleStorage.value);
  // roleId -> roleName 映射表
  const roleIdMap = computed(() => {
    const map = new Map<number, string>();
    roles.value.forEach((value) => {
      map.set(value[0], value[1]);
    })
  });
  // roleName -> roleId 映射表
  const roleNameMap = computed(() => {
    const map = new Map<string, number>();
    roles.value.forEach((value) => {
      map.set(value[1], value[0]);
    })
  });

  onMounted(() => {
    refreshRoles();
  })

  async function refreshRoles() {
    const res = await api.gpt.getAllRoles();
    if (res.data) {
      roleStorage.value = res.data;
    }
  }

  return {
    refreshRoles,
    roles,
  }
});

export default useRoleStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoleStore, import.meta.hot));
}