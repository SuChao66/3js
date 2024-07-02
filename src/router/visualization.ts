// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const VisualizationRoutes: Array<RouteRecordRaw> = [
  // 1.全球GDP可视化
  {
    name: 'GDP',
    path: '/gdp',
    meta: {
      title: '3dGDP'
    },
    component: () => import('@/views/Examples/Visualization/GDP/index.vue')
  },
  // 2.地图可视化
  {
    name: '3dMap',
    path: '/3dMap',
    meta: {
      title: '3dMap'
    },
    component: () => import('@/views/Examples/Visualization/Map/index.vue')
  },
  // 3.全球人口可视化
  {
    name: '3dPopulation',
    path: '/3dPopulation',
    meta: {
      title: '3dPopulation'
    },
    component: () =>
      import('@/views/Examples/Visualization/PopulationDensity/index.vue')
  },
  // 4.全球航班地球可视化
  {
    name: '3dEarth',
    path: '/3dEarth',
    meta: {
      title: '3dEarth'
    },
    component: () => import('@/views/Examples/Visualization/Earth/index.vue')
  },
  // 8.智慧城市管理大屏可视化
  {
    name: 'SmartCity',
    path: '/smartCity',
    meta: {
      title: 'SmartCity'
    },
    component: () =>
      import('@/views/Examples/Visualization/SmartCity/index.vue')
  }
]

export { VisualizationRoutes }
