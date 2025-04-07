<!--lint disable awesome-heading awesome-github awesome-toc double-link -->

<h2 align='center'>OpenChat</h2>

<p align='center'>
A chatbot interface based on <a href='https://openai.com/'>OpenAI</a>

<!--lint ignore-->

<p align='center'>

<img src="https://img.shields.io/badge/TypeScript-teal?style=flat-square&color=3178c6" alt="Language TS">
<img src="https://img.shields.io/badge/Client-Vue.js-teal?logo=vue.js&style=flat-square&color=26a69a" alt="Client On Vue.js">
<img src="https://img.shields.io/badge/Server-Go-teal?logo=go&style=flat-square&color=e0234e" alt="Server On Nest.js">
<img src="https://img.shields.io/github/license/HJH201314/openai-front?style=flat-square&color=8bc34a" alt="Github License">
<img src="https://img.shields.io/github/stars/HJH201314/openai-front?logo=github&style=flat-square&color=ff5722" alt="Github Repo Stars">

</p>

## Features

- [x] Chat with multiple models
- [x] Multi-device auto-sync
- [x] Flexible backend configuration
- [x] Model load balancing
- [x] Plug-and-play components
- [ ] More in the future...

## Get Started

Simply use docker to run the project:

```docker
docker run -d --name fcraft/open-chat -p 9035:9035 open-chat
```

## Libraries / Tools

- Frontend: 
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vue 3](https://v3.vuejs.org/) - UI Framework
  - [Pinia](https://pinia.vuejs.org/) - State Management
  - [Vite](https://vitejs.dev/) - Build Tool
  - [Sass/SCSS](https://sass-lang.com/) - CSS Preprocessor
  - [PageSpy](https://www.pagespy.org/docs) - Page Monitoring
  - [IconPark](https://iconpark.oceanengine.com/) - Icon Library
  - [TDesign](https://tdesign.tencent.com/) - UI Library for Dashboard

- Backend
  - [Gin](https://github.com/gin-gonic/gin) - Web Framework
  - [GORM](https://github.com/go-gorm/gorm) - ORM Library

## Developing

This project use pnpm as package manager:

```sh
pnpm install  # Install dependencies
cd client && pnpm run dev      # Start dev server
cd client && pnpm run build    # Build for production
```

### Contributors
![Contributors](https://contrib.rocks/image?repo=HJH201314/openai-front)

## License
[GPL-3.0](LICENSE) © 2017-2025 FCraft
