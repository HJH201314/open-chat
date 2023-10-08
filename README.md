# OpenChat

基于OpenAI接口打造的一个网页聊天应用前端，[后端在这里](https://gitee.com/origamiwang/gptplat)

## 技术栈

- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- [Pinia](https://pinia.vuejs.org/) - 符合直觉的 Vue.js 状态管理库
- [Vite](https://vitejs.dev/) - 极速的前端构建工具
- [PNPM](https://pnpm.io/) - 快速、零安装的包管理工具
- [Vitest](https://vitest.dev/) - 快速、简单的单元测试工具

## 其它依赖/工具

- [IconPark](http://iconpark.oceanengine.com/) - 字节跳动旗下的开源图标包
- [CSS Filter色值转换工具](https://www.zhangxinxu.com/sp/filter.html) - 用filter滤镜来转换颜色

## 如何运行？

本项目使用pnpm作为包管理工具

### 安装依赖

```sh
pnpm install
```

### 开启开发服务器

```sh
pnpm dev
```

### 构建优化产物

```sh
pnpm build
```

### 使用 [Vitest](https://vitest.dev/) 进行单元测试

```sh
pnpm test:unit
```

### 使用 [ESLint](https://eslint.org/) 进行代码风格检查

```sh
pnpm lint
```
