import { fileURLToPath, URL } from 'node:url';

import { defineConfig, ESBuildOptions, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';
import sassDts from 'vite-plugin-sass-dts';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const esbuildOptions = {} as ESBuildOptions;
  if (mode === 'production') {
    // 打包时移除 console
    esbuildOptions.pure = ['console.log'];
  }
  return {
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_ENV_*'], // 环境变量前缀
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools({
        launchEditor: 'goland',
      }),
      // ...
      AutoImport({
        ignore: ['vue'],
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
        globsExclude: ['src/components/**/*.vue'],
      }),
      sassDts({
        enabledMode: ['development', 'production'],
        global: {
          generate: true,
          outputFilePath: path.resolve(__dirname, './src/style.d.ts'),
        },
        sourceDir: path.resolve(__dirname, './src'),
        outputDir: path.resolve(__dirname, './dist'),
      }),
      VitePWA(),
      // 构建时调整 html 文件
      createHtmlPlugin({
        minify: mode === 'production',
        entry: 'src/main.ts',
        inject: {
          data: {
            // 模版中的 <%- injectScript %>
            injectScript: `<script>window.buildTime = ${Date.now()}; window.version = 'v0.0.1';</script>`,
          },
        },
      }),
      mkcert({
        force: false,
      }),
    ],
    esbuild: esbuildOptions,
    css: {
      // 对css的行为进行配置
      // modules配置最终会丢给postcss modules
      modules: {
        // 是对css模块化的默认行为进行覆盖
        localsConvention: 'camelCase', // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
        scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
        generateScopedName: '[name]_[local]_[hash:5]', // 配置生成的类名的格式
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      https: {},
      port: 9035,
      strictPort: true,
      proxy: {
        '/api/cloud': {
          target: 'http://127.0.0.1:3000/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cloud/, ''),
        },
        '/api/next': {
          target: 'http://127.0.0.1:9033/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/next/, ''),
        },
        '/api/origin': {
          target: 'http://127.0.0.1:5000/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/origin/, ''),
        },
      },
    },
  };
});
