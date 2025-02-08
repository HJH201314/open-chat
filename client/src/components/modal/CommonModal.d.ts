import type { Ref } from "vue";

export type CommonModalFunc = {
  open: () => void;
  close: (callbackFn?: () => void) => void;
  isVisible: Ref<boolean>;
}