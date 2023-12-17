import '@/assets/main.scss'
import '@/assets/variables.module.scss'
import '@icon-park/vue-next/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* Import fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* Import fontawesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* Import fontawesome icon */
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faBars, faComment as fasComment, faGear as fasGear } from '@fortawesome/free-solid-svg-icons'
import { faComment as farComment } from '@fortawesome/free-regular-svg-icons'
import { MenuFold, MenuUnfold, Message, SettingTwo, Star, User } from "@icon-park/vue-next";
import shake from "@/commands/shake";

library.add(
    faGithub,
    faBars,
    fasComment, farComment,
    fasGear
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 自定义指令v-shake
app.directive('shake', {
  updated: shake
});

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('setting-two', SettingTwo)
app.component('message', Message)
app.component('menu-unfold', MenuUnfold)
app.component('menu-fold', MenuFold)
app.component('star', Star)
app.component('user', User)

app.mount('#app')
