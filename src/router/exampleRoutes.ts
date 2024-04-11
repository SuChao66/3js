// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const exampleRoutes: Array<RouteRecordRaw> = [
  {
    name: 'SmartFactory',
    path: '/smartFactory',
    meta: {
      title: 'SmartFactory'
    },
    component: () => import('@/views/Examples/SmartFactory/index.vue')
  }
]

export { exampleRoutes }
