// 导入类型
import type { RouteRecordRaw } from 'vue-router'

const ShadersRoutes: Array<RouteRecordRaw> = [
  // 1.粒子群效果
  {
    name: 'ParticleSwarms',
    path: '/particleSwarms',
    meta: {
      title: 'ParticleSwarms'
    },
    component: () =>
      import('@/views/Examples/ShadersExp/ParticleSwarms/index.vue')
  },
  // 2.烟雾水云效果
  {
    name: 'WaterFlow',
    path: '/waterFlow',
    meta: {
      title: 'WaterFlow'
    },
    component: () => import('@/views/Examples/ShadersExp/WaterFlow/index.vue')
  },
  // 3.星辰大海
  {
    name: 'StarsSea',
    path: '/starsSea',
    meta: {
      title: 'StarsSea'
    },
    component: () => import('@/views/Examples/ShadersExp/StarsSea/index.vue')
  }
]

export { ShadersRoutes }
