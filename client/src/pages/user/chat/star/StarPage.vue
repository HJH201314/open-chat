<script setup lang="ts">

</script>

<template>
  <div class="star-page">
    <section class="star-page-title">收藏 | Star</section>
    <section class="collection-list">

    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
@use '@/assets/extension' as *;

.star-page {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: .5rem;

  &-title {
    @include page-title;
  }

  &-collection-list {
    flex: 1;
    &-item {

    }
  }
}
</style>