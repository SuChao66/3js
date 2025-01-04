// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const CesiumRoutes: Array<RouteRecordRaw> = [
  // 1.飞行航线
  {
    name: 'FlyLine',
    path: '/flyline',
    meta: {
      title: 'FlyLine'
    },
    component: () => import('@/views/Examples/Cesium/FlyLine/index.vue')
  },
  // 1.西湖美景
  {
    name: 'EastLaker',
    path: '/eastLaker',
    meta: {
      title: 'EastLaker'
    },
    component: () => import('@/views/Examples/Cesium/EastLaker/index.vue')
  }
]

export { CesiumRoutes }
