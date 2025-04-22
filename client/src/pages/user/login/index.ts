import CommonModal from '@/components/modal/CommonModal.vue';
import LoginPage from '@/pages/user/login/LoginPage.vue';
import initPlugins from '@/plugins/initPlugins.ts';
import { createApp, h, ref } from 'vue';
import useGlobal from '@/commands/useGlobal.ts';
import { getRouterInstance } from '@/plugins/router.ts';

export const goToLogin = () => {
  if (useGlobal().isLargeScreen.value) {
    showLoginDialog();
  } else {
    getRouterInstance().push('/login');
  }
};

/**
 * 弹出登录弹窗
 */
export const showLoginDialog = () => {
  // 创建挂载点
  const mountDiv = document.createElement('div');
  document.querySelector('#app')?.appendChild(mountDiv);

  const dialogRef = ref<InstanceType<typeof CommonModal>>();
  const show = ref(true);

  // 实例化弹窗并挂载
  const app = createApp({
    render: () =>
      h(
        CommonModal,
        {
          ref: dialogRef,
          visible: show.value,
          showClose: false,
          presetBody: true,
          closeOnESC: true,
          closeOnClickMask: true,
          onAfterClose() {
            app.unmount();
            mountDiv.remove();
          },
        },
        {
          default: () =>
            h(LoginPage, {
              isModal: true,
              onClose() {
                show.value = false;
              },
            }),
        }
      ),
  });
  initPlugins(app);
  app.mount(mountDiv);
};
