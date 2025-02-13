import initPlugins from '@/utils/initPlugins';
import { getRandomString } from '@/utils/string';
import type { App, VNode } from 'vue';
import { createApp, h, nextTick, ref } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import type { CommonDialogExpose, CommonDialogProps } from '@/components/dialog/CommonDialog';
import CusInput from '@/components/input/CusInput.vue';
import type { CusInputProps } from '@/components/input/CusInput';

type CommonDialogInstance = {
  dom: HTMLDivElement;
  app: App;
};

export class DialogManager {
  private static instances: Map<string, CommonDialogInstance> = new Map();

  public static commonDialog = async (props: CommonDialogProps, defaultSlot?: VNode) =>
    new Promise<boolean>((resolve) => {
      const id = getRandomString(5);
      const dialogDiv = document.createElement('div');
      document.querySelector('#app')?.appendChild(dialogDiv);
      const dialogRef = ref<CommonDialogExpose>();
      const dialogApp = createApp({
        render() {
          return h(
            CommonDialog,
            {
              ...props,
              onConfirm() {
                resolve(true);
              },
              onCancel() {
                resolve(false);
              },
              onAfterClose() {
                DialogManager.destroy(id);
              },
              ref: dialogRef,
            },
            {
              default: () => defaultSlot,
            }
          );
        },
      });
      initPlugins(dialogApp);
      dialogApp.mount(dialogDiv);
      nextTick(() => {
        // nextTick确保dialog已完成挂载
        dialogRef.value?.show();
      });
      this.instances.set(id, {
        dom: dialogDiv,
        app: dialogApp,
      });
      console.debug(this.instances);
    });

  public static inputDialog = (props?: CommonDialogProps, inputProps?: CusInputProps) =>
    new Promise<{
      status: boolean;
      value: string;
    }>((resolve) => {
      const value = ref<string>(inputProps?.value ?? '');
      const inputComponent = {
        setup() {
          return (
            <CusInput
              modelValue={value.value}
              onUpdate:modelValue={(v: string) => {
                value.value = v;
              }}
              placeholder={'请输入点什么'}
              {...inputProps}
            ></CusInput>
          );
        },
      };
      this.commonDialog({ ...props }, inputComponent.setup()).then((res) => {
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
    console.debug(this.instances);
  }
}
