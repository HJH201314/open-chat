import type { Ref } from "vue";

export type CommonModalFunc = {
  open: () => void;
  close: () => void;
  isVisible: Ref<boolean>;
}