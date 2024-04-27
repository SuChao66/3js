import { defineStore } from 'pinia'
// 导入类型
import type { ICard } from '@/baseui/SCard/types'
// 导入图片
import smartFactorySmall from '@/assets/images/examples/smart-factory-small.png'
import smartTollBoothsSmall from '@/assets/images/examples/smart-toll-booths-small.png'
import inDeveloping from '@/assets/images/in-developing.png'

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
      img: smartTollBoothsSmall,
      desc: '实时检测高速车流量',
      path: 'SmartTollBooths'
    },
    {
      key: 3,
      title: '智慧园区',
      img: inDeveloping,
      desc: '智慧园区管理',
      path: 'SmartPark'
    },
    {
      key: 4,
      title: '智慧小区',
      img: inDeveloping,
      desc: '智慧小区，邻里和睦',
      path: 'SmartCommunity'
    }
  ])
  // 2.元宇宙
  const metaverseExamples = reactive<ICard[]>([])
  // 3.3D展览
  const exhibitionExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '华为P10',
      img: smartFactorySmall,
      desc: '国货之光',
      path: 'Mobile'
    }
  ])
  // 4.3D数据可视化
  const visualizationExamples = reactive<ICard[]>([])

  return {
    digitalTwinsExamples,
    metaverseExamples,
    exhibitionExamples,
    visualizationExamples
  }
})

export default useExampleStore
