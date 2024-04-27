// 导入类型
import type { RouteRecordRaw } from 'vue-router'
// 数字孪生
import { DigitalTwinsRoutes } from './digitalTwins'
// 3D展览
import { ExhibitionRoutes } from './exhibition'

const exampleRoutes: Array<RouteRecordRaw> = [
  ...DigitalTwinsRoutes,
  ...ExhibitionRoutes
]

export { exampleRoutes }
