import '@icon-park/vue-next/styles/index.css';
import 'highlight.js/styles/atom-one-dark.css';
import initPlugins from '@/plugins/initPlugins.ts';

/* Import fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* Import fontawesome icon */
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faComment as farComment } from '@fortawesome/free-regular-svg-icons';
import { faBars, faComment as fasComment, faGear as fasGear } from '@fortawesome/free-solid-svg-icons';
/* Import fontawesome icon component */
import { createApp } from 'vue';

/* 我方样式 */
import '@/assets/main.scss';

import App from './App.vue';
import '@/assets/code.scss';
import '@/assets/themes.scss';
import { initDatabase } from '@/store/data/database.ts';
import { registerThemeColor } from '@/components/theme/useTheme.ts';

initDatabase();

library.add(faGithub, faBars, fasComment, farComment, fasGear);

const app = createApp(App);

initPlugins(app);
// 注册主题色
registerThemeColor();

app.mount('#app');

console.info('TUE App is running... 🚀 Build time:', window.buildTime);
