<script setup lang="ts">
type DialogMessageProps = {
  message: string;
  role: 'user' | 'bot';
  time: string;
};

const props = withDefaults(
  defineProps<DialogMessageProps>(),
  {
    role: 'user',
    message: '',
    time: '2023/10/23 04:04:04',
  }
);

</script>

<template>
  <div :class="['dialog-message', `dialog-message__${props.role}`]">
    <div :class="['dialog-message-container', `dialog-message-container__${props.role}`]">
      <div :class="['dialog-message-content', `dialog-message-content__${props.role}`]">
        <div class="dialog-message-content-body">
          {{ props.message }}
        </div>
      </div>
      <div class="dialog-message-time">
        {{ props.time }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables";
.dialog-message {
  display: flex;
  &__user {
    flex-direction: row-reverse;
  }
  &__bot {
    flex-direction: row;
  }

  &-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-left: 5px;
    &__user {
      align-items: flex-end;
    }
    &__bot {
      align-items: flex-start;
    }
  }
  &-content {
    padding: .25rem .5rem;
    user-select: text;
    word-break: break-word;
    &__user {
      background-color: $color-black;
      color: $color-white;
      border-radius: .5rem .5rem 0 .5rem;
      box-shadow: $box-shadow;
    }
    &__bot {
      background-color: $color-white;
      color: $color-black;
      border-radius: .5rem .5rem .5rem 0;
      box-shadow: $box-shadow;
    }
    &-body {
      // width: min-content;
      word-wrap: break-word;
      line-height: 1.5;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
  }
  &-time {
    color: $color-gray;
    font-size: 12px;
    margin-left: .5rem;
  }
}
</style>