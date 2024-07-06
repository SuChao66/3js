// 导入类型
import type { RouteRecordRaw } from 'vue-router'
// 数字孪生
import { DigitalTwinsRoutes } from './digitalTwins'
// 3D展览
import { ExhibitionRoutes } from './exhibition'
// 3D可视化
import { VisualizationRoutes } from './visualization'
// shader案例
import { ShadersRoutes } from './shaders'

const exampleRoutes: Array<RouteRecordRaw> = [
  ...DigitalTwinsRoutes,
  ...ExhibitionRoutes,
  ...VisualizationRoutes,
  ...ShadersRoutes
]

export { exampleRoutes }
