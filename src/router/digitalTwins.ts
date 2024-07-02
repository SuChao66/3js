// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const DigitalTwinsRoutes: Array<RouteRecordRaw> = [
  // 1.智慧工厂
  {
    name: 'SmartFactory',
    path: '/smartFactory',
    meta: {
      title: 'SmartFactory'
    },
    component: () =>
      import('@/views/Examples/DigitalTwins/SmartFactory/index.vue')
  },
  // 2.智慧收费站
  {
    name: 'SmartTollBooths',
    path: '/smartTollBooths',
    meta: {
      title: 'SmartTollBooths'
    },
    component: () =>
      import('@/views/Examples/DigitalTwins/SmartTollBooths/index.vue')
  },
  // 3.智慧城市——上海
  {
    name: 'SmartCityShangHai',
    path: '/smartCityShangHai',
    meta: {
      title: 'SmartCityShangHai'
    },
    component: () =>
      import('@/views/Examples/DigitalTwins/SmartCityShangHai/index.vue')
  },
  // 4.智慧小区
  {
    name: 'SmartCommunity',
    path: '/smartCommunity',
    meta: {
      title: 'SmartCommunity'
    },
    component: () =>
      import('@/views/Examples/DigitalTwins/SmartCommunity/index.vue')
  },
  // 5.智慧城市——北京
  {
    name: 'SmartCityBeiJing',
    path: '/smartCityBeiJing',
    meta: {
      title: 'SmartCityBeiJing'
    },
    component: () =>
      import('@/views/Examples/DigitalTwins/SmartCityBeiJing/index.vue')
  },
  // 6.3D看房
  {
    name: '3dHourse',
    path: '/3dhourse',
    meta: {
      title: '3dHourse'
    },
    component: () => import('@/views/Examples/DigitalTwins/3DHourse/index.vue')
  },
  // 7.元宵灯会
  {
    name: 'LanternFestival',
    path: '/lanternFestival',
    meta: {
      title: 'LanternFestival'
    },
    component: () =>
      import('@/views/Examples/DigitalTwins/LanternFestival/index.vue')
  }
]

export { DigitalTwinsRoutes }
