import { defineStore } from 'pinia'
// 导入类型
import type { ICard } from '@/baseui/SCard/types'
// 导入图片
import smartParks from '@/assets/images/examples/smart-parks.png' // 智慧园区
import smartFactorySmall from '@/assets/images/examples/smart-factory-small.png' // 智慧工厂
import smartTollBoothsSmall from '@/assets/images/examples/smart-toll-booths-small.png' // 智慧收费站
import smartCityShanghai from '@/assets/images/examples/3d-smart-city-shanghai.png' // 智慧城市-上海外滩
import smartCityBeiJing from '@/assets/images/examples/3d-smart-city-beijing.png' // 智慧城市-北京城
import lanternFestival from '@/assets/images/examples/lantern-festival.png' // 智慧城市-北京城
import moblie from '@/assets/images/examples/moblie.png' // 3D手机
import BYDSongSmall from '@/assets/images/examples/BYD-song-small.png' // BYD-宋
import smartCommunitySmall from '@/assets/images/examples/smart-community-small.png' // 智慧小区
import earthBigScreenSmall from '@/assets/images/examples/3d-earth-small.png' // 地球数据大屏
import GDP from '@/assets/images/examples/3d-gdp-small.png' // GDP数据大屏
import population from '@/assets/images/examples/3d-population-small.png' // 人口密度数据大屏
import map from '@/assets/images/examples/3d-map-small.png' // 人口密度数据大屏
import smartCity from '@/assets/images/examples/smart-city.png' // 人口密度数据大屏
import particleSwarms from '@/assets/images/examples/particle-swarms.png' // 粒子群效果
import waterFlow from '@/assets/images/examples/water-flow.png' // 烟云水雾效果
import starsSea from '@/assets/images/examples/stars-sea.png' // 星辰大海
import Hourse from '@/assets/images/examples/3d-hourse.png' // 全景看房
import exhibitionHall from '@/assets/images/examples/exhibition-hall.png' // 3D展厅
import futureSmartCity from '@/assets/images/examples/future-smart-city.png' // 未来智慧城（元宇宙）
// import tombRdider from '@/assets/images/examples/tomb-rdider.png' // 古堡传奇
import miGong from '@/assets/images/examples/mi-gong.png' // 迷宫
import cityHunter from '@/assets/images/examples/city-hunter.png' // 城市猎人
import flyLine from '@/assets/images/examples/3d-flyLine.png' // 航线
import inDeveloping from '@/assets/images/in-developing.png'

const useExampleStore = defineStore('examples', () => {
  // 1.数字孪生案例
  const digitalTwinsExamples = reactive<ICard[]>([
    // 智慧园区
    {
      key: 1,
      title: '智慧园区',
      img: smartParks,
      desc: '智慧园区，未来园区发展方向',
      path: 'SmartParks'
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
      title: '魔都_上海外滩',
      img: smartCityShanghai,
      desc: '外滩美景，欣赏万国建筑',
      path: 'SmartCityShangHai'
    },
    {
      key: 4,
      title: '智慧小区',
      img: smartCommunitySmall,
      desc: '智慧小区，邻里和睦',
      path: 'SmartCommunity'
    },
    {
      key: 5,
      title: '帝都_北京城',
      img: smartCityBeiJing,
      desc: '北京市公交、地铁路线图',
      path: 'SmartCityBeiJing'
    },
    {
      key: 6,
      title: '全景看房',
      img: Hourse,
      desc: '足不出户，打造你的专属小窝',
      path: '3dHourse'
    },
    {
      key: 7,
      title: '元宵灯会',
      img: lanternFestival,
      desc: '元宵灯会，中国人的专属烂漫',
      path: 'LanternFestival'
    },
    {
      key: 8,
      title: '3D展厅',
      img: exhibitionHall,
      desc: '足不出户，带你逛遍整个展览',
      path: 'ExhibitionHall'
    }
  ])
  // 2.元宇宙
  const metaverseExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '迷宫',
      img: miGong,
      desc: '世界上最漫长的路',
      path: 'Migong'
    },
    {
      key: 2,
      title: '智慧工厂',
      img: smartFactorySmall,
      desc: '智慧工厂，可实时监测最新状态',
      path: 'SmartFactory'
    },
    {
      key: 3,
      title: '城市猎人',
      img: cityHunter,
      desc: '罪恶都市，守护一方和平',
      path: 'CityHunter'
    },
    {
      key: 4,
      title: '未来智慧城',
      img: futureSmartCity,
      desc: '在未来智慧城中进行3D漫游',
      path: 'FutureSmartCity'
    }
    // {
    //   key: 4,
    //   title: '古堡传奇',
    //   img: tombRdider,
    //   desc: '中世纪的皇室贵族',
    //   path: 'TombRaider'
    // },
  ])
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
      title: '全球GDP可视化',
      img: GDP,
      desc: '3D全球GDP可视化',
      path: 'GDP'
    },
    {
      key: 2,
      title: '3D地图可视化',
      img: map,
      desc: '3D地图可视化',
      path: '3dMap'
    },
    {
      key: 3,
      title: '全球人口可视化',
      img: population,
      desc: '3D全球人口可视化',
      path: '3dPopulation'
    },
    {
      key: 4,
      title: '3D地球可视化',
      img: earthBigScreenSmall,
      desc: '3D地球可视化',
      path: '3dEarth'
    },
    {
      key: 5,
      title: '智慧城市',
      img: smartCity,
      desc: '智慧城市管理系统',
      path: 'SmartCity'
    }
  ])
  // 5.shader鉴赏
  const shadersExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '粒子效果',
      img: particleSwarms,
      desc: '波涛汹涌的粒子效果',
      path: 'ParticleSwarms'
    },
    {
      key: 2,
      title: '烟雾水云',
      img: waterFlow,
      desc: '烟雾水云，实现你的腾云驾雾',
      path: 'WaterFlow'
    },
    {
      key: 3,
      title: '星辰大海',
      img: starsSea,
      desc: '满目星辰，心怀大海，',
      path: 'StarsSea'
    }
  ])
  // 6.cesium案例
  const cesiumExamples = reactive<ICard[]>([
    {
      key: 1,
      title: '飞行航线',
      img: flyLine,
      desc: '绘制动态路线实现飞行航线',
      path: 'FlyLine'
    },
    {
      key: 2,
      title: '人间天堂',
      img: inDeveloping,
      desc: '西湖美景盖世无双',
      path: 'EastLaker'
    }
  ])

  return {
    digitalTwinsExamples,
    metaverseExamples,
    exhibitionExamples,
    visualizationExamples,
    shadersExamples,
    cesiumExamples
  }
})

export default useExampleStore
