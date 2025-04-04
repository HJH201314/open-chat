<template>
  <div class="birthday-container">
    <h2 class="celebration-title">🎉 Happy Birthday! 🎂</h2>

    <div class="gift-grid">
      <div
        v-for="(gift, index) in gifts"
        :key="index"
        class="gift-card"
        :class="{ opened: gift.opened }"
        @click="openGift(gift)"
      >
        <div class="ribbon"></div>
        <span class="gift-icon">{{ gift.opened ? '🎁' : '🎀' }}</span>
        <div v-if="gift.opened" class="gift-message" :style="{ 'user-select': gift.copiable ? 'text' : 'none' }">
          {{ gift.message }}
        </div>
      </div>
    </div>

    <div class="controls">
      <audio ref="audioPlayer" autoplay loop src="https://cdn.pixabay.com/audio/2025/03/16/audio_c2c127a814.mp3" />
      <button class="music-button" @click="toggleMusic">{{ isPlaying ? '⏸️ Pause' : '▶️ Play' }} Music</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import ToastManager from '@/components/toast/ToastManager.ts';

const props = defineProps<{
  info: any;
}>();

const audioPlayer = ref<HTMLAudioElement>();
const isPlaying = ref(false);
useEventListener(audioPlayer, 'playing', (e) => {
  isPlaying.value = !(e.target as HTMLAudioElement)?.paused;
});
useEventListener(audioPlayer, 'play', (e) => {
  isPlaying.value = !(e.target as HTMLAudioElement)?.paused;
});
useEventListener(audioPlayer, 'pause', (e) => {
  isPlaying.value = !(e.target as HTMLAudioElement)?.paused;
});

const gifts = ref([
  { message: 'Wish you eternal happiness!', opened: false, copiable: false },
  { message: 'May all your dreams come true!', opened: false, copiable: false },
  { message: typeof props.info == 'string' ? props.info.replace('gift:', '') : '', opened: false, copiable: true },
]);

const toggleMusic = () => {
  isPlaying.value = !isPlaying.value;
  isPlaying.value ? audioPlayer.value?.play() : audioPlayer.value?.pause();
};

const openGift = async (gift: any) => {
  gift.opened = true;
  if (gift.copiable) {
    try {
      await navigator.clipboard.writeText(gift.message);
      ToastManager.success('复制成功，快去兑换吧！');
    } catch (_) {
      ToastManager.danger('复制失败，手动复制吧！');
    }
  }
};
</script>

<style scoped>
.birthday-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #ff9a9e, #fad0c4);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
}

.celebration-title {
  color: #c2185b;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

.gift-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.gift-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 180px;
}

.gift-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.gift-icon {
  font-size: 3rem;
  display: block;
  margin: 1rem 0;
}

.ribbon {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: #ff4081;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
}

.gift-message {
  font-size: 1.1em;
  color: #c2185b;
  margin-top: 1rem;
}

.music-button {
  background: #c2185b;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1.1em;
  cursor: pointer;
  transition: transform 0.2s;
}

.music-button:hover {
  transform: scale(1.1);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.opened {
  background: #fff3e0;
  cursor: default;
}
</style>
