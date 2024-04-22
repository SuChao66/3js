import { defineStore } from 'pinia'
// 导入类型
import type { ICard } from '@/type'
// 导入图片
import smartFactorySmall from '@/assets/images/smart-factory-small.png'

const useExampleStore = defineStore('examples', () => {
  // 1.数字孪生案例
  const digitalTwinsExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '智慧工厂',
      img: smartFactorySmall,
      desc: '智慧工厂，可实时监测最新状态，元宇宙漫游',
      path: 'SmartFactory'
    },
    {
      key: 2,
      title: '数字孪生-收费站',
      img: smartFactorySmall,
      desc: '可实时查看高速收费站记录',
      path: 'SmartFactory'
    },
    {
      key: 3,
      title: '智慧园区',
      img: smartFactorySmall,
      desc: '智慧园区管理',
      path: 'SmartFactory'
    },
    {
      key: 4,
      title: '智慧小区',
      img: smartFactorySmall,
      desc: '智慧小区，邻里和睦',
      path: 'SmartFactory'
    }
  ])
  // 2.元宇宙
  const metaverseExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '智慧工厂',
      img: smartFactorySmall,
      desc: '智慧工厂，可实时监测最新状态，元宇宙漫游',
      path: 'SmartFactory'
    }
  ])

  return {
    digitalTwinsExamples,
    metaverseExamples
  }
})

export default useExampleStore
