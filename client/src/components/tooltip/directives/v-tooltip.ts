import { type App, createApp, type DirectiveBinding } from 'vue';
import Tooltip from '@/components/tooltip/BaseTooltip.vue'; // 假设 Tooltip 组件路径

const tooltipDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    let tooltipApp: App | null = null;
    let tooltipElement: HTMLElement | null = null;

    let mouseInTooltip = false;
    el.addEventListener('mouseenter', () => {
      if (tooltipElement) return;

      tooltipElement = document.createElement('div');
      tooltipApp = createApp(Tooltip, {
        text: binding.value,
      });
      tooltipApp.mount(tooltipElement);
      document.body.appendChild(tooltipElement);

      const rect = el.getBoundingClientRect();
      tooltipElement.style.position = 'fixed';
      tooltipElement.style.zIndex = '999';
      tooltipElement.style.top = `${rect.top}px`;
      tooltipElement.style.left = `${rect.right}px`;
      tooltipElement.addEventListener('mouseenter', () => {
        mouseInTooltip = true;
      });
      tooltipElement.addEventListener('mouseleave', () => {
        mouseInTooltip = false;
        setTimeout(() => {
          if (!mouseInTooltip) {
            tooltipApp?.unmount();
            tooltipApp = null;
            tooltipElement && document.body.removeChild(tooltipElement);
            tooltipElement = null;
          }
        }, 100);
      });
    });

    el.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!mouseInTooltip) {
          tooltipApp?.unmount();
          tooltipApp = null;
          tooltipElement && document.body.removeChild(tooltipElement);
          tooltipElement = null;
        }
      }, 100);
    });
  },
};

export default tooltipDirective;
