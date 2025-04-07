<!--lint disable awesome-heading awesome-github awesome-toc double-link -->

<h2 align='center'>OpenChat</h2>

<p align='center'>
A chatbot platform with flexibility
</p>

<!--lint ignore-->

<p align="center">
<img src="https://img.shields.io/badge/TypeScript-teal?logo=typescript&logoColor=white&style=flat-square&color=3178c6" alt="Language TS">
<img src="https://img.shields.io/badge/Vue.js-teal?logo=vue.js&logoColor=white&style=flat-square&color=46b882" alt="Client on Vue.js Framework">
<img src="https://img.shields.io/badge/Go-teal?logo=go&logoColor=white&style=flat-square&color=f88b62" alt="Language Go">
<img src="https://img.shields.io/badge/Gin-teal?logo=gin&logoColor=white&style=flat-square&color=b94c69" alt="Server on GIN Framework">
</p>

<p align="center">
<img src="https://img.shields.io/github/actions/workflow/status/hjh201314/open-chat/docker-image.yml?style=flat-square&color=ffeab4" alt="Build">
<img src="https://img.shields.io/github/stars/HJH201314/openai-front?logo=github&style=flat-square&color=f59688" alt="Github Repo Stars">
<img src="https://img.shields.io/github/license/HJH201314/openai-front?style=flat-square&color=ea3a59" alt="Github License">
</p>

## Features

- [x] Chat with multiple models
- [x] Multi-device auto-sync
- [x] Flexible backend configuration
- [x] Model load balancing
- [x] Plug-and-play components
- [ ] More in the future...

## Roadmap

- Add support for multimodal chat
- Improve plugin system

## ✨ Quick Start

### Docker

Run the project with Docker:

```shell
docker run -d --name open-chat -p 9035:9035 fcraft/open-chat
```

## Developing

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0
- Go >= 1.24.1

### Frontend

The frontend uses pnpm as the package manager:

```shell
pnpm install    # Install dependencies
cd client       # Enter client directory
pnpm run dev    # Start dev server
pnpm run build  # Build for production
```

### Backend

Currently, the backend is imported as a submodule. Initialize it first:

```shell
git submodule update --init --recursive
```

Then, run the backend:

```shell
cd server
go mod download # Download dependencies
go run main.go  # Run server
go build        # Build for production
```

### Libraries / Tools

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

## Contributors
![Contributors](https://contrib.rocks/image?repo=HJH201314/openai-front)

## License
[GPL-3.0](LICENSE) © 2017-2025 FCraft
