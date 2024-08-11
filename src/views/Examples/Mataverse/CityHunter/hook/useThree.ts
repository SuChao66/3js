import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useCamera,
  useStatus,
  useRenderer,
  useHdr,
  useLights,
  useControls
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initPerspectiveCamera } = useCamera()
  const { initAmbientLight } = useLights()
  const { initControls } = useControls()

  // 1.1.创建场景
  const scene = useScene()
  // 1.2.设置背景
  useHdr({
    path: './hdr/sky2.hdr',
    scene
  })
  // 1.3.添加光照
  initAmbientLight({ scene, density: 0.6 })
  // 1.5.创建相机
  const camera = initPerspectiveCamera({
    fov: 45,
    position: cameraPos,
    lookAt: cameraTarget,
    near: 0.1,
    far: 1000
  })
  // 1.6.创建渲染器
  const renderer = useRenderer(canvas)
  renderer.physicallyCorrectLights = true
  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  // 色调映射的曝光级别
  renderer.toneMappingExposure = 2
  // 1.7.初始化性能监视器
  const status = useStatus()
  // 1.8.初始化控制器
  const controls = initControls({ camera, renderer })
  // 设置上下旋转的角度
  controls.maxPolarAngle = THREE.MathUtils.degToRad(89)
  controls.maxDistance = 30

  return {
    scene,
    camera,
    renderer,
    status,
    controls
  }
}
