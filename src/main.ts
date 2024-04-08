import { createApp } from 'vue'
import App from './App.vue'
// 导入样式
import 'normalize.css'
// 导入路由
import router from '@/router'
// 导入store
import store from '@/store'
// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
