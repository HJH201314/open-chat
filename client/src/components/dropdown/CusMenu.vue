<script setup lang="ts">
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import { provide, reactive, ref } from 'vue';
import {
  type CusContextMenuEmits,
  type CusContextMenuProps,
  DropdownCurrentInfoInjectionKey,
  type DropdownMenuProps,
} from '@/components/dropdown/types.ts';
import CommonModal from '@/components/modal/CommonModal.vue';
import useGlobal from '@/commands/useGlobal.ts';

const emit = defineEmits<CusContextMenuEmits>();
const props = withDefaults(defineProps<CusContextMenuProps>(), {
  options: () => [],
  position: 'right-top',
});

const isOpen = ref(false);
const bounding: DropdownMenuProps['parentBounding'] = reactive({} as any);
provide(DropdownCurrentInfoInjectionKey, {
  onSelect: (o, vp) => {
    isOpen.value = false;
    emit('select', o.value, o, vp);
  },
});

const onShow = (e: any) => {
  if (props.disabled) return;

  isOpen.value = true;
  if (e instanceof PointerEvent || e instanceof MouseEvent) {
    bounding.x = e.clientX;
    bounding.left = e.clientX;
    bounding.right = e.clientX;
    bounding.width = 0;
    bounding.y = e.clientY;
    bounding.top = e.clientY;
    bounding.bottom = e.clientY;
    bounding.height = 0;
  }
};

const onModalClose = () => {
  isOpen.value = false;
};

const { isLargeScreen } = useGlobal();

defineExpose({
  show: (e: PointerEvent | MouseEvent) => {
    onShow(e);
  },
});
</script>

<template>
  <CommonModal
    :visible="isOpen"
    :show-close="false"
    close-on-click-mask
    modal-transition-name=""
    :enable-mask-click-pass="isLargeScreen"
    :mask-style="{ backgroundColor: 'transparent' }"
    @close="onModalClose"
  >
    <DropdownMenu
      :position="position"
      :options="options"
      :parent-bounding="bounding"
      :is-open="isOpen"
      :_depth="1"
      :_value-path="[]"
      @contextmenu.capture.prevent
    />
  </CommonModal>
</template>

<style scoped lang="scss"></style>
