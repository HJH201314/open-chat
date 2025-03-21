import initPlugins from '@/utils/initPlugins';
import { getRandomString } from '@/utils/string';
import { type App, createApp, defineComponent, h, onMounted, ref, type VNode } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import type { CommonDialogExpose, CommonDialogProps, CommonDialogSlots } from '@/components/dialog/types.ts';
import CusInput from '@/components/input/CusInput.vue';
import type { CusInputProps } from '@/components/input/CusInput';
import { until } from '@vueuse/core';
import { useModalVisible } from '@/components/modal/util/useModalVisible.ts';
import CusThemeProvider from '@/components/theme/CusThemeProvider.ts';

type CommonDialogInstance = {
  dom: HTMLDivElement;
  app: App;
};

export class DialogManager {
  private static instances: Map<string, CommonDialogInstance> = new Map();

  /**
   * 渲染自定义对话框，提供自动销毁能力
   * @param ele 通过 h()/jsx 创建的组件，组件根元素需为 CommonDialog 组件
   */
  public static renderDialog = (ele: VNode) => {
    const id = getRandomString(5);
    const wrapper = document.createElement('div');
    document.querySelector('#app')?.appendChild(wrapper);

    // 使用 h 函数包装 ele 并注入 onAfterClose
    const wrappedEle = h(CusThemeProvider, () =>
      h(ele, {
        onAfterClose() {
          DialogManager.destroy(id);
        },
      })
    );

    const dialogComponent = createApp(wrappedEle);
    initPlugins(dialogComponent);
    const dialogInstance = dialogComponent.mount(wrapper);

    this.instances.set(id, {
      dom: wrapper,
      app: dialogComponent,
    });
    console.debug('[dialog-rendered] dialog instances', this.instances);
    return dialogInstance;
  };

  /**
   * 创建受控的模态对话框实例
   * @param props 对话框属性
   * @param slots 对话框插槽
   */
  public static createDialog = (props: CommonDialogProps, slots?: CommonDialogSlots) => {
    // 控制 component 中 CommonDialog 的显隐
    const { visible, show, hide } = useModalVisible(true);
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

      onMounted(() => show());

      expose({
        update,
      });

      return () =>
        h(CusThemeProvider, () =>
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
          )
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
    console.debug('[dialog-rendered] current dialog instants', this.instances);

    return {
      show,
      hide,
      update: (newOptions: CommonDialogProps) => {
        // @ts-ignore 目前 defineComponent 无法推导 expose 类型
        dialogInstance.update(newOptions);
      },
      confirm: async () => {
        await until(modalRef).not.toBeNull();
        return modalRef.value?.confirm();
      },
      destroy: () => DialogManager.destroy(id),
    };
  };

  /**
   * 创建一个对话框用于提示
   * @param props
   * @param defaultSlot
   */
  public static commonDialog = async (props: CommonDialogProps, defaultSlot?: VNode) =>
    new Promise<boolean>((resolve) => {
      const dialog = DialogManager.createDialog(
        {
          confirmHandler: () => resolve(true),
          cancelHandler: () => resolve(false),
          ...props,
        },
        defaultSlot ? { default: () => defaultSlot } : {}
      );
      dialog.show();
    });

  /**
   * 创建一个对话框用于输入
   * @param props
   * @param inputProps
   */
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
    console.debug('[dialog-destroyed] dialog instances', this.instances);
  }
}
