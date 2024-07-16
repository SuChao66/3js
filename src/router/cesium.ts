// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const CesiumRoutes: Array<RouteRecordRaw> = [
  // 1.粒子群效果
  {
    name: 'Earth',
    path: '/earth',
    meta: {
      title: 'Earth'
    },
    component: () => import('@/views/Examples/Cesium/Earth/index.vue')
  }
]

export { CesiumRoutes }
