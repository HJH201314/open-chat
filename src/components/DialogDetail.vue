<script setup lang="ts">

import { Share, Back, Delete } from '@icon-park/vue-next';
import IconButton from "@/components/IconButton.vue";
import cusCss from "@/constants/cusCss";

const emit = defineEmits<{
  (e: 'back'): void;
}>()
</script>

<template>
  <div>
    <div id="detail-actions" class="flex gap-2">
      <IconButton @click="$emit('back')" >
        <Back :fill="cusCss.colorGray" size="16" />
      </IconButton>
      <div class="flex-1" />
      <IconButton>
        <Share :fill="cusCss.colorGray" size="16" />
      </IconButton>
      <IconButton>
        <Delete :fill="cusCss.colorGray" size="16" />
      </IconButton>
    </div>
  </div>
</template>

<style scoped>

</style>