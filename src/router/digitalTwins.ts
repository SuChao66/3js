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
  // 3.智慧城市
  {
    name: 'SmartCity',
    path: '/smartCity',
    meta: {
      title: 'SmartCity'
    },
    component: () => import('@/views/Examples/DigitalTwins/SmartCity/index.vue')
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
  }
]

export { DigitalTwinsRoutes }
