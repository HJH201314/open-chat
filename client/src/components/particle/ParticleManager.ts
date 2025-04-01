import { type App, createApp, h } from 'vue';
import VueParticles from '@tsparticles/vue3';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import CusParticle from '@/components/particle/CusParticle.vue';

export class ParticleManager {
  public static app: App | undefined = undefined;
  public static container: HTMLElement | undefined = undefined;
  public static isShowing = false;

  public static init() {
    this.app = createApp(h(CusParticle));
    // 使用Particles
    this.app.use(VueParticles, {
      init: async (engine) => {
        await loadConfettiPreset(engine);
      },
    });
  }

  public static show() {
    if (this.isShowing) {
      this.hide();
    }
    if (!this.app) {
      this.init();
    }
    if (!this.container) {
      this.container = document.createElement('div');
      this.container?.setAttribute('id', 'cus-particle-container');
      document.body.appendChild(this.container!);
    }
    this.app?.mount('#cus-particle-container');
    this.isShowing = true;
  }

  public static hide() {
    if (!this.isShowing) return;
    this.app?.unmount();
    this.app = undefined;
    this.container?.remove();
    this.container = undefined;
    this.isShowing = false;
  }
}
