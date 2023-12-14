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
@import "@/assets/variables.module";
.star-page {
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &-title {
    @extend %page-title;
  }

  &-collection-list {
    flex: 1;
    &-item {

    }
  }
}
</style>