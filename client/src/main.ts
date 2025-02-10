import '@/assets/main.scss';
import '@/assets/variables.module.scss';
import '@icon-park/vue-next/styles/index.css';
import 'highlight.js/styles/atom-one-dark.css';
import initPlugins from '@/utils/initPlugins';

/* Import fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* Import fontawesome icon */
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faComment as farComment } from '@fortawesome/free-regular-svg-icons';
import { faBars, faComment as fasComment, faGear as fasGear } from '@fortawesome/free-solid-svg-icons';
/* Import fontawesome icon component */

import { createApp } from 'vue';

import App from './App.vue';
import '@/assets/code.scss';

library.add(faGithub, faBars, fasComment, farComment, fasGear);

const app = createApp(App);

initPlugins(app);

app.mount('#app');
