import { getRandomString } from "@/utils/string";
import type { App, VNode } from "vue";
import { createApp, h, nextTick, ref } from "vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import type { CommonDialogExpose, CommonDialogProps } from "@/components/dialog/CommonDialog";
import CusInput from "@/components/input/CusInput.vue";
import type { CusInputProps } from "@/components/input/CusInput";

type CommonDialogInstance = {
  dom: HTMLDivElement;
  app: App;
}

export class DialogManager {
  private static instances: Map<string, CommonDialogInstance> = new Map();
  private static top: number; // 当前最高的z-index

  public static commonDialog = async (props: CommonDialogProps, defaultSlot?: VNode) => new Promise<boolean>(resolve => {
    const id = getRandomString(5);
    const dialogDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(dialogDiv);
    const dialogRef = ref<CommonDialogExpose>();
    const dialogApp = createApp({
      render() {
        return h(CommonDialog, {
            ...props,
            onConfirm: (close) => {
              close();
              resolve(true);
            },
            onCancel: (close) => {
              close();
              resolve(false);
            },
            _id: id, // 指定组件全局唯一ID
            ref: dialogRef,
          },
          {
            default: () => defaultSlot
          });
      }
    });
    dialogApp.mount(dialogDiv);
    nextTick(() => {
      // nextTick确保dialog已完成挂载
      dialogRef.value?.show();
    });
    this.instances.set(id, {
      dom: dialogDiv,
      app: dialogApp,
    });
    console.debug(this.instances)
  });

  public static inputDialog = (props?: CommonDialogProps, inputProps?: CusInputProps) => new Promise<{status: boolean; value: string;}>((resolve) => {
    const value = ref<string>(inputProps?.value ?? '');
    const inputComponent = {
      setup() {
        return <CusInput modelValue={value.value} onUpdate:modelValue={(v: string) => {
          value.value = v;
        }} placeholder={'请输入点什么'} {...inputProps}></CusInput>
      }
    }
    const overrideProps: CommonDialogProps = {};
    if (!props?.onCancel) {
      overrideProps.onCancel = (close) => {
        close();
      }
    }
    this.commonDialog({...props, ...overrideProps}, inputComponent.setup()).then((res) => {
      if (res) {
        resolve({
          status: true,
          value: value.value,
        });
      } else {
        resolve({
          status: false,
          value: '',
        });
      }
    });
  });

  public static destroy(_id: string) {
    const instance = this.instances.get(_id);
    if (!instance) return;
    instance.app.unmount();
    instance.dom.remove();
    this.instances.delete(_id);
    console.debug(this.instances)
  }
}