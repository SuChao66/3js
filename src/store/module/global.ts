import { defineStore } from 'pinia'
// 导入类型
import type { IGlobalState } from '../types'

const useGlobalState = defineStore('global', {
  state: (): IGlobalState => ({
    title: 'three'
  }),
  actions: {},
  // 数据持久化
  persist: {
    key: 'global',
    storage: window.localStorage,
    paths: ['title']
  }
})

export default useGlobalState
