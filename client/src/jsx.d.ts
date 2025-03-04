import { HTMLAttributes } from 'vue';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      [emit: string]: any;
    }
  }
}

declare module '@vue/runtime-dom' {}

declare module 'vue' {
  interface ComponentCustomProperties {
    // todo
    [x: string]: any;
  }
}

export {};