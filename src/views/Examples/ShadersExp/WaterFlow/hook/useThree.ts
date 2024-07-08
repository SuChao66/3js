// 导入hooks
import {
  useScene,
  useCamera,
  useStatus,
  useRenderer,
  useControls,
  useHdr
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()

  // 1.1.创建场景
  const scene = useScene()
  // 1.2.设置天空盒
  useHdr({ path: './hdr/sky1.hdr', scene })
  // 1.5.创建相机
  const camera = initPerspectiveCamera({
    fov: 30,
    position: cameraPos,
    lookAt: cameraTarget,
    near: 0.1,
    far: 500
  })
  // 1.6.创建渲染器
  const renderer = useRenderer(canvas)
  // 1.7.初始化性能监视器
  const status = useStatus()
  // 1.8.初始化相机控件
  const controls = initControls({ camera, renderer })
  // 开启缓动动画
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = true

  return {
    scene,
    camera,
    renderer,
    controls,
    status
  }
}
