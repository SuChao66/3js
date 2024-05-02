// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const ExhibitionRoutes: Array<RouteRecordRaw> = [
  // 1.手机展示
  {
    name: 'Mobile',
    path: '/mobile',
    meta: {
      title: 'Mobile'
    },
    component: () => import('@/views/Examples/Exhibition/Mobile/index.vue')
  },
  // 2.宝马X5
  {
    name: 'Car',
    path: '/car',
    meta: {
      title: 'Car'
    },
    component: () => import('@/views/Examples/Exhibition/Car/index.vue')
  }
]

export { ExhibitionRoutes }
