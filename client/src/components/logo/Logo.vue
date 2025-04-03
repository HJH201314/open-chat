<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showFavicon?: boolean;
    showTitle?: boolean;
  }>(),
  {
    showFavicon: false,
    showTitle: true,
  }
);
</script>

<template>
  <div class="logo">
    <img v-if="showFavicon" style="width: 24px; height: 24px;" src="/favicon.ico" alt="OpenChat" />
    <template v-if="showTitle">
      <slot v-if="$slots.default" />
      <span v-else>OpenChat</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  gap: 0.5rem;
  font-size: 24px;

  background-image: linear-gradient(
    -135deg,
    var(--color-primary-darker),
    var(--color-primary),
    var(--color-primary-lighter),
    var(--color-primary),
    var(--color-primary-darker),
    var(--color-primary),
    var(--color-primary-lighter),
    var(--color-primary),
    var(--color-primary-darker)
  );
  -webkit-text-fill-color: rgba(0, 0, 0, 0);
  background-clip: text;
  background-size: 200% 200%;
  animation: text-masked-animation 3s infinite linear;

  @keyframes text-masked-animation {
    0% {
      background-position: 0 -100%;
    }
    100% {
      background-position: -100% 0;
    }
  }
}
</style>