import { createRouter, createWebHashHistory } from 'vue-router'
// 导入类型
import type { RouteRecordRaw } from 'vue-router'
// 导入NProgress
import { NProgress } from '@/global'
// 导入路由
import { exampleRoutes } from './exampleRoutes'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    meta: {
      title: 'Home'
    },
    component: () => import('@/views/Home/index.vue')
  },
  ...exampleRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
