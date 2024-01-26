import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router/index' //导入路由

import ElementPlus from 'element-plus' //导入element-plus
import 'element-plus/dist/index.css'//导入element-plus 样式

import http from './http/index'

const app = createApp(App)
app.config.globalProperties.$http = http

app.use(router).use(ElementPlus)

app.mount('#app')
