import { type App, createApp, h } from 'vue';
import VueParticles from '@tsparticles/vue3';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import CusParticle from '@/components/particle/CusParticle.vue';

export class ParticleManager {
  public static app: App | undefined = undefined;
  public static container: HTMLElement | undefined = undefined;
  public static isShowing = false;

  public static init() {
    ParticleManager.app = createApp(h(CusParticle));
    // 使用Particles
    ParticleManager.app.use(VueParticles, {
      init: async (engine) => {
        await loadConfettiPreset(engine);
      },
    });
  }

  public static show() {
    if (!ParticleManager.app) {
      ParticleManager.init();
    }
    if (!ParticleManager.container) {
      ParticleManager.container = document.createElement('div');
      ParticleManager.container?.setAttribute('id', 'cus-particle-container');
      document.body.appendChild(ParticleManager.container!);
    }
    ParticleManager.hide();
    ParticleManager.app?.mount('#cus-particle-container');
    ParticleManager.isShowing = true;
  }

  public static hide() {
    if (!ParticleManager.isShowing) return;
    ParticleManager.app?.unmount();
  }
}
