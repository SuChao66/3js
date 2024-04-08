import { createApp } from 'vue'
import App from './App.vue'
// 导入样式
import 'normalize.css'
import '@/styles/index.less'
// 导入路由
import router from '@/router'
// 导入store
import store from '@/store'
// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 注册图标
import { registerIcon } from '@/global'
// 注册svg图标
import 'virtual:svg-icons-register' // 引入注册脚本
import SvgIcon from '@/components/SvgIcon/index.vue'

const app = createApp(App)

// 注册图标
registerIcon(app)
app.component('SvgIcon', SvgIcon)

app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
