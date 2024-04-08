import { createRouter, createWebHashHistory } from 'vue-router'
// 导入类型
import type { RouteRecordRaw } from 'vue-router'
// 导入NProgress
import { NProgress } from '@/global'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    meta: {
      title: 'Home'
    },
    component: () => import('@/views/Home/index.vue')
  },
  // 页面不存在时的路由
  {
    name: 'About',
    path: '/about',
    meta: {
      title: 'About'
    },
    component: () => import('@/views/About/index.vue')
  }
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
