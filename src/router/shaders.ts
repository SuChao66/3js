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
  }
]

export { ShadersRoutes }
