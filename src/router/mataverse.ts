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
  }
]

export { MataverseRoutes }
