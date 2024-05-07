// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const VisualizationRoutes: Array<RouteRecordRaw> = [
  // 1.3D地图可视化
  {
    name: '3dMap',
    path: '/3dMap',
    meta: {
      title: '3dMap'
    },
    component: () => import('@/views/Examples/Visualization/Map/index.vue')
  },
  // 2.3D地球可视化
  {
    name: '3dEarth',
    path: '/3dEarth',
    meta: {
      title: '3dEarth'
    },
    component: () => import('@/views/Examples/Visualization/Earth/index.vue')
  }
]

export { VisualizationRoutes }
