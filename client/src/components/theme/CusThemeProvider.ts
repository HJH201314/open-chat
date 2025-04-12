import { defineComponent, Fragment, h } from 'vue';

export default defineComponent({
  name: 'CusThemeProvider',
  setup(_, { slots }) {
    // provideTheme();

    return () => h(Fragment, null, slots.default?.());
  },
});
