// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const MataverseRoutes: Array<RouteRecordRaw> = [
  // 1.粒子群效果
  {
    name: 'FutureSmartCity',
    path: '/futureSmartCity',
    meta: {
      title: 'FutureSmartCity'
    },
    component: () =>
      import('@/views/Examples/Mataverse/FutureSmartCity/index.vue')
  }
]

export { MataverseRoutes }
