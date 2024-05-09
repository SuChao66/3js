import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useControls,
  useAxesHelper
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget, s } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initOrthographicCamera } = useCamera()
  const { initControls } = useControls()

  // 1.1.创建场景
  const scene = useScene()
  scene.background = new THREE.Color(0x000000)
  // 箭头辅助器
  useAxesHelper({ size: 120, scene: scene })
  // 1.4.设置光源
  initAmbientLight({ scene, density: 0.6 })
  initDirectionalLight({
    scene,
    density: 0.6,
    position: new THREE.Vector3(400, 200, 300),
    name: '平行光1'
  })
  initDirectionalLight({
    scene,
    density: 0.6,
    position: new THREE.Vector3(-400, -200, -300),
    name: '平行光2'
  })
  // 1.5.创建相机
  const camera = initOrthographicCamera({
    s: s,
    position: cameraPos,
    lookAt: cameraTarget
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
  // update()函数内会执行camera.lookAt(controls.target)
  controls.target.copy(cameraTarget)
  controls.update()

  return {
    scene,
    camera,
    renderer,
    controls,
    status
  }
}
