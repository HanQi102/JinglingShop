import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router/index' //导入路由

import ElementPlus from 'element-plus' //导入element-plus
import 'element-plus/dist/index.css'//导入element-plus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入icon 图标
import http from './http/index'


const app = createApp(App)
app.config.globalProperties.$http = http

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 时间转换
// Vue.filter('formatTime', function (timestamp) {
//     // 创建一个 Date 对象，并将整数时间戳转换为毫秒级别的时间戳
//     const date = new Date(timestamp * 1000);

//     // 获取各个时间组件
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();

//     // 格式化时间
//     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// });



app.use(router).use(ElementPlus)

app.mount('#app')
