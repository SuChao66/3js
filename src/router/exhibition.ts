// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const ExhibitionRoutes: Array<RouteRecordRaw> = [
  // 1.智慧工厂
  {
    name: 'Mobile',
    path: '/mobile',
    meta: {
      title: 'Mobile'
    },
    component: () => import('@/views/Examples/Exhibition/Mobile/index.vue')
  }
]

export { ExhibitionRoutes }
