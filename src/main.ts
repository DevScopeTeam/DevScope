import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus' // import elementPlus
import 'element-plus/dist/index.css' // import elementPlus
import * as ElementPlusIconsVue from '@element-plus/icons-vue'// import icons
import axios from 'axios' // import axios

const app = createApp(App)

// setting icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$axios = axios // 配置axios全局引用

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
