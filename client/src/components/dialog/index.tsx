import initPlugins from '@/utils/initPlugins';
import { getRandomString } from '@/utils/string';
import { type App, createApp, defineComponent, h, nextTick, ref, type VNode } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import type { CommonDialogExpose, CommonDialogProps, CommonDialogSlots } from '@/components/dialog/types.ts';
import CusInput from '@/components/input/CusInput.vue';
import type { CusInputProps } from '@/components/input/CusInput';
import { until } from '@vueuse/core';

type CommonDialogInstance = {
  dom: HTMLDivElement;
  app: App;
};

export class DialogManager {
  private static instances: Map<string, CommonDialogInstance> = new Map();

  public static createDialog = (props: CommonDialogProps, slots?: CommonDialogSlots) => {
    // 控制 component 中 CommonDialog 的显隐
    const visible = ref(true);
    const modalRef = ref<CommonDialogExpose>();

    // 封装 update 等方法
    const component = defineComponent((_, { expose }) => {
      const options = ref(props);
      const update = (newProps: CommonDialogProps) => {
        options.value = {
          ...props,
          ...newProps,
        };
      };

      expose({
        update,
      });

      return () =>
        h(
          CommonDialog,
          {
            ...options.value,
            visible: visible.value,
            onAfterClose() {
              DialogManager.destroy(id);
            },
            ref: modalRef,
          },
          slots
        );
    });
    const id = getRandomString(5);
    const wrapper = document.createElement('div');
    document.querySelector('#app')?.appendChild(wrapper);
    const dialogComponent = createApp(component);
    initPlugins(dialogComponent);
    const dialogInstance = dialogComponent.mount(wrapper);
    this.instances.set(id, {
      dom: wrapper,
      app: dialogComponent,
    });

    return {
      update: (newOptions: CommonDialogProps) => {
        // @ts-ignore 目前 defineComponent 无法推导 expose 类型
        dialogInstance.update(newOptions);
      },
      confirm: async () => {
        await until(modalRef).not.toBeNull();
        return modalRef.value?.confirm();
      },
      show: () => (visible.value = true),
      hide: () => (visible.value = false),
      destroy: () => DialogManager.destroy(id),
    };
  };

  public static commonDialog = async (props: CommonDialogProps, defaultSlot?: VNode) =>
    new Promise<boolean>((resolve) => {
      const id = getRandomString(5);
      const dialogDiv = document.createElement('div');
      document.querySelector('#app')?.appendChild(dialogDiv);
      const dialogRef = ref<CommonDialogExpose>();
      const dialogApp = createApp({
        render: () =>
          h(
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
          ),
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
