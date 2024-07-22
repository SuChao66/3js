// 导入类型
import type { RouteRecordRaw } from 'vue-router'
// 元宇宙
import { MataverseRoutes } from './mataverse'
// 数字孪生
import { DigitalTwinsRoutes } from './digitalTwins'
// 3D展览
import { ExhibitionRoutes } from './exhibition'
// 3D可视化
import { VisualizationRoutes } from './visualization'
// shader案例
import { ShadersRoutes } from './shaders'
// cesium案例
import { CesiumRoutes } from './cesium'

const exampleRoutes: Array<RouteRecordRaw> = [
  ...MataverseRoutes,
  ...DigitalTwinsRoutes,
  ...ExhibitionRoutes,
  ...VisualizationRoutes,
  ...ShadersRoutes,
  ...CesiumRoutes
]

export { exampleRoutes }
