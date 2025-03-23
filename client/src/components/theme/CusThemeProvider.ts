import { defineComponent, Fragment, h } from 'vue';
import { provideTheme } from '@/components/theme/useTheme.ts';

export default defineComponent({
  name: 'CusThemeProvider',
  setup(_, { slots }) {
    provideTheme();

    return () => h(Fragment, null, slots.default?.());
  },
});
