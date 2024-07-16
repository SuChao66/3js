import { defineStore } from 'pinia'
// 导入类型
import type { IGlobalState } from '../types'

const useGlobalState = defineStore('global', {
  state: (): IGlobalState => ({
    title: '三维世界',
    locale: 'chinese',
    theme: 'light',
    isShowHeaderRight: true,
    // cesium的默认token
    defaultAccessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMGVlYzE1Zi04OGM5LTRlNjUtOWU3Yi03ZDNkMzFkMWViYmIiLCJpZCI6MjI1MzA5LCJpYXQiOjE3MTk2NDE2NzV9.fQnlPna9m5h95UMn3u0r-CeafK27R4IXMY4rdsUzJlg'
  }),
  actions: {
    // 改变语言
    SET_LOCALE(locale: string) {
      this.locale = locale
    },
    // 改变主题
    SET_THEME(theme: string) {
      this.theme = theme
    },
    // 是否显示header右侧
    SET_IS_SHOW_HEADER_RIGHT(isShowHeaderRight: boolean) {
      this.isShowHeaderRight = isShowHeaderRight
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
