import { createPinia } from 'pinia'
// pinia数据持久化
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
// 导入子模块
import useGlobalState from './module/global'
import useExampleStore from './module/examples'

const store = createPinia()
// 使用数据持久化插件
store.use(piniaPluginPersistedState)

// 统一导出useStore方法
export const useStore = () => {
  return {
    global: useGlobalState(),
    exmaples: useExampleStore()
  }
}

export default store
