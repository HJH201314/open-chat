<script setup lang="ts">
import { useId } from 'vue';
import { getColorHex } from '@/utils/color.ts';

const options = {
  fullScreen: {
    zIndex: 1,
  },
  emitters: {
    position: {
      x: 50,
      y: 100,
    },
    rate: {
      quantity: 233,
      delay: 1,
    },
    life: {
      count: 1,
      duration: 0.1,
      delay: 0.4
    },
  },
  particles: {
    color: {
      value: [
        getColorHex('--color-primary'),
        getColorHex('--color-secondary'),
        getColorHex('--color-danger'),
        getColorHex('--color-warning'),
        getColorHex('--color-info'),
      ],
    },
    move: {
      decay: 0.03,
      direction: 'top',
      enable: true,
      gravity: {
        enable: true,
        acceleration: 20
      },
      outModes: {
        top: 'bounce',
        default: 'destroy',
      },
      speed: {
        min: 50,
        max: 100,
      },
    },
    number: {
      value: 0,
    },
    opacity: {
      value: {
        min: 0,
        max: 1,
      },
      animation: {
        enable: true,
        speed: 2,
        startValue: 'max',
        destroy: 'min',
      },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: 'random',
      animation: {
        enable: true,
        speed: 30,
      },
    },
    tilt: {
      direction: 'random',
      enable: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 30,
      },
    },
    size: {
      value: 3,
      animation: {
        enable: true,
        startValue: 'min',
        count: 1,
        speed: 16,
        sync: true,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enlighten: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 5,
        max: 15,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      speed: {
        min: -7,
        max: 7,
      },
    },
    shape: {
      type: ['circle', 'square', 'triangle', 'polygon'],
      options: {
        polygon: [
          {
            sides: 5,
          },
          {
            sides: 6,
          },
        ],
      },
    },
  },
  responsive: [
    {
      maxWidth: 1024,
      options: {
        particles: {
          move: {
            speed: {
              min: 66,
              max: 99,
            },
          },
        },
      },
    },
  ],
};

const handleLoaded = () => {
  console.debug('Particles loaded');
};

const id = useId();
</script>

<template>
  <div style="pointer-events: none;">
    <vue-particles :id="`cus-particle-${id}`" :options="options" @particles-loaded="handleLoaded"></vue-particles>
  </div>
</template>

<style scoped lang="scss"></style>