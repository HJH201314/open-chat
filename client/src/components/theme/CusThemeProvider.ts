import { computed, provide, h, Fragment, defineComponent } from 'vue';
import { type BaseThemeTokenKeys, ThemeInjectionKey, type ThemeKeyType } from '@/components/theme/types.ts';

export default defineComponent({
  name: 'CusThemeProvider',
  props: {
    theme: {
      type: Object as () => Record<ThemeKeyType, string>,
      default: () => ({})
    },
    preset: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    const defaultTheme: BaseThemeTokenKeys = {
      colorPrimary: '#26A69A',
      colorSuccess: '#67C23A',
      colorInfo: '#32A5F5',
      colorWarning: '#FFA726',
      colorDanger: '#EF5350',
    };

    const theme = computed(() => {
      return {
        ...defaultTheme,
        ...props.theme,
      };
    });

    // 转换驼峰式命名到CSS自定义属性格式，注入标签中
    // const cssVars = computed(() => {
    //   const variables = {} as Record<ThemeKeyType, string>;
    //   for (const key in theme.value) {
    //     const cssVarName = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
    //     variables[cssVarName] = theme.value[key];
    //   }
    //   return variables;
    // });

    // 通过provide暴露原始theme对象
    provide(ThemeInjectionKey, theme.value);

    return () => h(Fragment, null, slots.default?.());
  }
});
