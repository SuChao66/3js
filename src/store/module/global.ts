import { defineStore } from 'pinia'
// 导入类型
import type { IGlobalState } from '../types'

const useGlobalState = defineStore('global', {
  state: (): IGlobalState => ({
    title: 'ThreeJS 3D',
    locale: 'chinese',
    theme: 'light'
  }),
  actions: {
    // 改变语言
    SET_LOCALE(locale: string) {
      this.locale = locale
    },
    // 改变主题
    SET_THEME(theme: string) {
      this.theme = theme
    }
  },
  // 数据持久化
  persist: {
    key: 'global',
    storage: window.localStorage,
    paths: ['locale', 'theme']
  }
})

export default useGlobalState
