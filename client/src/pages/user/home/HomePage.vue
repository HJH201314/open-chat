<script setup lang="ts">
import CusTextarea from '@/components/textarea/CusTextarea.vue';
import { reactive } from 'vue';
import CusRadioGroup from '@/components/radio/CusRadioGroup.vue';
import CusRadioButton from '@/components/radio/CusRadioButton.vue';

const form = reactive({
  content: '',
});
</script>

<template>
  <div class="home-page">
    <div class="page-wrapper">
      <h1>今天有什么疑惑？</h1>
      <div class="input-container">
        <CusTextarea
          class="input-textarea"
          v-model="form.content"
          :textarea-attr="{ placeholder: '试试输入你的问题' }"
        />
      </div>
      <div class="suggest-container">
        <CusRadioGroup name="suggest-type" type="normal">
          <CusRadioButton value="knowledge" label="知识"></CusRadioButton>
          <CusRadioButton value="practice" label="练习"></CusRadioButton>
        </CusRadioGroup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.home-page {
  position: absolute;
  inset: 0;

  > .page-wrapper {
    height: 100%;
    width: 100%;
    max-width: 48rem;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    > h1 {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .input {
      &-container {
        width: 100%;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        border: 2px solid var(--color-grey-200);
        transition: all 0.2s $ease-out-circ;

        &:hover {
          border: 2px solid var(--color-grey-400);
        }

        &:focus-within {
          border: 2px solid var(--color-grey-400);
          box-shadow: $next-box-shadow-medium;
        }
      }

      &-textarea {
        height: 5rem;
      }
    }

    .suggest {
      &-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }
    }
  }
}
</style>