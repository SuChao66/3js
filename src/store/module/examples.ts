import { defineStore } from 'pinia'
// 导入类型
import type { ICard } from '@/baseui/SCard/types'
// 导入图片
import smartFactorySmall from '@/assets/images/examples/smart-factory-small.png' // 智慧工厂
import smartTollBoothsSmall from '@/assets/images/examples/smart-toll-booths-small.png' // 智慧收费站
import moblie from '@/assets/images/examples/moblie.png' // 3D手机
import BYDSongSmall from '@/assets/images/examples/BYD-song-small.png' // BYD-宋
import smartCommunitySmall from '@/assets/images/examples/smart-community-small.png' // 智慧小区
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
      title: '智慧小区',
      img: smartCommunitySmall,
      desc: '智慧小区，邻里和睦',
      path: 'SmartCommunity'
    },
    {
      key: 4,
      title: '智慧城市',
      img: inDeveloping,
      desc: '智慧城市管理',
      path: 'SmartCity'
    }
  ])
  // 2.元宇宙
  const metaverseExamples = reactive<ICard[]>([])
  // 3.3D展览
  const exhibitionExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '华为P10',
      img: moblie,
      desc: '国货之光，支持国货，从你我做起',
      path: 'Mobile'
    },
    {
      key: 2,
      title: '比亚迪-宋',
      img: BYDSongSmall,
      desc: 'This Is Your Dream Car',
      path: 'Car'
    }
  ])
  // 4.3D数据可视化
  const visualizationExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '3D地图可视化',
      img: inDeveloping,
      desc: '3D地图可视化',
      path: '3dMap'
    },
    {
      key: 2,
      title: '3D地球可视化',
      img: inDeveloping,
      desc: '3D地球可视化',
      path: '3dEarth'
    }
  ])

  return {
    digitalTwinsExamples,
    metaverseExamples,
    exhibitionExamples,
    visualizationExamples
  }
})

export default useExampleStore
