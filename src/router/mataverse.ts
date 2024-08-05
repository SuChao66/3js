// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const MataverseRoutes: Array<RouteRecordRaw> = [
  // 1.未来智慧城
  {
    name: 'FutureSmartCity',
    path: '/futureSmartCity',
    meta: {
      title: 'FutureSmartCity'
    },
    component: () =>
      import('@/views/Examples/Mataverse/FutureSmartCity/index.vue')
  },
  // 2.智慧工厂
  {
    name: 'SmartFactory',
    path: '/smartFactory',
    meta: {
      title: 'SmartFactory'
    },
    component: () => import('@/views/Examples/Mataverse/SmartFactory/index.vue')
  },
  // 3.古墓丽影
  {
    name: 'TombRaider',
    path: '/tombRaider',
    meta: {
      title: 'TombRaider'
    },
    component: () => import('@/views/Examples/Mataverse/TombRaider/index.vue')
  },
  // 4.迷宫
  {
    name: 'Migong',
    path: '/migong',
    meta: {
      title: 'Migong'
    },
    component: () => import('@/views/Examples/Mataverse/Migong/index.vue')
  },
  // 5.城市猎人
  {
    name: 'CityHunter',
    path: '/cityHunter',
    meta: {
      title: 'CityHunter'
    },
    component: () => import('@/views/Examples/Mataverse/CityHunter/index.vue')
  }
]

export { MataverseRoutes }
