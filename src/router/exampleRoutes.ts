// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const exampleRoutes: Array<RouteRecordRaw> = [
  // 1.智慧工厂
  {
    name: 'SmartFactory',
    path: '/smartFactory',
    meta: {
      title: 'SmartFactory'
    },
    component: () => import('@/views/Examples/SmartFactory/index.vue')
  },
  // 2.智慧收费站
  {
    name: 'SmartTollBooths',
    path: '/smartTollBooths',
    meta: {
      title: 'SmartTollBooths'
    },
    component: () => import('@/views/Examples/SmartTollBooths/index.vue')
  }
]

export { exampleRoutes }
