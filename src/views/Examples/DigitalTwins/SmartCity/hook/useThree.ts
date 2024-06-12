import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useControls,
  useAxesHelper,
  useLon2Mercator,
  useFog
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initAmbientLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()
  const { initFog } = useFog()

  // 1.1.创建场景
  const scene = useScene()
  // 设置背景纹理
  initFog({
    color: 0x001111,
    near: 100,
    far: 12000,
    scene
  })
  scene.background = new THREE.Color(0x001111)
  // 箭头辅助器
  useAxesHelper({
    size: 200,
    scene: scene,
    position: cameraTarget
  })
  // 1.4.设置光源
  initAmbientLight({ scene, density: 0.6 })
  // 1.5.创建相机
  const { x, y } = useLon2Mercator(cameraTarget.x, cameraTarget.y)
  const camera = initPerspectiveCamera({
    position: cameraPos,
    lookAt: new THREE.Vector3(x, y, 0),
    near: 1,
    far: 30000
  })
  // 1.6.创建渲染器
  const renderer = useRenderer(canvas)
  // 1.7.初始化性能监视器
  const status = useStatus()
  // 1.8.初始化相机控件
  const controls = initControls({ camera, renderer })
  controls.target.set(x, y, 0)
  controls.update()
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
